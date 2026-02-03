#!/usr/bin/env node
import { existsSync } from "node:fs";
import { parseArgs } from "node:util";
import { extract } from "@/extract";
import { TRPParser } from "@/trp-parser";
import type { TRPMetadata } from "@/types";

function datetimeSerializer(_key: string, value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
}

function printMetadataText(metadata: TRPMetadata, filePath: string): void {
  console.log("=".repeat(60));
  console.log("TEMS TRP RF Log File Analysis");
  console.log("=".repeat(60));

  const fileName = filePath.split("/").pop() ?? filePath;
  console.log(`\nFile: ${fileName}`);
  console.log(`   GUID: ${metadata.guid}`);

  console.log("\nRecording Time:");
  if (metadata.timeInfo.startTime) {
    console.log(`   Start: ${metadata.timeInfo.startTime.toISOString()}`);
  }
  if (metadata.timeInfo.stopTime) {
    console.log(`   Stop:  ${metadata.timeInfo.stopTime.toISOString()}`);
  }
  if (metadata.timeInfo.timezone) {
    console.log(`   Timezone: ${metadata.timeInfo.timezone}`);
  }
  if (metadata.timeInfo.utcOffsetMinutes) {
    const hours = metadata.timeInfo.utcOffsetMinutes / 60;
    const sign = hours >= 0 ? "+" : "";
    console.log(`   UTC Offset: ${sign}${hours}h`);
  }

  if (metadata.timeInfo.startTime && metadata.timeInfo.stopTime) {
    const durationMs = metadata.timeInfo.stopTime.getTime() - metadata.timeInfo.startTime.getTime();
    const durationSec = durationMs / 1000;
    console.log(`   Duration: ${durationSec.toFixed(1)} seconds`);
  }

  console.log("\nProbe Information:");
  console.log(`   Identity: ${metadata.probeIdentity}`);
  console.log(`   Company: ${metadata.probeCompany}`);
  console.log(`   Family: ${metadata.probeFamily}`);
  console.log(`   Version: ${metadata.probeVersion}`);
  if (metadata.coreVersion) {
    console.log(`   Core Version: ${metadata.coreVersion}`);
  }
  console.log(`   Subsystem: ${metadata.subsystem}`);

  const device = metadata.deviceInfo;
  console.log("\nDevice Information:");
  console.log(`   Manufacturer: ${device.manufacturer}`);
  console.log(`   Model: ${device.model}`);
  console.log(`   OS: ${device.osName} ${device.osVersion}`);
  if (device.imei) {
    console.log(`   IMEI: ${device.imei}`);
  }
  if (device.firmwareRevision) {
    console.log(`   Firmware: ${device.firmwareRevision}`);
  }
  if (device.label) {
    console.log(`   Label: ${device.label}`);
  }
  if (device.usingExternalDecoder) {
    console.log("   External Decoder: Yes");
  }

  if (metadata.tags.length > 0) {
    console.log(`\nTags: ${metadata.tags.join(", ")}`);
  }

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

  if (device.supportedApps.length > 0) {
    console.log("\nSupported Test Types:");
    for (const app of device.supportedApps.sort()) {
      if (!app.startsWith("?")) {
        console.log(`   - ${app}`);
      }
    }
  }

  console.log(`\n${"=".repeat(60)}`);
}

function printMetadataJson(metadata: TRPMetadata): void {
  console.log(JSON.stringify(metadata, datetimeSerializer, 2));
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
      help: {
        type: "boolean",
        short: "h",
        default: false,
      },
    },
  });

  if (values.help || positionals.length === 0) {
    console.log(`Usage: tems-trp <trp_file> [options]

Options:
  -e, --extract <dir>   Extract all files to the specified directory
  -j, --json            Output metadata as JSON instead of text
  -l, --list            List all files in the TRP archive
  --export <file>       Export RF measurements to CSV/JSON/NDJSON file
  -h, --help            Show this help message

Examples:
  tems-trp logs/20231004T150530Z.trp
  tems-trp logs/20231004T150530Z.trp --extract output/
  tems-trp logs/20231004T150530Z.trp --json
  tems-trp logs/20231004T150530Z.trp --export output.csv`);
    return values.help ? 0 : 1;
  }

  const trpFile = positionals[0]!;

  if (!existsSync(trpFile)) {
    console.error(`Error: File not found: ${trpFile}`);
    return 1;
  }

  try {
    if (values.export) {
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

    if (values.extract) {
      parser.extractTo(values.extract);
      console.log(`Extracted to: ${values.extract}`);
    }

    const metadata = parser.parse();

    if (values.json) {
      printMetadataJson(metadata);
    } else {
      printMetadataText(metadata, trpFile);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error parsing TRP file: ${message}`);
    return 1;
  }

  return 0;
}

const exitCode = main();
process.exit(exitCode);
