import { inflateSync } from "node:zlib";
import AdmZip from "adm-zip";
import { XMLParser } from "fast-xml-parser";
import type { ChannelInfo, TRPMetadata } from "@/types";
import { createDefaultChannelInfo, createDefaultTRPMetadata } from "@/types";

export class TRPParser {
  private zip: AdmZip;
  private xmlParser: XMLParser;

  constructor(trpPath: string) {
    this.zip = new AdmZip(trpPath);
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      removeNSPrefix: false,
      parseTagValue: true,
      trimValues: true,
    });
  }

  listContents(): string[] {
    return this.zip.getEntries().map((entry) => entry.entryName);
  }

  private readXml(path: string): unknown | null {
    try {
      const entry = this.zip.getEntry(path);
      if (!entry) return null;
      const buffer = this.zip.readFile(entry);
      if (!buffer) return null;
      const content = buffer.toString("utf-8");
      return this.xmlParser.parse(content);
    } catch {
      return null;
    }
  }

  private getText(obj: unknown, ...keys: string[]): string {
    let current: unknown = obj;
    for (const key of keys) {
      if (current === null || current === undefined) return "";
      if (typeof current !== "object") return "";
      const record = current as Record<string, unknown>;

      const nsKey = `tems:${key}`;
      if (nsKey in record) {
        current = record[nsKey];
      } else if (key in record) {
        current = record[key];
      } else {
        return "";
      }
    }
    if (typeof current === "string") return current.trim();
    if (typeof current === "number") return String(current);
    if (current && typeof current === "object" && "#text" in current) {
      return String((current as { "#text": unknown })["#text"]).trim();
    }
    return "";
  }

  private parseVersion(versionObj: unknown): string {
    if (!versionObj || typeof versionObj !== "object") return "";
    const v = versionObj as Record<string, unknown>;

    const parts: string[] = [];
    for (const key of ["sys:_Major", "sys:_Minor", "sys:_Build", "sys:_Revision"]) {
      const val = v[key];
      if (typeof val === "number" && val >= 0) {
        parts.push(String(val));
      } else if (typeof val === "string") {
        const num = parseInt(val, 10);
        if (!Number.isNaN(num) && num >= 0) {
          parts.push(val);
        }
      }
    }
    return parts.join(".");
  }

  private parseDateTime(timeStr: string): Date | null {
    if (!timeStr) return null;

    const formats = [
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/,
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/,
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+$/,
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,
    ];

    for (const format of formats) {
      if (format.test(timeStr)) {
        const date = new Date(timeStr);
        if (!Number.isNaN(date.getTime())) return date;
      }
    }

    return null;
  }

  private parseContentXml(metadata: TRPMetadata): void {
    const root = this.readXml("trp/content.xml");
    if (!root || typeof root !== "object") return;

    const doc = root as Record<string, unknown>;
    const content = doc["tems:ChannelContent"] ?? doc.ChannelContent;
    if (!content || typeof content !== "object") return;

    const c = content as Record<string, unknown>;

    const identity = c["tems:Identity"] as Record<string, unknown> | undefined;
    if (identity) {
      const guid = identity["tems:Guid"];
      if (typeof guid === "string") metadata.guid = guid;
    }

    metadata.subject = this.getText(c, "Subject");
    metadata.description = this.getText(c, "Description");

    const tagsText = this.getText(c, "Tags");
    if (tagsText) {
      metadata.tags = tagsText
        .split(";")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const probe = c["tems:Probe"] as Record<string, unknown> | undefined;
    if (probe) {
      metadata.probeIdentity = this.getText(probe, "ProbeIdentity");
      metadata.probeCompany = this.getText(probe, "Company");
      metadata.probeFamily = this.getText(probe, "Family");
      metadata.subsystem = this.getText(probe, "Subsystem");
      metadata.probeVersion = this.parseVersion(probe["tems:Version"]);
      metadata.coreVersion = this.parseVersion(probe["tems:CoreVersion"]);
    }

    const time = c["tems:Time"] as Record<string, unknown> | undefined;
    if (time) {
      const startTime = time["tems:StartTime"] as Record<string, unknown> | undefined;
      if (startTime) {
        const timeStr = this.getText(startTime, "Time");
        metadata.timeInfo.startTime = this.parseDateTime(timeStr);
        metadata.timeInfo.timezone = this.getText(startTime, "TimeZoneIdentifier");
        const offsetStr = this.getText(startTime, "UtcOffset");
        if (offsetStr) {
          metadata.timeInfo.utcOffsetMinutes = parseInt(offsetStr, 10) || 0;
        }
      }

      const stopTime = time["tems:StopTime"] as Record<string, unknown> | undefined;
      if (stopTime) {
        const timeStr = this.getText(stopTime, "Time");
        metadata.timeInfo.stopTime = this.parseDateTime(timeStr);
      }
    }

    const status = c["tems:Status"] as Record<string, unknown> | undefined;
    if (status) {
      const val = status["tems:Value"];
      if (typeof val === "string") metadata.status = val;
    }

    const creator = c["tems:Creator"] as Record<string, unknown> | undefined;
    if (creator) {
      const userName = creator["tems:UserName"];
      if (typeof userName === "string") metadata.creator = userName;
    }
  }

  private parseSystemInfoXml(metadata: TRPMetadata): void {
    const root = this.readXml("trp/systeminformation.xml");
    if (!root || typeof root !== "object") return;

    const doc = root as Record<string, unknown>;
    const sysInfo = doc["tems:SystemInformation"] ?? doc.SystemInformation;
    if (!sysInfo || typeof sysInfo !== "object") return;

    const s = sysInfo as Record<string, unknown>;
    const device = metadata.deviceInfo;

    const computer = s["tems:Computer"] as Record<string, unknown> | undefined;
    if (computer) {
      device.manufacturer = this.getText(computer, "Manufacturer");
      device.model = this.getText(computer, "Model");
    }

    const os = s["tems:OperationSystem"] as Record<string, unknown> | undefined;
    if (os) {
      device.osName = this.getText(os, "Caption");
      device.osVersion = this.parseVersion(os["tems:Version"]);
    }
  }

  private findProviderRoot(): string | null {
    for (const entry of this.zip.getEntries()) {
      if (entry.entryName.endsWith("/serviceprovider.xml")) {
        const parts = entry.entryName.split("/");
        parts.pop();
        return parts.join("/");
      }
    }
    return null;
  }

  private parseServiceProviderXml(metadata: TRPMetadata): void {
    const providerRoot = this.findProviderRoot();
    if (!providerRoot) return;

    const root = this.readXml(`${providerRoot}/serviceprovider.xml`);
    if (!root || typeof root !== "object") return;

    const doc = root as Record<string, unknown>;
    const provider = doc["tems:ServiceProvider"] ?? doc.ServiceProvider;
    if (!provider || typeof provider !== "object") return;

    const p = provider as Record<string, unknown>;
    const properties = p["tems:Properties"];
    if (!properties || typeof properties !== "object") return;

    const props = properties as Record<string, unknown>;
    let propList = props["tems:Property"];
    if (!propList) return;

    if (!Array.isArray(propList)) propList = [propList];

    const device = metadata.deviceInfo;
    for (const prop of propList as Array<Record<string, unknown>>) {
      const name = prop["tems:Name"];
      const valueObj = prop["tems:Value"];

      if (typeof name !== "string") continue;
      const value =
        typeof valueObj === "string"
          ? valueObj.trim()
          : typeof valueObj === "number"
            ? String(valueObj)
            : "";

      switch (name) {
        case "IMEI":
          device.imei = value;
          break;
        case "IMSI":
          device.imsi = value;
          break;
        case "MSISDN":
          device.msisdn = value;
          break;
        case "Revision":
          device.firmwareRevision = value;
          break;
        case "DiagnosticRevision":
          device.diagnosticRevision = value;
          break;
        case "BuildDate":
          device.buildDate = value;
          break;
        case "BuildVersion":
          device.buildVersion = value;
          break;
        case "Label":
          device.label = value;
          break;
        case "UsingExternalDecoder":
          device.usingExternalDecoder = value.toLowerCase() === "yes";
          break;
        case "OnDeviceSupportedApk":
          if (valueObj && typeof valueObj === "object") {
            const vo = valueObj as Record<string, unknown>;
            let strings = vo["arr:string"];
            if (strings) {
              if (!Array.isArray(strings)) strings = [strings];
              device.supportedApps = (strings as unknown[]).filter(
                (s): s is string => typeof s === "string",
              );
            }
          }
          break;
      }
    }
  }

  private parseChannels(metadata: TRPMetadata): void {
    const providerRoot = this.findProviderRoot();
    if (!providerRoot) return;

    const channelsRoot = `${providerRoot}/channels`;
    const channelDirs = new Set<string>();

    for (const entry of this.zip.getEntries()) {
      if (entry.entryName.startsWith(channelsRoot) && entry.entryName.includes("/ch")) {
        const relPath = entry.entryName.slice(channelsRoot.length + 1);
        const parts = relPath.split("/");
        if (parts.length > 0 && parts[0]?.startsWith("ch")) {
          channelDirs.add(parts[0]);
        }
      }
    }

    for (const chId of [...channelDirs].sort()) {
      const chInfo: ChannelInfo = {
        ...createDefaultChannelInfo(),
        channelId: chId,
      };

      const xmlPath = `${channelsRoot}/${chId}/serviceproviderchannel.xml`;
      const root = this.readXml(xmlPath);
      if (root && typeof root === "object") {
        const doc = root as Record<string, unknown>;
        const channel = doc["tems:ServiceProviderChannel"] ?? doc.ServiceProviderChannel;
        if (channel && typeof channel === "object") {
          const c = channel as Record<string, unknown>;
          const properties = c["tems:Properties"];
          if (properties && typeof properties === "object") {
            const props = properties as Record<string, unknown>;
            let propList = props["tems:Property"];
            if (propList) {
              if (!Array.isArray(propList)) propList = [propList];

              for (const prop of propList as Array<Record<string, unknown>>) {
                const name = prop["tems:Name"];
                const valueObj = prop["tems:Value"];

                if (typeof name !== "string") continue;

                switch (name) {
                  case "ElementCount":
                    if (typeof valueObj === "number") {
                      chInfo.elementCount = valueObj;
                    } else if (typeof valueObj === "string") {
                      chInfo.elementCount = parseInt(valueObj, 10) || 0;
                    }
                    break;
                  case "ChannelCategory":
                    if (valueObj && typeof valueObj === "object") {
                      const vo = valueObj as Record<string, unknown>;
                      const val = vo["tems:Value"];
                      if (typeof val === "string") chInfo.category = val;
                    }
                    break;
                  case "InstanceIdentity":
                    if (valueObj && typeof valueObj === "object") {
                      const vo = valueObj as Record<string, unknown>;
                      const guid = vo["tems:Guid"];
                      if (typeof guid === "string") chInfo.instanceGuid = guid;
                    }
                    break;
                  case "ProducerIdentity":
                    if (valueObj && typeof valueObj === "object") {
                      const vo = valueObj as Record<string, unknown>;
                      const val = vo["tems:Value"];
                      if (typeof val === "string") chInfo.producer = val;
                    }
                    break;
                }
              }
            }
          }
        }
      }

      const logPath = `${channelsRoot}/${chId}/channel.log`;
      const logEntry = this.zip.getEntry(logPath);
      if (logEntry) {
        chInfo.logSizeBytes = logEntry.header.size;
      }

      metadata.channels.push(chInfo);
    }
  }

  parse(): TRPMetadata {
    const metadata = createDefaultTRPMetadata();

    this.parseContentXml(metadata);
    this.parseSystemInfoXml(metadata);
    this.parseServiceProviderXml(metadata);
    this.parseChannels(metadata);

    return metadata;
  }

  extractTo(outputDir: string): string {
    this.zip.extractAllTo(outputDir, true);
    return outputDir;
  }

  tryDecompressCdf(cdfPath: string): Uint8Array | null {
    try {
      const entry = this.zip.getEntry(cdfPath);
      if (!entry) return null;
      const buffer = this.zip.readFile(entry);
      if (!buffer) return null;

      const isNullHeader = buffer.subarray(0, 8).every((b) => b === 0);
      if (isNullHeader) {
        return new Uint8Array(inflateSync(buffer.subarray(8)));
      }
      return new Uint8Array(inflateSync(buffer));
    } catch {
      return null;
    }
  }

  getCdfPaths(): string[] {
    return this.zip
      .getEntries()
      .filter((e) => e.entryName.endsWith(".cdf"))
      .map((e) => e.entryName);
  }

  getChannelLogPaths(): string[] {
    return this.zip
      .getEntries()
      .filter((e) => e.entryName.endsWith("channel.log"))
      .map((e) => e.entryName);
  }
}

export function parse(trpPath: string): TRPMetadata {
  const parser = new TRPParser(trpPath);
  return parser.parse();
}
