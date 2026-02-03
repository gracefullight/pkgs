export interface DeviceInfo {
  manufacturer: string;
  model: string;
  osName: string;
  osVersion: string;
  imei: string;
  imsi: string;
  msisdn: string;
  firmwareRevision: string;
  diagnosticRevision: string;
  buildDate: string;
  buildVersion: string;
  label: string;
  usingExternalDecoder: boolean;
  supportedApps: string[];
}

export interface ChannelInfo {
  channelId: string;
  instanceGuid: string;
  category: string;
  producer: string;
  elementCount: number;
  logSizeBytes: number;
}

export interface TimeInfo {
  startTime: Date | null;
  stopTime: Date | null;
  timezone: string;
  utcOffsetMinutes: number;
}

export interface TRPMetadata {
  guid: string;
  subject: string;
  description: string;
  tags: string[];
  probeIdentity: string;
  probeCompany: string;
  probeFamily: string;
  probeVersion: string;
  coreVersion: string;
  subsystem: string;
  timeInfo: TimeInfo;
  deviceInfo: DeviceInfo;
  channels: ChannelInfo[];
  status: string;
  creator: string;
}

export type WireType = 0 | 1 | 2 | 5;

export interface ParsedField {
  fieldNum: number;
  wireType: WireType;
  value: number | Uint8Array;
  endPos: number;
}

export type RFRecord = Record<string, number | string>;

export type OutputFormat = "csv" | "json" | "jsonl";

export interface ExtractOptions {
  output?: string;
  format?: OutputFormat;
}

export function createDefaultDeviceInfo(): DeviceInfo {
  return {
    manufacturer: "",
    model: "",
    osName: "",
    osVersion: "",
    imei: "",
    imsi: "",
    msisdn: "",
    firmwareRevision: "",
    diagnosticRevision: "",
    buildDate: "",
    buildVersion: "",
    label: "",
    usingExternalDecoder: false,
    supportedApps: [],
  };
}

export function createDefaultChannelInfo(): ChannelInfo {
  return {
    channelId: "",
    instanceGuid: "",
    category: "",
    producer: "",
    elementCount: 0,
    logSizeBytes: 0,
  };
}

export function createDefaultTimeInfo(): TimeInfo {
  return {
    startTime: null,
    stopTime: null,
    timezone: "",
    utcOffsetMinutes: 0,
  };
}

export function createDefaultTRPMetadata(): TRPMetadata {
  return {
    guid: "",
    subject: "",
    description: "",
    tags: [],
    probeIdentity: "",
    probeCompany: "",
    probeFamily: "",
    probeVersion: "",
    coreVersion: "",
    subsystem: "",
    timeInfo: createDefaultTimeInfo(),
    deviceInfo: createDefaultDeviceInfo(),
    channels: [],
    status: "",
    creator: "",
  };
}
