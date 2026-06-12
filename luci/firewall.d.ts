/**
 * LuCI Firewall module
 *
 * Provides high-level abstractions for managing the firewall configuration
 * (zones, forwarding rules, redirects, rules, defaults) via UCI.
 *
 * @see https://github.com/openwrt/luci/blob/master/modules/luci-base/htdocs/luci-static/resources/firewall.js
 */
declare namespace LuCI.firewall {
  // -----------------------------------------------------------------------
  //  Helper functions
  // -----------------------------------------------------------------------

  /**
   * Look up a firewall zone by name.
   * @param name - Zone name or `null`.
   * @returns The matching zone or `null`.
   */
  function lookupZone(name: string | null): Zone | null;

  /**
   * Generate a deterministic colour for the given zone name.
   * @param forName - Zone name or `null` (returns default grey).
   * @returns Hex colour string, e.g. `#90f090`.
   */
  function getColorForName(forName: string | null): string;

  // -----------------------------------------------------------------------
  //  AbstractFirewallItem base
  // -----------------------------------------------------------------------

  /**
   * Abstract base for all firewall configuration items.
   * Provides low-level `get()` / `set()` access to UCI options.
   */
  interface AbstractFirewallItem {
    /** The UCI section identifier. */
    sid: string;

    /**
     * Get a UCI option value from the underlying config section.
     * @param option - Option name.
     * @returns The option value (type varies by option).
     */
    get(option: string): unknown;

    /**
     * Set a UCI option value in the underlying config section.
     * @param option - Option name.
     * @param value - New value.
     */
    set(option: string, value: unknown): void;
  }

  interface AbstractFirewallItemConstructor {
    new (): AbstractFirewallItem;
    extend(properties: Record<string, unknown>): AbstractFirewallItemConstructor;
  }

  // -----------------------------------------------------------------------
  //  Defaults
  // -----------------------------------------------------------------------

  interface Defaults extends AbstractFirewallItem {
    /**
     * Check whether SYN flood protection is enabled.
     * @returns `true` if `syn_flood` is `'1'`.
     */
    isSynFlood(): boolean;

    /**
     * Check whether drop-invalid is enabled.
     * @returns `true` if `drop_invalid` is `'1'`.
     */
    isDropInvalid(): boolean;

    /**
     * Get the default input policy.
     * @returns One of `'DROP'`, `'REJECT'`, `'ACCEPT'`.
     */
    getInput(): string;

    /**
     * Get the default output policy.
     * @returns One of `'DROP'`, `'REJECT'`, `'ACCEPT'`.
     */
    getOutput(): string;

    /**
     * Get the default forward policy.
     * @returns One of `'DROP'`, `'REJECT'`, `'ACCEPT'`.
     */
    getForward(): string;
  }

  interface DefaultsConstructor {
    new (): Defaults;
    extend(properties: Record<string, unknown>): DefaultsConstructor;
  }

  // -----------------------------------------------------------------------
  //  Zone
  // -----------------------------------------------------------------------

  interface Zone extends AbstractFirewallItem {
    /** The raw UCI section data for this zone. */
    data: Record<string, unknown> | null;

    /**
     * Get the zone name.
     * @returns Zone name string.
     */
    getName(): string;

    /**
     * Get the `network` option.
     * @returns The raw network value (may be a single string or space-separated).
     */
    getNetwork(): string;

    /**
     * Check if masquerading (NAT) is enabled.
     * @returns `true` if `masq` is `'1'`.
     */
    isMasquerade(): boolean;

    /**
     * Get the input policy for this zone.
     * @returns One of `'DROP'`, `'REJECT'`, `'ACCEPT'`.
     */
    getInput(): string;

    /**
     * Get the output policy for this zone.
     * @returns One of `'DROP'`, `'REJECT'`, `'ACCEPT'`.
     */
    getOutput(): string;

    /**
     * Get the forward policy for this zone.
     * @returns One of `'DROP'`, `'REJECT'`, `'ACCEPT'`.
     */
    getForward(): string;

    /**
     * Add a network to this zone.
     * @param network - Network name.
     * @returns `true` if added, `false` if already present or invalid.
     */
    addNetwork(network: string): boolean;

    /**
     * Remove a network from this zone.
     * @param network - Network name.
     * @returns `true` if removed, `false` if not found.
     */
    deleteNetwork(network: string): boolean;

    /**
     * Get the networks assigned to this zone.
     * @returns Array of network names.
     */
    getNetworks(): string[];

    /**
     * Clear all networks from this zone.
     */
    clearNetworks(): void;

    /**
     * Get the devices assigned to this zone.
     * @returns Array of device names.
     */
    getDevices(): string[];

    /**
     * Get the subnets assigned to this zone.
     * @returns Array of subnet strings.
     */
    getSubnets(): string[];

    /**
     * Get forwardings referencing this zone as either source or dest.
     * @param what - `'src'` or `'dest'`.
     * @returns Array of matching forwarding rules.
     */
    getForwardingsBy(what: 'src' | 'dest'): Forwarding[];

    /**
     * Add a forwarding from this zone to another zone.
     * @param dest - Destination zone name.
     * @returns The new forwarding or `null` if invalid.
     */
    addForwardingTo(dest: string): Forwarding | null;

