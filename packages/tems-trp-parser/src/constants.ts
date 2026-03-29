/**
 * TEMS TRP Field Constants.
 *
 * This module contains all field ID mappings extracted from declarations.cdf.
 * Field resolution is 100% dynamic from declarations.cdf at runtime.
 * ALL_FIELD_IDS is provided for documentation and tests only.
 */

// =============================================================================
// ALL FIELD IDS - Complete mapping from declarations.cdf (412 fields)
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
  3107208: "General.ServiceProvider.CpuActiveTimeCount",
  3107225: "General.ServiceProvider.CpuTotalTimeCount",
  3107242: "General.ServiceProvider.TotalMemory",
  3107243: "General.ServiceProvider.ThresholdMemory",
  3107244: "General.ServiceProvider.LowMemoryFlag",
  3107245: "General.ServiceProvider.TopCommandHeader",
  3107246: "General.ServiceProvider.TopCommand",
  3107247: "General.ServiceProvider.BatteryChargingType",
  3107248: "General.ServiceProvider.BatteryAverageCurrent",
  3107249: "General.ServiceProvider.BatteryRemainingChargeTime",
  3107250: "General.ServiceProvider.GpuTemperatureCount",
  3107267: "General.ServiceProvider.CpuShutdownTemperatureCount",
  3107284: "General.ServiceProvider.CpuThrottlingTemperatureVRCount",
  3107301: "General.ServiceProvider.BarometricPressure",
  3107302: "General.ServiceProvider.BarometricAltitude",
  3107303: "General.ServiceProvider.BarometricAltitudeAccuracy",
  3110212: "General.FilemarkEvent",
  // -------------------------------------------------------------------------
  // Location
  // -------------------------------------------------------------------------
  537: "Location.QualityIndicator",
  542: "Location.Speed",
  543: "Location.Altitude",
  544: "Location.Longitude",
  545: "Location.Latitude",
  550: "Location.Time",
  551: "Location.Date",
  552: "Location.NumberOfSatellites",
  553: "Location.VerticalDilutionOfPrecision",
  554: "Location.HorizontalDilutionOfPrecision",
  3108636: "Location.MovingState",
  // -------------------------------------------------------------------------
  // WiFi Measurements
  // -------------------------------------------------------------------------
  2231: "Radio.Wifi.Cell[64].Ssid",
  2295: "Radio.Wifi.Cell[64].Bssid",
  2359: "Radio.Wifi.Cell[64].Rssi",
  2743: "Radio.Wifi.Cell[64].Channel",
  3106793: "Wifi.WifiRadioState",
  3106794: "Wifi.ScanForCells",
  3106795: "Wifi.ScanState",
  3106802: "Wifi.ConnectionBssid",
  3106803: "Wifi.ConnectionIpAddress",
  3106804: "Wifi.ConnectionLinkSpeed",
  3106805: "Wifi.ConnectionMacAddress",
  3106806: "Wifi.ConnectionNetworkId",
  3106807: "Wifi.ConnectionSsid",
  3106809: "Wifi.RadioStateText",
  3106810: "Wifi.ScanForCellsText",
  3106811: "Radio.Wifi.Status.ActivityStatus",
  3106812: "Radio.Wifi.Status.ConnectionStatus",
  3106813: "Radio.Wifi.Status.LocationStatus",
  3106814: "Radio.Wifi.ConnectionLinkSpeed",
  3106815: "Radio.Wifi.SNR",
  // -------------------------------------------------------------------------
  // Common Radio / MRDC (Multi-RAT Dual Connectivity - 5G NR + LTE)
  // -------------------------------------------------------------------------
  2812: "Radio.Common.Uplink.LowLevelThroughput",
  2813: "Radio.Common.MultiRatConnectivityMode",
  3231: "Radio.Common.ServingCellChangedEvent",
  4090: "Radio.Common.Layer3MessageEvent",
  4097: "Radio.Common.Mode",
  4142: "Radio.Common.Downlink.LowLevelThroughput",
  4144: "Radio.Common.DataRadioBearer",
  4145: "Radio.Common.Technology",
  3308: "Radio.Common.Mrdc.Cell[64].Rsrq",
  3372: "Radio.Common.Mrdc.Cell[64].Rsrp",
  3436: "Radio.Common.Mrdc.Cell[64].Type",
  3500: "Radio.Common.Mrdc.Cell[64].Sinr",
  3564: "Radio.Common.Mrdc.Cell[64].Band",
  3628: "Radio.Common.Mrdc.Cell[64].Pci",
  3756: "Radio.Common.Mrdc.Cell[64].Technology",
  3820: "Radio.Common.Mrdc.Cell[64].Channel",
  // -------------------------------------------------------------------------
  // LTE Cell Parameters & Statistics
  // -------------------------------------------------------------------------
  4568: "Radio.Lte.CellParameters.QRxLevMin",
  4570: "Radio.Lte.CellStatistics[20].Pci",
  4590: "Radio.Lte.CellStatistics[20].Earfcn",
  4610: "Radio.Lte.CellStatistics[20].PdschByteCount",
  4146: "Radio.Lte.ServingCellCountUplink",
  // -------------------------------------------------------------------------
  // LTE Serving System
  // -------------------------------------------------------------------------
  4630: "Radio.Lte.ServingSystem.RrcState",
  4631: "Radio.Lte.ServingSystem.EmmState",
  4633: "Radio.Lte.ServingSystem.Tac",
  4973: "Radio.Lte.Rach.ContentionResolutionTimer",
  4975: "Radio.Lte.Rach.PreambleStep",
  4979: "Radio.Lte.ServingCellCount",
  97599: "Radio.ServingSystem.Mnc",
  97600: "Radio.ServingSystem.Mcc",
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
  6453: "Radio.Lte.ServingCell[8].CellIdentity.eNodeB",
  6461: "Radio.Lte.ServingCell[8].CellIdentity.Complete",
  6469: "Radio.Lte.ServingCell[8].Uplink.CyclicPrefix",
  6477: "Radio.Lte.ServingCell[8].Uplink.Bandwidth",
  6485: "Radio.Lte.ServingCell[8].Uplink.Frequency",
  6493: "Radio.Lte.ServingCell[8].Uplink.Earfcn",
  6501: "Radio.Lte.ServingCell[8].CqiRank1Codeword0",
  6525: "Radio.Lte.ServingCell[8].Pusch.TtiAllocationCount",
  6557: "Radio.Lte.ServingCell[8].Pusch.Throughput",
  6573: "Radio.Lte.ServingCell[8].Pdsch.Throughput",
  6701: "Radio.Lte.ServingCell[8].Pdsch.Bler",
  6709: "Radio.Lte.ServingCell[8].Pdsch.ResourceBlockAllocationPercentage",
  6717: "Radio.Lte.ServingCell[8].Pdsch.Sinr",
  6733: "Radio.Lte.ServingCell[8].Pdsch.ResourceBlockAllocationCount",
  6757: "Radio.Lte.ServingCell[8].RxAntenna[4].Rssi",
  6789: "Radio.Lte.ServingCell[8].RxAntenna[4].Rsrq",
  6821: "Radio.Lte.ServingCell[8].RxAntenna[4].Rsrp",
  6853: "Radio.Lte.ServingCell[8].RxAntenna[4].Cinr",
  6885: "Radio.Lte.ServingCell[8].MimoAntennaConfiguration",
  6893: "Radio.Lte.ServingCell[8].Band",
  6909: "Radio.Lte.ServingCell[8].CqiCodeword0Average",
  6917: "Radio.Lte.ServingCell[8].RankIndication",
  6925: "Radio.Lte.ServingCell[8].PciPssPart",
  6941: "Radio.Lte.ServingCell[8].PciSssPart",
  6949: "Radio.Lte.ServingCell[8].Rssi",
  6957: "Radio.Lte.ServingCell[8].UeAntennaCount",
  6965: "Radio.Lte.ServingCell[8].eNodeBAntennaCount",
  6973: "Radio.Lte.ServingCell[8].Stream[2].Cqi",
  6989: "Radio.Lte.ServingCell[8].Downlink.Pathloss",
  6997: "Radio.Lte.ServingCell[8].Downlink.Bandwidth",
  7005: "Radio.Lte.ServingCell[8].Downlink.Earfcn",
  7013: "Radio.Lte.ServingCell[8].Downlink.Frequency",
  7029: "Radio.Lte.ServingCell[8].SmallCellIndication",
  7037: "Radio.Lte.ServingCell[8].CellType",
  7069: "Radio.Lte.ServingCell[8].RsSinr",
  // -------------------------------------------------------------------------
  // LTE Serving Cell Total
  // -------------------------------------------------------------------------
  7673: "Radio.Lte.ServingCellTotal.Pusch.Throughput",
  7674: "Radio.Lte.ServingCellTotal.ReferenceSignalPower",
  7675: "Radio.Lte.ServingCellTotal.Pdsch.Throughput",
  // -------------------------------------------------------------------------
  // Layer 3 Messages
  // -------------------------------------------------------------------------
  99245: "Message.Layer3.Errc.Sib.SystemInformationBlock3",
  99250: "Message.Layer3.Errc.Sib.SystemInformationBlock2",
  99255: "Message.Layer3.Errc.Sib.SystemInformationBlock5",
  99260: "Message.Layer3.Errc.Sib.SystemInformationBlock4",
  99270: "Message.Layer3.Errc.Sib.SystemInformationBlock6",
  99285: "Message.Layer3.Errc.Sib.SystemInformationBlock24",
  99420: "Message.Layer3.Errc.Pcch.Paging",
  99435: "Message.Layer3.Errc.BcchBch.MasterInformationBlock",
  99475: "Message.Layer3.Errc.BcchSch.SystemInformation",
  99480: "Message.Layer3.Errc.BcchSch.SystemInformationBlockType1",
  101469: "Message.Layer3.NrRrc.BcchBch.Mib",
  101484: "Message.Layer3.NrRrc.BcchSch.Sib1",
  // -------------------------------------------------------------------------
  // System Information
  // -------------------------------------------------------------------------
  3106618: "SysInfo.Manufacturer",
  3106619: "SysInfo.Model",
  3106620: "SysInfo.DeviceName",
  3106621: "SysInfo.Os",
  3106622: "SysInfo.OsVersion",
  3106623: "SysInfo.FwVersion",
  3106624: "SysInfo.BackendVersion",
  3106625: "SysInfo.Duid",
  3106626: "SysInfo.Imei",
  3106627: "SysInfo.Imsi",
  3106628: "SysInfo.Msisdn",
  3106629: "SysInfo.Protocol",
  3106630: "SysInfo.SoftwareVersion",
  3106631: "SysInfo.PhoneType",
  3106632: "SysInfo.BatteryPercentage",
  3106633: "SysInfo.BatteryVoltage",
  3106634: "SysInfo.BatteryTemperature",
  3106635: "SysInfo.BatteryStatus",
  3106637: "SysInfo.GSMCapable",
  3106638: "SysInfo.WCDMACapable",
  3106639: "SysInfo.CDMACapable",
  3106640: "SysInfo.LTECapable",
  3106641: "SysInfo.LteTddCapable",
  3106642: "SysInfo.LteFddCapable",
  3106643: "SysInfo.HybridSupport",
  3106644: "SysInfo.PrivateSize",
  3106645: "SysInfo.PrivateUsed",
  3106646: "SysInfo.PrivateFree",
  3106647: "SysInfo.PublicSize",
  3106648: "SysInfo.PublicUsed",
  3106649: "SysInfo.PublicFree",
  3106650: "SysInfo.ExtMemCardSize",
  3106651: "SysInfo.ExtMemCardFree",
  3106653: "SysInfo.Year",
  3106654: "SysInfo.Month",
  3106655: "SysInfo.Day",
  3106656: "SysInfo.Hour",
  3106657: "SysInfo.Minute",
  3106658: "SysInfo.Second",
  3106659: "SysInfo.HourUtc",
  3106660: "SysInfo.Root",
  3106662: "SysInfo.ExtMemCardPath",
  // -------------------------------------------------------------------------
  // API / IP
  // -------------------------------------------------------------------------
  3106705: "ApiIp.Ipv4Address",
  3106706: "ApiIp.Ipv6Address",
  3106708: "ApiIp.Wifi.ActivityState",
  3106710: "ApiIp.Wifi.ConnectionState",
  3106728: "ApiRadio.IsRunning",
  3106729: "ApiRadio.LastResult",
  // -------------------------------------------------------------------------
  // Pocket General / UI
  // -------------------------------------------------------------------------
  3106668: "Pocket.Ui.State",
  3106670: "Pocket.General.Usb.ConnectionState",
  3106671: "Pocket.General.Usb.Mode",
  3106672: "Pocket.General.Device.Lte.EarfcnOnlyLockSupport",
  3106673: "Pocket.General.Device.Lte.PciLockOverride",
  3106674: "Pocket.General.Device.Nr.PciArfcnOnlyLockSupport",
  3106675: "Pocket.General.Device.Nr.PciLockOverride",
  3106676: "Pocket.General.Device.ControlFunction.EndPoint",
  3106677: "Pocket.General.Device.Wcdma.CellLockPreventSupport",
  3106678: "Pocket.General.Device.Gsm.CellLockPreventSupport",
  3106679: "Pocket.General.Device.Gsm.SingleCellLock",
  3106680: "Pocket.General.Device.Gsm.SingleBandLock",
  3106681: "Pocket.General.Device.MaxNumCarriers",
  3106682: "Pocket.General.Device.IPv6Support",
  3106683: "Pocket.General.Device.ModemIpCaptureSupport",
  3106684: "Pocket.General.Device.SitSupport",
  3106685: "Pocket.IsCommercialDevice",
  3106686: "Pocket.AgentLicensingType",
  3106688: "Pocket.General.Device.Gsm.AllSupportedBands",
  3106689: "Pocket.General.Device.Lte.AllSupportedBands",
  3106690: "Pocket.General.Device.Nr.AllSupportedBands",
  3106691: "Pocket.General.Device.Wcdma.AllSupportedBands",
  3106692: "Pocket.General.Device.SupportedRATs",
  3106693: "Pocket.General.Device.Technology",
  3107148: "Pocket.Location.LatitudeWithDirection",
  3107149: "Pocket.Location.LongitudeWithDirection",
  3107158: "Pocket.Location.SpeedInMetersPerSecond",
  3107159: "Pocket.Location.Validity",
  3107161: "Pocket.Location.State",
  3107357: "Pocket.General.Device.Protocol",
  3107361: "Pocket.Common.Channel",
  3107362: "Pocket.Common.Frequency",
  3108365: "Pocket.General.Device.MtSupport",
  3108724: "Pocket.Control.Script.Engine.DefinitionOfDone.Enabled",
  3110023: "Pocket.General.RemoteControl.FirebaseToken",
  3110060: "Pocket.General.Device.RunningExternalDecoding",
  // -------------------------------------------------------------------------
  // Pocket Radio
  // -------------------------------------------------------------------------
  3106718: "Pocket.Radio.DataAccessType",
  3106719: "Pocket.Radio.DataMode",
  3106730: "Pocket.Radio.Common.Rssi",
  3106734: "Pocket.Radio.Common.SignalStrength",
  3106736: "Pocket.Radio.Common.Quality",
  3107358: "Pocket.Radio.AirplaneMode",
  3107363: "Pocket.Radio.Common.Uplink.Throughput",
  3107366: "Pocket.Radio.Common.Downlink.Throughput",
  3107369: "Pocket.Radio.Nr.ServingCell[16].CellIdentity.gNodeB.ValidBits",
  3107385: "Pocket.Radio.InternalDataMode",
  3108640: "Pocket.Radio.Common.Downlink.LowLevelThroughput.SessionAverage",
  3108666: "Pocket.Radio.Common.Uplink.LowLevelThroughput.SessionAverage",
  // -------------------------------------------------------------------------
  // Pocket Radio WiFi
  // -------------------------------------------------------------------------
  3106820: "Pocket.Radio.Wifi.Cell[64].CellCapabilities",
  3106884: "Pocket.Radio.Wifi.Cell[64].CellShortCap",
  3106948: "Pocket.Radio.Wifi.Cell[64].CellFrequency",
  3107012: "Pocket.Radio.Wifi.Cell[64].CellColorIdx",
  3107076: "Pocket.Radio.Wifi.Cell[64].CellConnState",
  // -------------------------------------------------------------------------
  // Pocket Radio LTE
  // -------------------------------------------------------------------------
  3107388: "Pocket.Radio.Lte.ServingCell[8].PhyGroupId",
  3107396: "Pocket.Radio.Lte.ServingCell[8].PhyId",
  3107404: "Pocket.Radio.Lte.ServingCell[8].Rank1.Count",
  3107412: "Pocket.Radio.Lte.ServingCell[8].Rank2.Count",
  3107420: "Pocket.Radio.Lte.ServingCell[8].Rank3.Count",
  3107428: "Pocket.Radio.Lte.ServingCell[8].Rank4.Count",
  3108645: "Pocket.Radio.Lte.ServingCellTotal.Pdsch.Throughput.SessionAverage",
  3108649: "Pocket.Radio.Lte.ServingCell.RankIndicatorMaxValue",
  3108650: "Pocket.Radio.Lte.ServingCell.RankIndicator.SessionMax",
  3108651: "Pocket.Radio.Lte.ServingCell.RankIndicator.SessionAverage",
  3108670: "Pocket.Radio.Lte.ServingCell.Pusch.Throughput.SessionMax",
  3108671: "Pocket.Radio.Lte.ServingCell.Pusch.Throughput.SessionAverage",
  3108684: "Pocket.Radio.Lte.ServingCell[8].RankIndicatorMax",
  3110095: "Pocket.Radio.Lte.ServingCell[8].Rank1.SessionCount",
  3110103: "Pocket.Radio.Lte.ServingCell[8].Rank2.SessionCount",
  3110111: "Pocket.Radio.Lte.ServingCell[8].Rank3.SessionCount",
  3110119: "Pocket.Radio.Lte.ServingCell[8].Rank4.SessionCount",
  // -------------------------------------------------------------------------
  // Pocket Data (Throughput)
  // -------------------------------------------------------------------------
  3106712: "Pocket.Data.Common.Uplink.Throughput",
  3106714: "Pocket.Data.Wifi.Uplink.Throughput",
  3106715: "Pocket.Data.Common.Downlink.Throughput",
  3106717: "Pocket.Data.Wifi.Downlink.Throughput",
  3107919: "Pocket.Data.Streaming.IsRunning",
  3107920: "Pocket.Data.Streaming.LastResult",
  3110159: "Pocket.Data.Wifi.Uplink.SentBytes",
  3110160: "Pocket.Data.Wifi.Downlink.ReceivedBytes",
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
  3107351: "IpCapture.ErrorMessage",
  3107352: "IpCapture.SubCause",
  3107353: "IpCapture.Support",
  3107354: "IpCapture.State",
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
  3107604: "ControlFunction.AttachDomain.IsSupported",
  3107605: "ControlFunction.AttachDomain.Current",
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
  // -------------------------------------------------------------------------
  // Fleet Manager
  // -------------------------------------------------------------------------
  3110031: "FleetManager.FleetManagerState",
  3110039: "FleetManager.IsRegistered",
  3110044: "FleetManager.IsConfigured",
  3110046: "FleetManager.UseProxy",
  3110048: "FleetManager.IsRunning",
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
  3108877: "Statistics.Network.Lte.RrcState.Idle.Percentage",
  3108878: "Statistics.Network.Lte.RrcState.Dedicated.Time",
  3108879: "Statistics.Network.Lte.RrcState.Dedicated.Percentage",
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
// VARIABLE FIELDS - Fields whose IDs differ across sessions
// =============================================================================
export const VARIABLE_FIELDS: readonly string[] = [
  "Radio.Common.Uplink.LowLevelThroughput",
  "Radio.Common.Downlink.LowLevelThroughput",
  "Radio.Common.DataRadioBearer",
  "Radio.Common.Mode",
  "Radio.Common.MultiRatConnectivityMode",
  "Radio.Lte.ServingCellCountUplink",
  "Radio.Lte.ServingSystem.RrcState",
  "Radio.Lte.Rach.PreambleStep",
  "Pocket.Radio.Common.Uplink.Throughput",
  "Pocket.Radio.Common.Downlink.Throughput",
  "Pocket.Radio.Common.SignalStrength",
] as const;

// =============================================================================
// KEYWORDS - For dynamic signed-field matching
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
  "pathloss",
  "referencesignalpower",
] as const;
