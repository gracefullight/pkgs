/**
 * TEMS TRP Field Constants.
 *
 * This module contains all field ID mappings extracted from declarations.cdf.
 * Use ALL_FIELD_IDS for complete field mapping, or RF_FIELD_IDS for RF-specific fields.
 */

// =============================================================================
// ALL FIELD IDS - Complete mapping from declarations.cdf (360 fields)
// =============================================================================
export const ALL_FIELD_IDS: Record<number, string> = {
  // -------------------------------------------------------------------------
  // General / System Information
  // -------------------------------------------------------------------------
  1: "General.ServiceProvider.AvailableMemory",
  20: "General.ServiceProvider.CpuTemperature[16]",
  36: "General.ServiceProvider.CpuTemperatureCount",
  37: "General.ServiceProvider.BatteryTemperature",
  38: "General.ServiceProvider.ThermalMitigation",
  39: "General.ServiceProvider.BatteryLevel",
  45: "General.ServiceProvider.CpuThrottlingTemperatureCount",
  3107077: "General.ServiceProvider.CpuTotalTimeCount",
  3107078: "General.ServiceProvider.CpuActiveTimeCount",
  3107200: "General.ServiceProvider.BatteryRemainingChargeTime",
  3107301: "General.ServiceProvider.BarometricPressure",
  3107302: "General.ServiceProvider.BarometricAltitude",
  3107303: "General.ServiceProvider.BarometricAltitudeAccuracy",
  // -------------------------------------------------------------------------
  // Location
  // -------------------------------------------------------------------------
  537: "Location.QualityIndicator",
  3106708: "Pocket.Location.State",
  3106709: "Pocket.Location.Validity",
  // -------------------------------------------------------------------------
  // WiFi Measurements
  // -------------------------------------------------------------------------
  2231: "Radio.Wifi.Cell[64].Ssid",
  2295: "Radio.Wifi.Cell[64].Bssid",
  2359: "Radio.Wifi.Cell[64].Rssi",
  2743: "Radio.Wifi.Cell[64].Channel",
  3106980: "Radio.Wifi.ConnectionLinkSpeed",
  3106988: "Radio.Wifi.Status.LocationStatus",
  3106990: "Radio.Wifi.Status.ActivityState",
  3106992: "Wifi.WifiRadioState",
  3106993: "Wifi.ScanState",
  3106996: "Wifi.ConnectionLinkSpeed",
  3107001: "Wifi.ConnectionBssid",
  3107196: "Wifi.ScanForCellsText",
  3107199: "Pocket.Radio.Wifi.Cell[64].CellShortCap",
  3107263: "Radio.Wifi.Cell[64].CellColorIdx",
  3107264: "Radio.Wifi.Cell[64].CellFrequency",
  3107266: "Radio.Wifi.Cell[64].CellCapabilities",
  // -------------------------------------------------------------------------
  // Common Radio / MRDC (Multi-RAT Dual Connectivity - 5G NR + LTE)
  // -------------------------------------------------------------------------
  3231: "Radio.Common.ServingCellChangedEvent",
  3308: "Radio.Common.Mrdc.Cell[64].Rsrq",
  3372: "Radio.Common.Mrdc.Cell[64].Rsrp",
  3436: "Radio.Common.Mrdc.Cell[64].Type",
  3500: "Radio.Common.Mrdc.Cell[64].Sinr",
  3564: "Radio.Common.Mrdc.Cell[64].Band",
  3628: "Radio.Common.Mrdc.Cell[64].Pci",
  3756: "Radio.Common.Mrdc.Cell[64].Technology",
  3820: "Radio.Common.Mrdc.Cell[64].Channel",
  4090: "Radio.Common.Layer3MessageEvent",
  4145: "Radio.Common.Technology",
  3106722: "Radio.Common.Uplink.LowLevelThroughput",
  3106723: "Radio.Common.Downlink.LowLevelThroughput",
  // -------------------------------------------------------------------------
  // LTE Cell Statistics
  // -------------------------------------------------------------------------
  4568: "Radio.Lte.CellParameters.QRxLevMin",
  4570: "Radio.Lte.CellStatistics[20].Pci",
  4590: "Radio.Lte.CellStatistics[20].Earfcn",
  4610: "Radio.Lte.CellStatistics[20].PdschByteCount",
  // -------------------------------------------------------------------------
  // LTE Serving System
  // -------------------------------------------------------------------------
  4631: "Radio.Lte.ServingSystem.EmmState",
  4633: "Radio.Lte.ServingSystem.Tac",
  4973: "Radio.Lte.Rach.ContentionResolutionTimer",
  4979: "Radio.Lte.ServingCellCount",
  3107088: "Radio.ServingSystem.Mcc",
  3107089: "Radio.ServingSystem.Mnc",
  // -------------------------------------------------------------------------
  // LTE Neighbor Cells
  // -------------------------------------------------------------------------
  5149: "Radio.Lte.Neighbor[64].Pci",
  5277: "Radio.Lte.Neighbor[64].Rsrq",
  5341: "Radio.Lte.Neighbor[64].Rsrp",
  5725: "Radio.Lte.Neighbor[64].RxAntenna[4].RsrpDiversity",
  6045: "Radio.Lte.Neighbor[64].NeighborType",
  6109: "Radio.Lte.Neighbor[64].Earfcn",
  6237: "Radio.Lte.Neighbor[64].Rssi",
  // -------------------------------------------------------------------------
  // LTE Serving Cell Measurements
  // -------------------------------------------------------------------------
  6309: "Radio.Lte.ServingCell[8].Rsrq",
  6317: "Radio.Lte.ServingCell[8].Rsrp",
  6357: "Radio.Lte.ServingCell[8].Rank1.Count",
  6381: "Radio.Lte.ServingCell[8].DuplexMode",
  6389: "Radio.Lte.ServingCell[8].Pci",
  6445: "Radio.Lte.ServingCell[8].CellIdentity.Cell",
  6461: "Radio.Lte.ServingCell[8].CellIdentity.eNodeB",
  6477: "Radio.Lte.ServingCell[8].CellIdentity.Complete",
  6493: "Radio.Lte.ServingCell[8].Uplink.Earfcn",
  6509: "Radio.Lte.ServingCell[8].Uplink.Frequency",
  6525: "Radio.Lte.ServingCell[8].Uplink.Bandwidth",
  6541: "Radio.Lte.ServingCell[8].Uplink.CyclicPrefix",
  6629: "Radio.Lte.ServingCell[8].Band",
  6661: "Radio.Lte.ServingCell[8].Rank2.Count",
  6677: "Radio.Lte.ServingCell[8].Rank3.Count",
  6693: "Radio.Lte.ServingCell[8].Rank4.Count",
  6757: "Radio.Lte.ServingCell[8].RxAntenna[4].Rssi",
  6789: "Radio.Lte.ServingCell[8].RxAntenna[4].Rsrq",
  6821: "Radio.Lte.ServingCell[8].RxAntenna[4].Rsrp",
  6853: "Radio.Lte.ServingCell[8].RxAntenna[4].Cinr",
  6925: "Radio.Lte.ServingCell[8].PciPssPart",
  6941: "Radio.Lte.ServingCell[8].PciSssPart",
  6949: "Radio.Lte.ServingCell[8].Rssi",
  6965: "Radio.Lte.ServingCell[8].CellType",
  6981: "Radio.Lte.ServingCell[8].SmallCellIndication",
  6997: "Radio.Lte.ServingCell[8].PhyId",
  7005: "Radio.Lte.ServingCell[8].Downlink.Earfcn",
  7021: "Radio.Lte.ServingCell[8].Downlink.Frequency",
  7037: "Radio.Lte.ServingCell[8].Downlink.Bandwidth",
  7053: "Radio.Lte.ServingCell[8].Downlink.Pathloss",
  7069: "Radio.Lte.ServingCell[8].RsSinr",
  7085: "Radio.Lte.ServingCell[8].RankIndication",
  7101: "Radio.Lte.ServingCell[8].Pusch.TtiAllocationCount",
  // -------------------------------------------------------------------------
  // Layer 3 Messages
  // -------------------------------------------------------------------------
  3107015: "Message.Layer3.Errc.BcchSch.SystemInformationBlockType1",
  3107025: "Message.Layer3.NrRrc.BcchSch.Sib1",
  // -------------------------------------------------------------------------
  // System Information
  // -------------------------------------------------------------------------
  3107017: "SysInfo.ExtMemCardSize",
  3107018: "SysInfo.ExtMemCardFree",
  3107019: "SysInfo.ExtMemCardPath",
  // -------------------------------------------------------------------------
  // API / IP
  // -------------------------------------------------------------------------
  3107028: "ApiIp.Wifi.ActivityState",
  // -------------------------------------------------------------------------
  // Pocket Data (Throughput)
  // -------------------------------------------------------------------------
  3106712: "Pocket.Data.Common.Uplink.Throughput",
  3106714: "Pocket.Data.Wifi.Uplink.Throughput",
  3106715: "Pocket.Data.Common.Downlink.Throughput",
  3106717: "Pocket.Data.Wifi.Downlink.Throughput",
  3106730: "Pocket.Common.Rssi",
  3108670: "Pocket.Radio.Lte.ServingCell.Pusch.Throughput.SessionMax",
  3108671: "Pocket.Radio.Lte.ServingCell.Pusch.Throughput.SessionAverage",
  3110159: "Pocket.Data.Wifi.Uplink.SentBytes",
  3110160: "Pocket.Data.Wifi.Downlink.ReceivedBytes",
  // -------------------------------------------------------------------------
  // Pocket Radio
  // -------------------------------------------------------------------------
  3107029: "Pocket.Radio.DataAccessType",
  3107030: "Pocket.Radio.DataMode",
  3107035: "Pocket.Radio.Common.Quality",
  3107037: "Pocket.General.Device.Technology",
  3107061: "Pocket.General.Device.MaxNumCarriers",
  3107358: "Pocket.Radio.AirplaneMode",
  3107362: "Pocket.Common.Frequency",
  3107369: "Pocket.Radio.Nr.ServingCell[16].CellIdentity.gNodeB.ValidBits",
  3107385: "Pocket.Radio.InternalDataMode",
  3107388: "Pocket.Radio.Lte.ServingCell[8].PhyGroupId",
  3107396: "Pocket.Radio.Lte.ServingCell[8].PhyId",
  3107404: "Pocket.Radio.Lte.ServingCell[8].Rank1.Count",
  3107412: "Pocket.Radio.Lte.ServingCell[8].Rank2.Count",
  3107420: "Pocket.Radio.Lte.ServingCell[8].Rank3.Count",
  3107428: "Pocket.Radio.Lte.ServingCell[8].Rank4.Count",
  3110095: "Pocket.Radio.Lte.ServingCell[8].Rank1.SessionCount",
  3110103: "Pocket.Radio.Lte.ServingCell[8].Rank2.SessionCount",
  3110111: "Pocket.Radio.Lte.ServingCell[8].Rank3.SessionCount",
  3110119: "Pocket.Radio.Lte.ServingCell[8].Rank4.SessionCount",
  3108649: "Pocket.Radio.Lte.ServingCell.RankIndicatorMaxValue",
  3108650: "Pocket.Radio.Lte.ServingCell.RankIndicator.SessionMax",
  3108651: "Pocket.Radio.Lte.ServingCell.RankIndicator.SessionAverage",
  3108684: "Pocket.Radio.Lte.ServingCell[8].RankIndicatorMax",
  // -------------------------------------------------------------------------
  // Device Capabilities
  // -------------------------------------------------------------------------
  3106672: "Pocket.General.Device.Lte.EarfcnOnlyLockSupport",
  3106673: "Pocket.General.Device.Lte.PciLockOverride",
  3106674: "Pocket.General.Device.Nr.PciArfcnOnlyLockSupport",
  3106675: "Pocket.General.Device.Nr.PciLockOverride",
  3106676: "Pocket.General.Device.Gsm.AllSupportedBands",
  3106677: "Pocket.General.Device.Lte.AllSupportedBands",
  3106678: "Pocket.General.Device.Nr.AllSupportedBands",
  3106679: "Pocket.General.Device.Wcdma.AllSupportedBands",
  3106693: "Pocket.General.Device.Gsm.SingleBandLock",
  3108365: "Pocket.General.Device.MtSupport",
  3110060: "Pocket.General.Device.RunningExternalDecoding",
  3110023: "Pocket.General.RemoteControl.FirebaseToken",
  // -------------------------------------------------------------------------
  // Indoor/Outdoor Map
  // -------------------------------------------------------------------------
  3107305: "IndoorMap.MapSetName",
  3107324: "IndoorMap.Layers",
  3107330: "IndoorMap.MapsetState",
  3107337: "IndoorMap.SelectedValueElement",
  3107530: "OutdoorMap.Layers",
  3107531: "OutdoorMap.SelectedValueElement",
  3107532: "OutdoorMap.ZoomLevel.Current",
  3107534: "OutdoorMap.ZoomLevel.Max",
  3107535: "OutdoorMap.Offline.MapTypes",
  3107536: "OutdoorMap.Offline.HasPendingTiles",
  3107537: "OutdoorMap.OnlineMode",
  // -------------------------------------------------------------------------
  // IP Capture
  // -------------------------------------------------------------------------
  3107353: "IpCapture.Support",
  3107354: "IpCapture.State",
  3107357: "Pocket.General.Device.Protocol",
  // -------------------------------------------------------------------------
  // Control Functions (Lock, Band, Cell)
  // -------------------------------------------------------------------------
  3107567: "ControlFunction.ControlFunctionsPresent",
  3107568: "ControlFunction.IsLocked",
  3107571: "ControlFunction.NumberOfSims",
  3107572: "ControlFunction.RatLock.IsSupported",
  3107573: "ControlFunction.RatLock.Current",
  3107574: "ControlFunction.RatLock.Support",
  3107575: "ControlFunction.BandLock.Gsm.IsSupported",
  3107576: "ControlFunction.BandLock.Gsm.Current",
  3107577: "ControlFunction.BandLock.Gsm.Support",
  3107578: "ControlFunction.CellLock.Gsm.IsSupported",
  3107579: "ControlFunction.CellLock.Gsm.Current",
  3107580: "ControlFunction.BandLock.Wcdma.IsSupported",
  3107581: "ControlFunction.BandLock.Wcdma.Current",
  3107582: "ControlFunction.BandLock.Wcdma.Support",
  3107585: "ControlFunction.StayOnCell.Wcdma.IsSupported",
  3107586: "ControlFunction.StayOnCell.Wcdma.Current",
  3107587: "ControlFunction.BandLock.Lte.IsSupported",
  3107588: "ControlFunction.BandLock.Lte.Current",
  3107589: "ControlFunction.BandLock.Lte.Support",
  3107590: "ControlFunction.CellLock.Lte.IsSupported",
  3107591: "ControlFunction.CellLock.Lte.Current",
  3107594: "ControlFunction.BandLock.Nr.IsSupported",
  3107595: "ControlFunction.BandLock.Nr.Current",
  3107596: "ControlFunction.BandLock.Nr.Support",
  3107599: "ControlFunction.PciArfcnLock.Nr.IsSupported",
  3107601: "ControlFunction.NrVoiceMode.IsSupported",
  3107602: "ControlFunction.NrVoiceMode.Current",
  3107603: "ControlFunction.NrVoiceMode.Original",
  3107606: "ControlFunction.AttachDomain.Original",
  3107607: "ControlFunction.PreferredApn.IsSupported",
  3107609: "ControlFunction.PreferredApn.Previous",
  3107611: "ControlFunction.RadioEnable.IsSupported",
  3107612: "ControlFunction.RadioEnable.Current",
  3107613: "ControlFunction.RadioEnable.RadioState",
  3107614: "ControlFunction.RadioEnable.WiFiState",
  3107620: "ControlFunction.ServiceDomain.IsSupported",
  3107624: "ControlFunction.State",
  3107625: "ControlFunction.ColorState",
  // -------------------------------------------------------------------------
  // Services / Applications
  // -------------------------------------------------------------------------
  3107560: "LogfileUpload.IsRunning",
  3107561: "LogfileUpload.LastResult",
  3107643: "HttpUpload.IsRunning",
  3107644: "HttpUpload.LastResult",
  3107686: "Sms.IsRunning[2]",
  3107688: "Sms.LastResult[2]",
  3107723: "Ftp.IsRunning",
  3107724: "Ftp.LastResult",
  3107759: "Http.Properties.OnDeviceHttpDownloadManagerSupport",
  3107760: "Http.Properties.OnDeviceHttpWebKitSupport",
  3107763: "Http.IsRunning",
  3107764: "Http.LastResult",
  3107793: "Ping.IsRunning",
  3107794: "Ping.LastResult",
  3107914: "OttVideoStreaming.State",
  3107915: "OttVideoStreaming.IsRunning",
  3107916: "OttVideoStreaming.LastResult",
  3107919: "Pocket.Data.Streaming.IsRunning",
  3107920: "Pocket.Data.Streaming.LastResult",
  3107945: "Email.IsRunning",
  3107946: "Email.LastResult",
  3108035: "Facebook.IsRunning",
  3108036: "Facebook.LastResult",
  3108111: "Instagram.IsRunning",
  3108112: "Instagram.LastResult",
  3108193: "YouTube.IsRunning",
  3108194: "YouTube.LastResult",
  3108548: "Twitter.IsRunning",
  3108549: "Twitter.LastResult",
  3109876: "WhatsApp.IsRunning",
  3109877: "WhatsApp.LastResult",
  3109973: "Iperf.IsRunning",
  3109974: "Iperf.LastResult",
  3110018: "OdmScripting.IsRunning",
  3110019: "OdmScripting.LastResult",
  // -------------------------------------------------------------------------
  // Voice Call
  // -------------------------------------------------------------------------
  3108213: "Call.ServiceState",
  3108237: "Call.Properties.VoLTESupport.Audio",
  3108238: "Call.Properties.MT.AudioInjectSupport",
  3108287: "Call.IsRunning",
  3108288: "Call.AqmIsRunning",
  3108289: "Call.LastResult",
  3108290: "Call.AqmLastResult",
  3108323: "Aqm.SupportedLanguages",
  3108395: "CallSequence.IsRunning",
  3108396: "CallSequence.LastResult",
  // -------------------------------------------------------------------------
  // Scanner
  // -------------------------------------------------------------------------
  3108438: "Scanner.ServiceState",
  3108440: "Scanner.IsRunningText",
  3108441: "Scanner.IsRunning",
  3108442: "Scanner.LastResult",
  3108444: "Scanner.ServiceStateText",
  // -------------------------------------------------------------------------
  // Synchronization
  // -------------------------------------------------------------------------
  3109854: "Synchronize.IsRunning",
  3109855: "Synchronize.LastResult",
  3109907: "SynchPoint.IsRunning",
  3109908: "SynchPoint.LastResult",
  // -------------------------------------------------------------------------
  // Script Engine
  // -------------------------------------------------------------------------
  3108695: "ScriptEngine.CurrentService",
  3108704: "ScriptEngine.ActionSubstate",
  3108720: "ScriptEngine.State",
  3108724: "Pocket.Control.Script.Engine.DefinitionOfDone.Enabled",
  // -------------------------------------------------------------------------
  // Fleet Manager
  // -------------------------------------------------------------------------
  3110032: "FleetManager.FleetManagerState",
  3110040: "FleetManager.IsRegistered",
  3110045: "FleetManager.IsConfigured",
  3110047: "FleetManager.UseProxy",
  3110049: "FleetManager.IsRunning",
  // -------------------------------------------------------------------------
  // Device Buddy
  // -------------------------------------------------------------------------
  3108746: "DeviceBuddyGrpc.NumberOfDevices",
  3108756: "DeviceBuddyGrpc.IsRunning",
  // -------------------------------------------------------------------------
  // Network Statistics
  // -------------------------------------------------------------------------
  3108859: "Statistics.Network.Rat.NoService.Percentage",
  3108861: "Statistics.Network.Rat.Wcdma.Percentage",
  3108863: "Statistics.Network.Rat.Nr.Percentage",
  3108865: "Statistics.Network.Rat.Gsm.Percentage",
  3108867: "Statistics.Network.Rat.Cdma.Percentage",
  3108869: "Statistics.Network.Rat.Evdo.Percentage",
  3108870: "Statistics.Network.Rat.Lte.Time",
  3108871: "Statistics.Network.Rat.Lte.Percentage",
  3109218: "Statistics.Network.Lte.CellUsage.Cell[16].CellCode",
  3109234: "Statistics.Network.Lte.CellUsage.Cell[16].CellIdentity",
  3109250: "Statistics.Network.Lte.CellUsage.Cell[16].ChannelNumber",
  3109266: "Statistics.Network.Lte.CellUsage.Cell[16].Duration",
  3109282: "Statistics.Network.Lte.CellUsage.Cell[16].MOS",
  3109298: "Statistics.Network.Lte.CellUsage.NumberOfCells",
  3109299: "Statistics.Network.Lte.CellUsage.Cell[16].SPD",
  3109315: "Statistics.Network.Lte.CellUsage.Cell[16].SPDOneway",
  3109331: "Statistics.Network.Lte.CellUsage.Cell[16].SetupTime",
  3109347: "Statistics.Network.Lte.CellUsage.Cell[16].SignalQuality",
  3109363: "Statistics.Network.Lte.CellUsage.Cell[16].SignalStrength",
} as const;

