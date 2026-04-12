declare namespace LuCI.network {
  /**
   * Represents a wireless encryption entry describing active wireless encryption settings.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.network.html#.WifiEncryption
   */
  interface WifiEncryption {
    /** Specifies whether any kind of encryption, such as WEP or WPA is enabled */
    enabled: boolean;
    /** Active WEP modes: 'open', 'shared', or both (optional) */
    wep?: string[];
    /** WPA protocol versions: 1, 2, 3, etc. (optional) */
    wpa?: number[];
    /** Active authentication suites: 'psk', 'sae', etc. (optional) */
    authentication?: string[];
    /** Active encryption ciphers: 'tkip', 'ccmp', etc. (optional) */
    ciphers?: string[];
  }

  /**
   * Describes a wireless rate entry for transmission/receiving rates.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.network.html#.WifiRateEntry
   */
  interface WifiRateEntry {
    /** Amount of received misc packages dropped (rx only, optional) */
    drop_misc?: number;
    /** Amount of packets received or sent */
    packets: number;
    /** Amount of bytes received or sent */
    bytes: number;
    /** Amount of failed transmission attempts (tx only, optional) */
    failed?: number;
    /** Amount of retried transmissions (tx only, optional) */
    retries?: number;
    /** Specifies whether this rate is an HT (IEEE 802.11n) rate */
    is_ht: boolean;
    /** Specifies whether this rate is a VHT (IEEE 802.11ac) rate */
    is_vht: boolean;
    /** Channel width in MHz */
    mhz: number;
    /** Bitrate in bit/s */
    rate: number;
    /** MCS index of the transmission rate (optional for HT/VHT rates) */
    mcs?: number;
    /** 40MHz channel width (HT/VHT only, optional) */
    '40mhz'?: number;
    /** Short guard interval used (HT/VHT only, optional) */
    short_gi?: boolean;
    /** Number of spatial streams (VHT only, optional) */
    nss?: number;
    /** HE (IEEE 802.11ax) rate (optional) */
    he?: boolean;
    /** Guard interval for HE rates (optional) */
    he_gi?: number;
    /** Dual concurrent modulation for HE (optional) */
    he_dcm?: number;
    /** EHT (IEEE 802.11be) rate (optional) */
    eht?: boolean;
    /** Guard interval for EHT rates (optional) */
    eht_gi?: number;
    /** Dual concurrent modulation for EHT (optional) */
    eht_dcm?: number;
  }

  /**
   * Describes a wireless peer entry for associated clients.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.network.html#.WifiPeerEntry
   */
  interface WifiPeerEntry {
    /** MAC address (BSSID) of the peer */
    mac: string;
    /** Received signal strength in dBm */
    signal: number;
    /** Average signal strength if supported by driver (optional) */
    signal_avg?: number;
    /** Current noise floor (optional) */
    noise?: number;
    /** Milliseconds the peer has been inactive */
    inactive: number;
    /** Milliseconds the peer is associated */
    connected_time: number;
    /** Estimated throughput (optional) */
    thr?: number;
    /** Whether the peer is authorized to associate */
    authorized: boolean;
    /** Whether the peer completed authentication */
    authenticated: boolean;
    /** Preamble mode: 'long' or 'short' */
    preamble: string;
    /** Whether peer supports WME/WMM */
    wme: boolean;
    /** Whether management frame protection is active */
    mfp: boolean;
    /** Whether TDLS is active */
    tdls: boolean;
    /** Mesh LLID (optional) */
    mesh_llid?: number;
    /** Mesh PLID (optional) */
    mesh_plid?: number;
    /** Mesh peer link state (optional) */
    mesh_plink?: string;
    /** Local power-save mode for peer link (optional) */
    mesh_local_PS?: number;
    /** Remote power-save mode for peer link (optional) */
    mesh_peer_PS?: number;
    /** Power-save mode for non-peer neighbours (optional) */
    mesh_non_peer_PS?: number;
    /** Receiving wireless rate from peer */
    rx: WifiRateEntry;
    /** Transmitting wireless rate to peer */
    tx: WifiRateEntry;
  }

  /**
   * Describes a wireless scan result for a neighbouring network.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.network.html#.WifiScanResult
   */
  interface WifiScanResult {
    /** SSID / Mesh ID of the network */
    ssid: string;
    /** BSSID of the network */
    bssid: string;
    /** Operation mode: 'Master', 'Ad-Hoc', 'Mesh Point' */
    mode: string;
    /** Wireless channel */
    channel: number;
    /** Received signal strength in dBm */
    signal: number;
    /** Numeric quality level of the signal */
    quality: number;
    /** Maximum possible quality level */
    quality_max: number;
    /** Encryption used by the wireless network */
    encryption: WifiEncryption;
  }

  /**
   * Describes a swconfig switch topology.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.network.html#.SwitchTopology
   */
  interface SwitchTopology {
    /** Object describing CPU port connections mapping port number to device name */
    netdevs: { [portNum: number]: string };
    /** Array describing populated ports in external label order */
    ports: Array<{
      /** Internal switch port number */
      num: number;
      /** Port label, e.g. 'LAN 1' or 'CPU (eth0)' */
      label: string;
      /** Connected Linux device name (CPU ports only) */
      device?: string;
      /** Whether port must be tagged (CPU ports only) */
      tagged?: boolean;
    }>;
  }

  /**
   * Represents a network device (eth0, wlan0, br-lan, etc).
   * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html
   */
  class Device {
    /**
     * Get the name of the network device.
     * @returns The device name, e.g. 'eth0' or 'wlan0'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getName
     */
    getName(): string;

    /**
     * Get the MAC address of the device.
     * @returns The MAC address or null if not applicable
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getMAC
     */
    getMAC(): string | null;

    /**
     * Get the MTU of the device.
     * @returns The MTU value
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getMTU
     */
    getMTU(): number;

    /**
     * Get the IPv4 addresses configured on the device.
     * @returns Array of IPv4 address strings
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getIPAddrs
     */
    getIPAddrs(): string[];

    /**
     * Get the IPv6 addresses configured on the device.
     * @returns Array of IPv6 address strings
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getIP6Addrs
     */
    getIP6Addrs(): string[];

    /**
     * Get the type of the device.
     * @returns Device type: 'alias', 'wifi', 'bridge', 'tunnel', 'vlan', 'vrf', 'switch', or 'ethernet'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getType
     */
    getType(): string;

    /**
     * Get a short description string for the device.
     * @returns Device description for non-WiFi or operation mode and SSID for WiFi devices
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getShortName
     */
    getShortName(): string;

    /**
     * Get a long description string for the device.
     * @returns Type description and device name for non-WiFi or mode and SSID for WiFi
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getI18n
     */
    getI18n(): string;

    /**
     * Get a string describing the device type.
     * @returns Type description, e.g. "Wireless Adapter" or "Bridge"
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getTypeI18n
     */
    getTypeI18n(): string;

    /**
     * Get the associated bridge ports of the device.
     * @returns Array of Device instances representing bridge ports or null if not a bridge
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getPorts
     */
    getPorts(): Device[] | null;

    /**
     * Get the bridge ID.
     * @returns Bridge ID or null if not a Linux bridge
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getBridgeID
     */
    getBridgeID(): string | null;

    /**
     * Get the bridge STP setting.
     * @returns True when device is a Linux bridge with STP enabled, else false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getBridgeSTP
     */
    getBridgeSTP(): boolean;

    /**
     * Checks whether this device is a Linux bridge.
     * @returns True when device is a bridge, else false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#isBridge
     */
    isBridge(): boolean;

    /**
     * Checks whether this device is part of a Linux bridge.
     * @returns True when device is part of a bridge, else false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#isBridgePort
     */
    isBridgePort(): boolean;

    /**
     * Checks whether this device is up.
     * @returns True when device is running, else false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#isUp
     */
    isUp(): boolean;

    /**
     * Get the amount of received bytes.
     * @returns Number of bytes received by the device
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getRXBytes
     */
    getRXBytes(): number;

    /**
     * Get the amount of transmitted bytes.
     * @returns Number of bytes transmitted by the device
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getTXBytes
     */
    getTXBytes(): number;

    /**
     * Get the amount of received packets.
     * @returns Number of packets received by the device
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getRXPackets
     */
    getRXPackets(): number;

    /**
     * Get the amount of transmitted packets.
     * @returns Number of packets transmitted by the device
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getTXPackets
     */
    getTXPackets(): number;

    /**
     * Get the carrier state of the network device.
     * @returns True if device has a carrier (e.g. cable inserted), else false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getCarrier
     */
    getCarrier(): boolean;

    /**
     * Get the current link speed of the network device if available.
     * @returns Current speed in Mbps, -1 if no carrier, null if unsupported
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getSpeed
     */
    getSpeed(): number | null;

    /**
     * Get the current duplex mode of the network device if available.
     * @returns "full" or "half" if supported, null if unknown or unsupported
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getDuplex
     */
    getDuplex(): string | null;

    /**
     * Get the PSE (Power Sourcing Equipment / PoE) status of the device.
     * @returns Object containing PSE status information or null if not available
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getPSE
     */
    getPSE(): { [key: string]: string | number } | null;

    /**
     * Check if PSE (PoE) is available on this device.
     * @returns True if PSE hardware is available
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#hasPSE
     */
    hasPSE(): boolean;

    /**
     * Get the primary logical interface this device is assigned to.
     * @returns Protocol instance representing the logical interface or null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getNetwork
     */
    getNetwork(): Protocol | null;

    /**
     * Get the logical interfaces this device is assigned to.
     * @returns Array of Protocol instances
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getNetworks
     */
    getNetworks(): Protocol[];

    /**
     * Get the logical parent device of this device.
     * @returns Device instance or null if no parent (for DSA switches, VLANs, etc.)
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getParent
     */
    getParent(): Device | null;

    /**
     * Get the related wireless network this device is related to.
     * @returns WifiNetwork instance or null if not a wireless device
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Device.html#getWifiNetwork
     */
    getWifiNetwork(): WifiNetwork | null;
  }

  /**
   * Aggregates host information from multiple sources (DHCP leases, ARP, IPv6 neighbours, etc).
   * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Hosts.html
   */
  class Hosts {
    /**
     * Look up the hostname associated with the given MAC address.
     * @param mac - The MAC address to look up
     * @returns The hostname or null if not found
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Hosts.html#getHostnameByMACAddr
     */
    getHostnameByMACAddr(mac: string): string | null;

    /**
     * Look up the IPv4 address associated with the given MAC address.
     * @param mac - The MAC address to look up
     * @returns The IPv4 address or null if not found
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Hosts.html#getIPAddrByMACAddr
     */
    getIPAddrByMACAddr(mac: string): string | null;

    /**
     * Look up the IPv6 address associated with the given MAC address.
     * @param mac - The MAC address to look up
     * @returns The IPv6 address or null if not found
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Hosts.html#getIP6AddrByMACAddr
     */
    getIP6AddrByMACAddr(mac: string): string | null;

    /**
     * Look up the MAC address associated with the given IPv4 address.
     * @param ipaddr - The IPv4 address to look up
     * @returns The MAC address or null if not found
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Hosts.html#getMACAddrByIPAddr
     */
    getMACAddrByIPAddr(ipaddr: string): string | null;

    /**
     * Look up the MAC address associated with the given IPv6 address.
     * @param ip6addr - The IPv6 address to look up
     * @returns The MAC address or null if not found
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Hosts.html#getMACAddrByIP6Addr
     */
    getMACAddrByIP6Addr(ip6addr: string): string | null;

    /**
     * Look up the hostname associated with the given IPv4 address.
     * @param ipaddr - The IPv4 address to look up
     * @returns The hostname or null if not found
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Hosts.html#getHostnameByIPAddr
     */
    getHostnameByIPAddr(ipaddr: string): string | null;

    /**
     * Look up the hostname associated with the given IPv6 address.
     * @param ip6addr - The IPv6 address to look up
     * @returns The hostname or null if not found
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Hosts.html#getHostnameByIP6Addr
     */
    getHostnameByIP6Addr(ip6addr: string): string | null;

    /**
     * Return an array of (MAC address, name hint) tuples sorted by MAC address.
     * @param preferIp6 - Whether to prefer IPv6 (true) or IPv4 (false) when hostname unknown
     * @returns Array of [MAC, nameHint] tuples sorted by MAC
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Hosts.html#getMACHints
     */
    getMACHints(preferIp6?: boolean): Array<[string, string]>;
  }

  /**
   * Describes a logical UCI network defined by `config interface` in `/etc/config/network`.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html
   */
  class Protocol {
    /**
     * Get the name of the associated logical interface.
     * @returns Interface name, such as 'lan' or 'wan'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getName
     */
    getName(): string;

    /**
     * Get the type of the underlying interface.
     * @returns Value of the 'type' option (usually 'bridge') or null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getType
     */
    getType(): string | null;

    /**
     * Get the name of this network protocol class.
     * @returns Protocol name, e.g. 'static' or 'dhcp'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getProtocol
     */
    getProtocol(): string;

    /**
     * Return a human readable description for the protocol.
     * @returns Description string, e.g. 'Static address' or 'DHCP client'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getI18n
     */
    getI18n(): string;

    /**
     * Get the uptime of the logical interface.
     * @returns Uptime in seconds
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getUptime
     */
    getUptime(): number;

    /**
     * Get the metric value of the logical interface.
     * @returns Current metric value used for routes
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getMetric
     */
    getMetric(): number;

    /**
     * Get the requested firewall zone name of the logical interface.
     * @returns Firewall zone name or null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getZoneName
     */
    getZoneName(): string | null;

    /**
     * Query the first (primary) IPv4 address of the logical interface.
     * @returns Primary IPv4 address or null if not set
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getIPAddr
     */
    getIPAddr(): string | null;

    /**
     * Query all IPv4 addresses of the logical interface.
     * @returns Array of IPv4 addresses in CIDR notation
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getIPAddrs
     */
    getIPAddrs(): string[];

    /**
     * Query the first (primary) IPv4 netmask of the logical interface.
     * @returns Netmask string or null if not set
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getNetmask
     */
    getNetmask(): string | null;

    /**
     * Query the gateway (nexthop) of the default route associated with this logical interface.
     * @returns IPv4 nexthop address or null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getGatewayAddr
     */
    getGatewayAddr(): string;

    /**
     * Query the first (primary) IPv6 address of the logical interface.
     * @returns Primary IPv6 address in CIDR notation or null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getIP6Addr
     */
    getIP6Addr(): string | null;

    /**
     * Query all IPv6 addresses of the logical interface.
     * @returns Array of IPv6 addresses in CIDR notation
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getIP6Addrs
     */
    getIP6Addrs(): string[];

    /**
     * Query the gateway (nexthop) of the IPv6 default route associated with this logical interface.
     * @returns IPv6 nexthop address or null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getGateway6Addr
     */
    getGateway6Addr(): string;

    /**
     * Query the routed IPv6 prefix associated with the logical interface.
     * @returns Routed IPv6 prefix or null if not present
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getIP6Prefix
     */
    getIP6Prefix(): string | null;

    /**
     * Query the routed IPv6 prefixes associated with the logical interface.
     * @returns Array of routed IPv6 prefixes or null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getIP6Prefixes
     */
    getIP6Prefixes(): string[] | null;

    /**
     * Query the IPv4 DNS servers associated with the logical interface.
     * @returns Array of IPv4 DNS servers
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getDNSAddrs
     */
    getDNSAddrs(): string[];

    /**
     * Query the IPv6 DNS servers associated with the logical interface.
     * @returns Array of IPv6 DNS servers
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getDNS6Addrs
     */
    getDNS6Addrs(): string[];

    /**
     * Query interface error messages published in ubus runtime state.
     * @returns Array of translated error messages
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getErrors
     */
    getErrors(): string[];

    /**
     * Get the name of the package providing the protocol functionality.
     * @returns Package name, e.g. 'odhcp6c' for 'dhcpv6'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getPackageName
     */
    getPackageName(): string;

    /**
     * Checks whether the underlying logical interface is declared as bridge.
     * @returns True if interface is a bridge, else false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#isBridge
     */
    isBridge(): boolean;

    /**
     * Checks whether this protocol is "virtual" (spawns own interfaces).
     * @returns True if protocol spawns dynamic interfaces, else false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#isVirtual
     */
    isVirtual(): boolean;

    /**
     * Checks whether this protocol is "floating".
     * @returns True if floating, else false
     * @deprecated
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#isFloating
     */
    isFloating(): boolean;

    /**
     * Checks whether this logical interface is dynamic.
     * @returns True if dynamic, false if configured
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#isDynamic
     */
    isDynamic(): boolean;

    /**
     * Checks whether this logical interface is pending.
     * @returns True when pending, false otherwise
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#isPending
     */
    isPending(): boolean;

    /**
     * Checks whether this logical interface is empty (no devices attached).
     * @returns True if empty, else false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#isEmpty
     */
    isEmpty(): boolean;

    /**
     * Checks whether this interface is an alias interface.
     * @returns Parent interface name if alias, else null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#isAlias
     */
    isAlias(): string | null;

    /**
     * Checks whether this logical interface is configured and running.
     * @returns True when active, false when not
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#isUp
     */
    isUp(): boolean;

    /**
     * Get the associated Linux network device of this network.
     * @returns Device name or null if unable to determine
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getIfname
     */
    getIfname(): string | null;

    /**
     * Read the given UCI option value of this network.
     * @param opt - The UCI option name to read
     * @returns Option value or null if not found
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#get
     */
    get(opt: string): string | string[] | null;

    /**
     * Set the given UCI option of this network to the given value.
     * @param opt - The UCI option name to set
     * @param val - The value to set or null to remove option
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#set
     */
    set(opt: string, val: string | string[] | null): null;

    /**
     * Returns the Linux network device associated with this logical interface.
     * @returns Device instance representing the expected Linux device
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getDevice
     */
    getDevice(): Device;

    /**
     * Returns the layer 2 Linux network device currently associated with this logical interface.
     * @returns Device instance representing the L2 device
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getL2Device
     */
    getL2Device(): Device;

    /**
     * Returns the layer 3 Linux network device currently associated with this logical interface.
     * @returns Device instance representing the L3 device
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getL3Device
     */
    getL3Device(): Device;

    /**
     * Returns a list of network sub-devices associated with this logical interface.
     * @returns Array of Device instances or null if not supporting sub-devices
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getDevices
     */
    getDevices(): Device[] | null;

    /**
     * Add the given network device to the logical interface.
     * @param device - Device object, name, or string to add
     * @returns True if added, false if invalid or already present
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#addDevice
     */
    addDevice(device: Protocol | Device | WifiDevice | WifiNetwork | string): boolean;

    /**
     * Remove the given network device from the logical interface.
     * @param device - Device object, name, or string to remove
     * @returns True if removed, false if invalid or not present
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#deleteDevice
     */
    deleteDevice(device: Protocol | Device | WifiDevice | WifiNetwork | string): boolean;

    /**
     * Checks whether this logical interface contains the given device object.
     * @param device - Device object, name, or string to check
     * @returns True if contained, else false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#containsDevice
     */
    containsDevice(device: Protocol | Device | WifiDevice | WifiNetwork | string): boolean;

    /**
     * Get the logical interface expiry time in seconds.
     * @returns Seconds until lease expires or -1 if not applicable
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#getExpiry
     */
    getExpiry(): number;

    /**
     * Cleanup related configuration entries.
     * @returns Promise that may be awaited before configuration is removed
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.Protocol.html#deleteConfiguration
     */
    deleteConfiguration(): Promise<any> | any;
  }

  /**
   * Represents a wireless radio device (phy).
   * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiDevice.html
   */
  class WifiDevice {
    /**
     * Get the configuration name of this wireless radio.
     * @returns UCI section name, e.g. 'radio0'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiDevice.html#getName
     */
    getName(): string;

    /**
     * Checks whether this wireless radio is disabled.
     * @returns True when disabled, else false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiDevice.html#isDisabled
     */
    isDisabled(): boolean;

    /**
     * Check whether the wireless radio is marked as up in ubus runtime state.
     * @returns True when radio is up, else false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiDevice.html#isUp
     */
    isUp(): boolean;

    /**
     * Read the given UCI option value of this wireless device.
     * @param opt - The UCI option name to read
     * @returns Option value or null if not found
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiDevice.html#get
     */
    get(opt: string): string | string[] | null;

    /**
     * Set the given UCI option of this wireless device to the given value.
     * @param opt - The UCI option name to set
     * @param value - The value to set or null to remove option
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiDevice.html#set
     */
    set(opt: string, value: string | string[] | null): null;

    /**
     * Gets a list of supported hwmodes.
     * @returns Array of hwmode values: 'a', 'b', 'g', 'n', 'ac', 'ax', 'be', etc.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiDevice.html#getHWModes
     */
    getHWModes(): string[];

    /**
     * Gets a list of supported htmodes.
     * @returns Array of htmode values: 'HT20', 'HT40', 'VHT20', 'VHT40', 'VHT80', 'HE20', 'EHT20', etc.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiDevice.html#getHTModes
     */
    getHTModes(): string[];

    /**
     * Get a string describing the wireless radio hardware.
     * @returns Description string
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiDevice.html#getI18n
     */
    getI18n(): string;

    /**
     * Trigger a wireless scan on this radio device and obtain a list of nearby networks.
     * @returns Promise resolving to array of WifiScanResult objects
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiDevice.html#getScanList
     */
    getScanList(): Promise<WifiScanResult[]>;

    /**
     * Get the wifi network of the given name belonging to this radio device.
     * @param network - Network name: UCI section ID, 'radio#.network#', or device name like 'wlan0'
     * @returns Promise resolving to WifiNetwork instance or rejecting with null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiDevice.html#getWifiNetwork
     */
    getWifiNetwork(network: string): Promise<WifiNetwork>;

    /**
     * Get all wireless networks associated with this wireless radio device.
     * @returns Promise resolving to array of WifiNetwork instances
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiDevice.html#getWifiNetworks
     */
    getWifiNetworks(): Promise<WifiNetwork[]>;

    /**
     * Adds a new wireless network associated with this radio device to the configuration.
     * @param options - Options to set for the newly added wireless network
     * @returns Promise resolving to WifiNetwork instance or null if invalid
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiDevice.html#addWifiNetwork
     */
    addWifiNetwork(options?: { [key: string]: string | string[] }): Promise<WifiNetwork | null>;

    /**
     * Deletes the wireless network with the given name associated with this radio device.
     * @param network - Network name: UCI section ID, 'radio#.network#', or device name
     * @returns Promise resolving to true if deleted, false if not found or not associated
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiDevice.html#deleteWifiNetwork
     */
    deleteWifiNetwork(network: string): Promise<boolean>;
  }

  /**
   * Represents a wireless network (vif) configured on a radio device.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html
   */
  class WifiNetwork {
    /**
     * Get the configuration ID of this wireless network.
     * @returns Corresponding UCI section ID
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getName
     */
    getName(): string;

    /**
     * Get the internal network ID of this wireless network.
     * @returns LuCI-specific network ID in the form 'radio#.network#'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getID
     */
    getID(): string;

    /**
     * Get the configured operation mode of the wireless network.
     * @returns Mode: 'ap', 'sta', 'adhoc', 'mesh', or 'monitor'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getMode
     */
    getMode(): string;

    /**
     * Get the configured SSID of the wireless network.
     * @returns SSID string or null when in mesh mode
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getSSID
     */
    getSSID(): string | null;

    /**
     * Get the configured Mesh ID of the wireless network.
     * @returns Mesh ID or null when not in mesh mode
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getMeshID
     */
    getMeshID(): string | null;

    /**
     * Get the configured BSSID of the wireless network.
     * @returns BSSID or null if none specified
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getBSSID
     */
    getBSSID(): string | null;

    /**
     * Get the Linux network device name.
     * @returns Device name or null if not configured or up
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getIfname
     */
    getIfname(): string | null;

    /**
     * Get the Linux VLAN network device names.
     * @returns Array of VLAN device names or empty array
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getVlanIfnames
     */
    getVlanIfnames(): string[];

    /**
     * Get the names of the logical interfaces this wireless network is attached to.
     * @returns Array of logical interface names
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getNetworkNames
     */
    getNetworkNames(): string[];

    /**
     * Get the name of the corresponding WiFi radio device.
     * @returns Radio device name or null if unable to determine
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getWifiDeviceName
     */
    getWifiDeviceName(): string | null;

    /**
     * Get the corresponding WiFi radio device.
     * @returns WifiDevice instance or null if not found
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getWifiDevice
     */
    getWifiDevice(): WifiDevice | null;

    /**
     * Checks whether this wireless network is disabled.
     * @returns True when disabled, else false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#isDisabled
     */
    isDisabled(): boolean;

    /**
     * Check whether the radio network is up.
     * @returns True when network is up, else false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#isUp
     */
    isUp(): boolean;

    /**
     * Query the current operation mode from runtime information.
     * @returns Human readable mode: 'Master', 'Ad-Hoc', 'Client', 'Monitor', 'Mesh Point', etc.
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getActiveMode
     */
    getActiveMode(): string;

    /**
     * Query the current operation mode from runtime information as translated string.
     * @returns Translated mode name
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getActiveModeI18n
     */
    getActiveModeI18n(): string;

    /**
     * Query the current SSID from runtime information.
     * @returns Current SSID or Mesh ID
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getActiveSSID
     */
    getActiveSSID(): string;

    /**
     * Query the current BSSID from runtime information.
     * @returns Current BSSID or Mesh ID
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getActiveBSSID
     */
    getActiveBSSID(): string;

    /**
     * Query the current encryption settings from runtime information.
     * @returns String describing encryption or '-'
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getActiveEncryption
     */
    getActiveEncryption(): string;

    /**
     * Query the current operating frequency of the wireless network.
     * @returns Current frequency in GHz or null
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getFrequency
     */
    getFrequency(): string | null;

    /**
     * Query the current average bit-rate of all peers associated with this wireless network.
     * @returns Average bit rate or null if not available
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getBitRate
     */
    getBitRate(): number | null;

    /**
     * Query the current wireless channel.
     * @returns Wireless channel or null if unable to determine
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getChannel
     */
    getChannel(): number | null;

    /**
     * Query the current wireless signal.
     * @returns Signal in dBm or null if unable to determine
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getSignal
     */
    getSignal(): number | null;

    /**
     * Query the current radio noise floor.
     * @returns Noise floor in dBm or 0 if unable to determine
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getNoise
     */
    getNoise(): number;

    /**
     * Query the current country code.
     * @returns Country code or "00" if unable to determine
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getCountryCode
     */
    getCountryCode(): string;

    /**
     * Query the current radio TX power.
     * @returns TX power in dBm or null if unable to determine
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getTXPower
     */
    getTXPower(): number | null;

    /**
     * Query the radio TX power offset.
     * @returns TX power offset in dBm or 0 if none or unable to determine
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getTXPowerOffset
     */
    getTXPowerOffset(): number;

    /**
     * Calculate the current signal quality percentage.
     * @returns Signal quality in percent (calculated from quality and quality_max)
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getSignalPercent
     */
    getSignalPercent(): number;

    /**
     * Fetch the list of associated peers.
     * @returns Promise resolving to array of WifiPeerEntry objects
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getAssocList
     */
    getAssocList(): Promise<WifiPeerEntry[]>;

    /**
     * Fetch the vlans for this network.
     * @returns Promise resolving to array of WifiVlan instances
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getVlans
     */
    getVlans(): Promise<WifiVlan[]>;

    /**
     * Read the given UCI option value of this wireless network.
     * @param opt - The UCI option name to read
     * @returns Option value or null if not found
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#get
     */
    get(opt: string): string | string[] | null;

    /**
     * Set the given UCI option of this network to the given value.
     * @param opt - The UCI option name to set
     * @param value - The value to set or null to remove option
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#set
     */
    set(opt: string, value: string | string[] | null): null;

    /**
     * Get the associated Linux network device.
     * @returns Device instance representing the network device
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getDevice
     */
    getDevice(): Device;

    /**
     * Get the primary logical interface this network is attached to.
     * @returns Protocol instance or null if not attached
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getNetwork
     */
    getNetwork(): Protocol | null;

    /**
     * Get the logical interfaces this network is attached to.
     * @returns Array of Protocol instances
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getNetworks
     */
    getNetworks(): Protocol[];

    /**
     * Get a short description string for this wireless network.
     * @returns Description with mode, SSID/BSSID, or network ID
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getShortName
     */
    getShortName(): string;

    /**
     * Get a description string for this wireless network.
     * @returns Full description with mode, SSID, BSSID, or network ID and device name
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#getI18n
     */
    getI18n(): string;

    /**
     * Check whether this WiFi network supports de-authenticating clients.
     * @returns True if supported, else false
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#isClientDisconnectSupported
     */
    isClientDisconnectSupported(): boolean;

    /**
     * Forcibly disconnect the given client from the wireless network.
     * @param mac - MAC address of client to disconnect
     * @param deauth - De-authenticate (true) or disassociate (false), default false
     * @param reason - IEEE 802.11 reason code, default 1
     * @param ban_time - Milliseconds to ban client, default 0
     * @returns Promise resolving to ubus call result code (typically 0)
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiNetwork.html#disconnectClient
     */
    disconnectClient(
      mac: string,
      deauth?: boolean,
      reason?: number,
      ban_time?: number
    ): Promise<number>;
  }

  /**
   * Represents a VLAN on a WifiNetwork.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiVlan.html
   */
  class WifiVlan {
    /**
     * Get the name of the wifi vlan.
     * @returns VLAN name
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiVlan.html#getName
     */
    getName(): string;

    /**
     * Get the vlan id of the wifi vlan.
     * @returns VLAN ID number
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiVlan.html#getVlanId
     */
    getVlanId(): number;

    /**
     * Get the network of the wifi vlan.
     * @returns Network name
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiVlan.html#getNetwork
     */
    getNetwork(): string;

    /**
     * Get the Linux network device name of the wifi vlan.
     * @returns Network device name
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiVlan.html#getIfname
     */
    getIfname(): string;

    /**
     * Get a long description string for the wifi vlan.
     * @returns String containing VLAN ID and name
     * @see https://openwrt.github.io/luci/jsapi/LuCI.network.WifiVlan.html#getI18n
     */
    getI18n(): string;
  }
}