    /**
     * Add a forwarding from another zone to this zone.
     * @param src - Source zone name.
     * @returns The new forwarding or `null` if invalid.
     */
    addForwardingFrom(src: string): Forwarding | null;

    /**
     * Delete forwardings referencing this zone.
     * @param what - `'src'` or `'dest'`.
     * @returns `true` if any were removed.
     */
    deleteForwardingsBy(what: 'src' | 'dest'): boolean;

    /**
     * Delete a specific forwarding rule.
     * @param forwarding - The forwarding to delete.
     * @returns `true` if removed.
     */
    deleteForwarding(forwarding: Forwarding): boolean;

    /**
     * Add a new redirect (port forwarding) rule to this zone.
     * @param options - Optional UCI key-value pairs to set.
     * @returns The new redirect.
     */
    addRedirect(options?: Record<string, unknown>): Redirect;

    /**
     * Add a new traffic rule to this zone.
     * @param options - Optional UCI key-value pairs to set.
     * @returns The new rule.
     */
    addRule(options?: Record<string, unknown>): Rule;

    /**
     * Get the deterministic colour for this zone or a given name.
     * @param forName - Optional name override; defaults to `getName()`.
     * @returns Hex colour string.
     */
    getColor(forName?: string): string;
  }

  interface ZoneConstructor {
    new (name: string): Zone;
    extend(properties: Record<string, unknown>): ZoneConstructor;
  }

  // -----------------------------------------------------------------------
  //  Forwarding
  // -----------------------------------------------------------------------

  interface Forwarding extends AbstractFirewallItem {
    getSource(): string;
    getDestination(): string;
    getSourceZone(): Zone | null;
    getDestinationZone(): Zone | null;
  }

  interface ForwardingConstructor {
    new (sid: string): Forwarding;
    extend(properties: Record<string, unknown>): ForwardingConstructor;
  }

  // -----------------------------------------------------------------------
  //  Rule
  // -----------------------------------------------------------------------

  interface Rule extends AbstractFirewallItem {
    getSource(): string;
    getDestination(): string;
    getSourceZone(): Zone | null;
    getDestinationZone(): Zone | null;
  }

  interface RuleConstructor {
    new (sid: string): Rule;
    extend(properties: Record<string, unknown>): RuleConstructor;
  }

  // -----------------------------------------------------------------------
  //  Redirect
  // -----------------------------------------------------------------------

  interface Redirect extends AbstractFirewallItem {
    getSource(): string;
    getDestination(): string;
    getSourceZone(): Zone | null;
    getDestinationZone(): Zone | null;
  }

  interface RedirectConstructor {
    new (sid: string): Redirect;
    extend(properties: Record<string, unknown>): RedirectConstructor;
  }

  // -----------------------------------------------------------------------
  //  Firewall class (module return value)
  // -----------------------------------------------------------------------

  interface FirewallInstance {
    /**
     * Load the firewall config and create a new Defaults instance.
     * @returns Promise resolving to the defaults.
     */
    getDefaults(): Promise<Defaults>;

    /**
     * Create and add a new zone with an auto-generated unique name.
     * @returns Promise resolving to the new zone or `null`.
     */
    newZone(): Promise<Zone | null>;

    /**
     * Add a new zone with the given name.
     * @param name - Zone name (must match `[a-zA-Z0-9_]+`).
     * @returns Promise resolving to the new zone or `null` on error.
     */
    addZone(name: string): Promise<Zone | null>;

    /**
     * Look up a firewall zone by name.
     * @param name - Zone name.
     * @returns Promise resolving to the zone or `null`.
     */
    getZone(name: string): Promise<Zone | null>;

    /**
     * Get all firewall zones, sorted by name.
     * @returns Promise resolving to an array of zones.
     */
    getZones(): Promise<Zone[]>;

    /**
     * Find a zone that contains the given network.
     * @param network - Network name.
     * @returns Promise resolving to the matching zone or `null`.
     */
    getZoneByNetwork(network: string): Promise<Zone | null>;

    /**
     * Delete a zone and clean up associated rules/redirects/forwardings.
     * @param name - Zone name or section name.
     * @returns Promise resolving to `true` if deleted.
     */
    deleteZone(name: string): Promise<boolean>;

    /**
     * Rename a zone and update references in rules/redirects/forwardings.
     * @param oldName - Current name.
     * @param newName - New name.
     * @returns Promise resolving to `true` if renamed.
     */
    renameZone(oldName: string, newName: string): Promise<boolean>;

    /**
     * Remove a given network from all zones.
     * @param network - Network name to remove.
     * @returns Promise resolving to `true` if any zone was modified.
     */
    deleteNetwork(network: string): Promise<boolean>;

    /**
     * Get a deterministic colour for a zone name.
     * @param forName - Zone name or `null`.
     * @returns Hex colour string.
     */
    getColorForName(forName: string | null): string;

    /**
     * Get the CSS colour style for a zone badge.
     * @param zone - Zone instance, zone name string, `'*'`, or `null`.
     * @returns CSS `background:` style string.
     */
    getZoneColorStyle(zone: Zone | string | null): string;
  }

  interface FirewallConstructor {
    new (): FirewallInstance;
  }
}