// =============================================================================
// RF FIELD IDS - Subset for RF measurement extraction
// =============================================================================
export const RF_FIELD_IDS: Record<number, string> = {
  // LTE Serving Cell
  6309: "LTE.ServingCell.Rsrq",
  6317: "LTE.ServingCell.Rsrp",
  6389: "LTE.ServingCell.Pci",
  6445: "LTE.ServingCell.CellIdentity.Cell",
  6461: "LTE.ServingCell.CellIdentity.eNodeB",
  6477: "LTE.ServingCell.CellIdentity.Complete",
  6629: "LTE.ServingCell.Band",
  6949: "LTE.ServingCell.Rssi",
  7005: "LTE.ServingCell.DL.Earfcn",
  6493: "LTE.ServingCell.UL.Earfcn",
  7069: "LTE.ServingCell.RsSinr",
  6925: "LTE.ServingCell.PciPss",
  6941: "LTE.ServingCell.PciSss",
  6853: "LTE.ServingCell.Rx.Cinr",
  // LTE Serving Cell RX Antenna
  6757: "LTE.ServingCell.Rx.Rssi",
  6789: "LTE.ServingCell.Rx.Rsrq",
  6821: "LTE.ServingCell.Rx.Rsrp",
  // LTE Neighbor
  5149: "LTE.Neighbor.Pci",
  5277: "LTE.Neighbor.Rsrq",
  5341: "LTE.Neighbor.Rsrp",
  6109: "LTE.Neighbor.Earfcn",
  6237: "LTE.Neighbor.Rssi",
  5725: "LTE.Neighbor.Rx.RsrpDiv",
  // LTE Cell Statistics
  4570: "LTE.CellStats.Pci",
  4590: "LTE.CellStats.Earfcn",
  // LTE Serving System
  4633: "LTE.ServingSystem.Tac",
  3107088: "Radio.ServingSystem.Mcc",
  3107089: "Radio.ServingSystem.Mnc",
  // MRDC (5G NR + LTE)
  3308: "MRDC.Cell.Rsrq",
  3372: "MRDC.Cell.Rsrp",
  3500: "MRDC.Cell.Sinr",
  3564: "MRDC.Cell.Band",
  3628: "MRDC.Cell.Pci",
  3820: "MRDC.Cell.Channel",
  // WiFi
  2359: "Wifi.Cell.Rssi",
  2743: "Wifi.Cell.Channel",
  // Throughput
  3106712: "Common.UL.Throughput",
  3106714: "Wifi.UL.Throughput",
  3106715: "Common.DL.Throughput",
  3106717: "Wifi.DL.Throughput",
  3106722: "Common.UL.LowLevelThroughput",
  3106723: "Common.DL.LowLevelThroughput",
  3108670: "LTE.PUSCH.Throughput.Max",
  3108671: "LTE.PUSCH.Throughput.Avg",
  // Common
  3106730: "Common.Rssi",
  4145: "Radio.Common.Technology",
} as const;

