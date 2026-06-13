/**
 * LuCI CBI Form Widget tools
 *
 * Provides rich form widget classes for firewall zone selection,
 * network/device selection, IP selection, user/group selection,
 * and zone forwarding visualisation.
 *
 * @see https://github.com/openwrt/luci/blob/master/modules/luci-base/htdocs/luci-static/resources/tools/widgets.js
 */
declare namespace LuCI.tools.widgets {
	// -----------------------------------------------------------------------
	//  Helper functions exported at module scope
	// -----------------------------------------------------------------------

	//  Helper functions exported at module scope
	// -----------------------------------------------------------------------

	/**
	 * Get users found in `/etc/passwd`.
	 * @returns Promise resolving to an array of usernames.
	 */
	function getUsers(): Promise<string[]>;

	/**
	 * Get groups found in `/etc/group`.
	 * @returns Promise resolving to an array of group names.
	 */
	function getGroups(): Promise<string[]>;

	/**
	 * Get bridge devices or Layer 3 devices of a network object.
	 * @param network - The network protocol instance.
	 * @returns Array of device names.
	 */
	function getDevices(network: LuCI.network.Protocol): string[];

	// -----------------------------------------------------------------------
	//  CBIZoneSelect
	// -----------------------------------------------------------------------

	/** Additional properties of a `CBIZoneSelect` instance. */
	interface IZoneSelect {
		/** Firewall zones loaded from `firewall.getZones()`. */
		zones: LuCI.firewall.Zone[];

		/** Logical networks loaded from `network.getNetworks()`. */
		networks: LuCI.network.Protocol[];

		/** Whether the "any zone" option is selectable. */
		allowany?: boolean;

		/** Whether the "Device (input/output)" option is shown. */
		allowlocal?: boolean;

		/** Whether to allow creating new zone names. */
		nocreate?: boolean;

		/** Whether the field accepts multiple values. */
		multiple?: boolean;

		/** UCI option name this widget is bound to. */
		option: string;

		/** Display size for the dropdown. */
		display_size?: number;

		/** Dropdown page size. */
		dropdown_size?: number;

		/**
		 * Look up a firewall zone by name.
		 * @param name - Zone name.
		 * @returns The matching zone or `undefined`.
		 */
		lookupZone(name: string): LuCI.firewall.Zone | undefined;

		/**
		 * Look up a logical network by name.
		 * @param name - Network name.
		 * @returns The matching protocol instance or `undefined`.
		 */
		lookupNetwork(name: string): LuCI.network.Protocol | undefined;
	}

	// -----------------------------------------------------------------------
	//  CBIZoneForwards
	// -----------------------------------------------------------------------

	/** Additional properties of a `CBIZoneForwards` instance. */
	interface IZoneForwards {
		/** Firewall defaults. */
		defaults: LuCI.firewall.Defaults;

		/** Firewall zones. */
		zones: LuCI.firewall.Zone[];

		/** Logical networks. */
		networks: LuCI.network.Protocol[];

		/** Network devices. */
		devices: LuCI.network.Device[];

		/**
		 * Render a badge for the given firewall zone.
		 * @param zone - The zone to render.
		 * @returns A DOM element representing the zone badge.
		 */
		renderZone(zone: LuCI.firewall.Zone): HTMLElement;
	}

	// -----------------------------------------------------------------------
	//  CBIIPSelect
	// -----------------------------------------------------------------------

	/** Additional properties of a `CBIIPSelect` instance. */
	interface IIPSelect {
		/** Network devices loaded from `network.getDevices()`. */
		devices: LuCI.network.Device[];

		/** Device name to exclude from the choices. */
		exclude?: string;

		/** Whether the loopback device is included. */
		loopback?: boolean;

		/** Whether virtual devices are excluded. */
		novirtual?: boolean;

		/**
		 * Render a badge showing an IP address together with its device icon.
		 * @param device - The network device.
		 * @param ip - The IP address string (may include CIDR prefix).
		 * @returns A DOM element for the badge.
		 */
		renderIfaceBadge(device: LuCI.network.Device, ip: string): HTMLElement;

