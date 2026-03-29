#!/usr/bin/env node
import { existsSync } from "node:fs";
import { parseArgs } from "node:util";
import { aggregateToRfCsv } from "@/aggregate";
import { extract } from "@/extract";
import { TRPParser } from "@/trp-parser";
import type { TRPMetadata } from "@/types";

function datetimeSerializer(_key: string, value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
}

function printIfValue(label: string, value: string | number | undefined): void {
  if (value !== undefined && value !== "") {
    console.log(`   ${label}: ${value}`);
  }
}

function printRecordingTime(metadata: TRPMetadata): void {
  const { timeInfo } = metadata;

  console.log("\nRecording Time:");
  if (timeInfo.startTime) {
    console.log(`   Start: ${timeInfo.startTime.toISOString()}`);
  }
  if (timeInfo.stopTime) {
    console.log(`   Stop:  ${timeInfo.stopTime.toISOString()}`);
  }
  printIfValue("Timezone", timeInfo.timezone);

  if (timeInfo.utcOffsetMinutes) {
    const hours = timeInfo.utcOffsetMinutes / 60;
    const sign = hours >= 0 ? "+" : "";
    console.log(`   UTC Offset: ${sign}${hours}h`);
  }

  if (timeInfo.startTime && timeInfo.stopTime) {
    const durationMs = timeInfo.stopTime.getTime() - timeInfo.startTime.getTime();
    const durationSec = durationMs / 1000;
    console.log(`   Duration: ${durationSec.toFixed(1)} seconds`);
  }
}

function printProbeInformation(metadata: TRPMetadata): void {
  console.log("\nProbe Information:");
  console.log(`   Identity: ${metadata.probeIdentity}`);
  console.log(`   Company: ${metadata.probeCompany}`);
  console.log(`   Family: ${metadata.probeFamily}`);
  console.log(`   Version: ${metadata.probeVersion}`);
  printIfValue("Core Version", metadata.coreVersion);
  console.log(`   Subsystem: ${metadata.subsystem}`);
}

function printDeviceInformation(metadata: TRPMetadata): void {
  const device = metadata.deviceInfo;

  console.log("\nDevice Information:");
  console.log(`   Manufacturer: ${device.manufacturer}`);
  console.log(`   Model: ${device.model}`);
  console.log(`   OS: ${device.osName} ${device.osVersion}`);
  printIfValue("IMEI", device.imei);
  printIfValue("Firmware", device.firmwareRevision);
  printIfValue("Label", device.label);
  if (device.usingExternalDecoder) {
    console.log("   External Decoder: Yes");
  }
}

function printDataChannels(metadata: TRPMetadata): void {
  console.log("\nData Channels:");
  console.log("-".repeat(50));
  console.log(
    `${"Channel".padEnd(10)} ${"Category".padEnd(15)} ${"Producer".padEnd(20)} ${"Elements".padStart(8)}`,
  );
  console.log("-".repeat(50));
  for (const ch of metadata.channels) {
    console.log(
      `${ch.channelId.padEnd(10)} ${ch.category.padEnd(15)} ${ch.producer.padEnd(20)} ${String(ch.elementCount).padStart(8)}`,
    );
  }
  console.log("-".repeat(50));
}

function printSupportedTestTypes(metadata: TRPMetadata): void {
  const visibleApps = metadata.deviceInfo.supportedApps
    .slice()
    .sort()
    .filter((app) => !app.startsWith("?"));

  if (visibleApps.length === 0) {
    return;
  }

  console.log("\nSupported Test Types:");
  for (const app of visibleApps) {
    console.log(`   - ${app}`);
  }
}

function printMetadataText(metadata: TRPMetadata, filePath: string): void {
  console.log("=".repeat(60));
  console.log("TEMS TRP RF Log File Analysis");
  console.log("=".repeat(60));

  const fileName = filePath.split("/").pop() ?? filePath;
  console.log(`\nFile: ${fileName}`);
  console.log(`   GUID: ${metadata.guid}`);

  printRecordingTime(metadata);
  printProbeInformation(metadata);
  printDeviceInformation(metadata);

  if (metadata.tags.length > 0) {
    console.log(`\nTags: ${metadata.tags.join(", ")}`);
  }

  printDataChannels(metadata);
  printSupportedTestTypes(metadata);

  console.log(`\n${"=".repeat(60)}`);
}

function printMetadataJson(metadata: TRPMetadata): void {
  console.log(JSON.stringify(metadata, datetimeSerializer, 2));
}

function handleCommand(
  trpFile: string,
  values: Record<string, string | boolean | undefined>,
): number {
  if (values.aggregate && typeof values.aggregate === "string") {
    aggregateToRfCsv(trpFile, values.aggregate);
    return 0;
  }

  if (values.export && typeof values.export === "string") {
    extract(trpFile, { output: values.export });
    return 0;
  }

  const parser = new TRPParser(trpFile);

  if (values.list) {
    console.log("Files in TRP archive:");
    for (const path of parser.listContents()) {
      console.log(`  ${path}`);
    }
    return 0;
  }

  if (values.extract && typeof values.extract === "string") {
    parser.extractTo(values.extract);
    console.log(`Extracted to: ${values.extract}`);
  }

  const metadata = parser.parse();

  if (values.json) {
    printMetadataJson(metadata);
  } else {
    printMetadataText(metadata, trpFile);
  }

  return 0;
}

function main(): number {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      extract: {
        type: "string",
        short: "e",
      },
      json: {
        type: "boolean",
        short: "j",
        default: false,
      },
      list: {
        type: "boolean",
        short: "l",
        default: false,
      },
      export: {
        type: "string",
      },
      aggregate: {
        type: "string",
      },
      help: {
        type: "boolean",
        short: "h",
        default: false,
      },
    },
  });

  const trpFile = positionals[0];

  if (values.help || !trpFile) {
    console.log(`Usage: tems-trp <trp_file> [options]

Options:
  -e, --extract <dir>   Extract all files to the specified directory
  -j, --json            Output metadata as JSON instead of text
  -l, --list            List all files in the TRP archive
  --export <file>       Export RF measurements to CSV/JSON/NDJSON file
  --aggregate <file>    Aggregate a sparse extracted CSV into per-timestamp RF snapshots
  -h, --help            Show this help message

Examples:
  tems-trp logs/20231004T150530Z.trp
  tems-trp logs/20231004T150530Z.trp --extract output/
  tems-trp logs/20231004T150530Z.trp --json
  tems-trp logs/20231004T150530Z.trp --export output.csv`);
    return values.help ? 0 : 1;
  }

  if (!existsSync(trpFile)) {
    console.error(`Error: File not found: ${trpFile}`);
    return 1;
  }

  try {
    return handleCommand(trpFile, values);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error parsing TRP file: ${message}`);
    return 1;
  }
}

const exitCode = main();
process.exit(exitCode);