// =============================================================================
// SIGNED FIELD IDS - Fields that use ZigZag encoding (can be negative)
// =============================================================================
export const SIGNED_FIELD_IDS: Set<number> = new Set([
  // LTE Serving Cell
  6309, // RSRQ
  6317, // RSRP
  6949, // RSSI
  7069, // SINR
  6853, // CINR
  // LTE Serving Cell RX Antenna
  6757, // RX RSSI
  6789, // RX RSRQ
  6821, // RX RSRP
  // LTE Neighbor
  5277, // Neighbor RSRQ
  5341, // Neighbor RSRP
  6237, // Neighbor RSSI
  5725, // Neighbor RX RSRP Diversity
  // MRDC
  3308, // MRDC RSRQ
  3372, // MRDC RSRP
  3500, // MRDC SINR
  // WiFi
  2359, // WiFi RSSI
  // Common
  3106730, // Common RSSI
  // Cell Statistics (Signal Quality/Strength)
  3109347, // SignalQuality
  3109363, // SignalStrength
]);

// =============================================================================
// KEYWORDS - For dynamic field matching
// =============================================================================
export const SIGNED_KEYWORDS: readonly string[] = [
  "rsrp",
  "rsrq",
  "rssi",
  "sinr",
  "cinr",
  "snr",
  "signalquality",
  "signalstrength",
] as const;