		/**
		 * Render the text value for display outside the dropdown.
		 * @param section_id - The configuration section ID.
		 * @returns A DOM node containing the rendered value.
		 */
		textvalue(section_id: string): Node;
	}

	// -----------------------------------------------------------------------
	//  CBINetworkSelect
	// -----------------------------------------------------------------------

	/** Additional properties of a `CBINetworkSelect` instance. */
	interface INetworkSelect {
		/** Logical networks loaded from `network.getNetworks()`. */
		networks: LuCI.network.Protocol[];

		/** Network name to exclude from choices. */
		exclude?: string;

		/** Whether the loopback interface is included. */
		loopback?: boolean;

		/** Whether virtual networks are excluded. */
		novirtual?: boolean;

		/** Whether to allow creating new network names. */
		nocreate?: boolean;

		/** Display size for the dropdown. */
		display_size?: number;

		/** Dropdown page size. */
		dropdown_size?: number;

		/**
		 * Render a badge for the given network interface.
		 * @param network - The network protocol instance.
		 * @returns A DOM element for the badge.
		 */
		renderIfaceBadge(network: LuCI.network.Protocol): HTMLElement;

		/**
		 * Render the text value for display outside the dropdown.
		 * @param section_id - The configuration section ID.
		 * @returns A DOM node containing the rendered value.
		 */
		textvalue(section_id: string): Node;
	}

	// -----------------------------------------------------------------------
	//  CBIDeviceSelect
	// -----------------------------------------------------------------------

	/** Additional properties of a `CBIDeviceSelect` instance. */
	interface IDeviceSelect {
		/** Network devices loaded from `network.getDevices()`. */
		devices: LuCI.network.Device[];

		/** Logical networks (loaded when `noaliases` is falsy). */
		networks: LuCI.network.Protocol[] | null;

		/** Device name to exclude. */
		exclude?: string;

		/** Whether alias devices are hidden. */
		noaliases?: boolean;

		/** Whether bridge devices are hidden. */
		nobridges?: boolean;

		/** Whether inactive (down) devices are hidden. */
		noinactive?: boolean;

		/** Whether to include IP addresses as choices alongside device names. */
		includeips?: boolean;

		/** Whether to allow creating new device name entries. */
		nocreate?: boolean;
	}

	// -----------------------------------------------------------------------
	//  CBIUserSelect
	// -----------------------------------------------------------------------

	/** Additional properties of a `CBIUserSelect` instance. */
	interface IUserSelect {
		// No additional properties beyond what `ListValue` provides.
	}

	// -----------------------------------------------------------------------
	//  CBIGroupSelect
	// -----------------------------------------------------------------------

	/** Additional properties of a `CBIGroupSelect` instance. */
	interface IGroupSelect {
		// No additional properties beyond what `ListValue` provides.
	}

	// -----------------------------------------------------------------------
	//  Module type (what `require('tools.widgets')` returns)
	//
	// The module returns `L.Class.extend({ZoneSelect, ZoneForwards, ...})`,
	// a class whose static properties are form widget constructors.
	// -----------------------------------------------------------------------

	interface WidgetsModule {
		ZoneSelect: new (...args: unknown[]) => LuCI.form.ListValue & IZoneSelect;
		ZoneForwards: new (
			...args: unknown[]
		) => LuCI.form.DummyValue & IZoneForwards;
		IPSelect: new (...args: unknown[]) => LuCI.form.ListValue & IIPSelect;
		NetworkSelect: new (
			...args: unknown[]
		) => LuCI.form.ListValue & INetworkSelect;
		DeviceSelect: new (
			...args: unknown[]
		) => LuCI.form.ListValue & IDeviceSelect;
		UserSelect: new (...args: unknown[]) => LuCI.form.ListValue & IUserSelect;
		GroupSelect: new (...args: unknown[]) => LuCI.form.ListValue & IGroupSelect;
	}

	interface WidgetsModuleConstructor {
		new (): WidgetsModule;
		extend(properties: Record<string, unknown>): WidgetsModuleConstructor;
	}
}
