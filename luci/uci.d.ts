declare namespace LuCI.uci {
  /**
   * A UCI change record representing a single operation in uncommitted changes.
   * Change records are arrays where the first element is the operation name,
   * followed by affected section ID and optional parameters depending on the operation.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#.ChangeRecord
   */
  type ChangeRecord = [
    operation: string,
    section_id: string,
    parameter?: string,
    value?: string
  ];

  /**
   * A section object represents the options and their values within a configuration section,
   * along with metadata fields prefixed with a dot (e.g., .name, .type, .anonymous, .index).
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#.SectionObject
   */
  interface SectionObject {
    /** The name of the section object (either an anonymous ID like cfgXXXXXX or a named section). */
    ".name": string;
    /** The type of the UCI section. */
    ".type": string;
    /** Whether the section is anonymous (true) or named (false). */
    ".anonymous": boolean;
    /** The sort order/index of the section. */
    ".index": number;
    /** All option property names will be in the form [A-Za-z0-9_]+ and contain string values or arrays of strings for lists. */
    [key: string]: string | string[] | boolean | number;
  }

  /**
   * Callback function invoked for each section found during enumeration.
   * @param section The section object.
   * @param sid The name or ID of the section.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#.sections
   */
  type SectionsCallback = (section: SectionObject, sid: string) => void;

  /**
   * Loads the given UCI configurations from the remote ubus api.
   * Loaded configurations are cached and only loaded once. To force reloading,
   * unload with uci.unload() first.
   * @param packages The name or array of names of configurations to load.
   * @returns Promise resolving to the names of successfully loaded configurations.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#load
   */
  function load(packages: string | string[]): Promise<string[]>;

  /**
   * Unloads the given UCI configurations from the local cache.
   * @param packages The name or array of names of configurations to unload.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#unload
   */
  function unload(packages: string | string[]): void;

  /**
   * Gets the value of the given option within the specified section or the entire section object if option is omitted.
   * @param conf The name of the configuration to read from.
   * @param sid The name or ID of the section to read.
   * @param opt Optional option name. If omitted, the entire section is returned.
   * @returns String for plain UCI options, array of strings for lists, section object if option omitted, or null if not found.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#get
   */
  function get(conf: string, sid: string, opt?: string | null): null | string | string[] | SectionObject;

  /**
   * A special case of get() that always returns either true or false.
   * Recognizes values "yes", "on", "true", "enabled" or "1" as true (case-insensitive).
   * @param conf The name of the configuration to read.
   * @param type The section type to read.
   * @param opt Optional option name. If omitted, returns false.
   * @returns Boolean value based on the option value.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#get_bool
   */
  function get_bool(conf: string, type: string, opt?: string | null): boolean;

  /**
   * Gets the value of the given option or the entire section object of the first found section
   * of the specified type, or the first section overall if no type is specified.
   * @param conf The name of the configuration to read from.
   * @param type Optional type of the first section to find. If null, reads the first section of the entire config.
   * @param opt Optional option name. If omitted, the entire section is returned.
   * @returns String for plain options, array of strings for lists, section object if option omitted, or null if not found.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#get_first
   */
  function get_first(conf: string, type?: string | null, opt?: string | null): null | string | string[] | SectionObject;

  /**
   * Sets the value of the given option within the specified section.
   * If config, section, option is null or option begins with a dot, does nothing.
   * @param conf The name of the configuration to set the option in.
   * @param sid The name or ID of the section to set the option in.
   * @param opt The option name to set.
   * @param val The value to set. If null or empty string, the option is removed.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#set
   */
  function set(conf: string, sid: string, opt: string, val: null | string | string[]): void;

  /**
   * Sets the value of the given option within the first found section matching the specified type,
   * or within the first section of the entire config if no type is specified.
   * @param conf The name of the configuration to set the option in.
   * @param type Optional type of the first section to find. If null, the first section of the entire config is written to.
   * @param opt The option name to set.
   * @param val The value to set. If null or empty string, the option is removed.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#set_first
   */
  function set_first(conf: string, type: string | null, opt: string, val: null | string | string[]): void;

  /**
   * Removes the given option within the specified section.
   * Convenience wrapper around uci.set(config, section, option, null).
   * @param conf The name of the configuration to remove the option from.
   * @param sid The name or ID of the section to remove the option from.
   * @param opt The name of the option to remove.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#unset
   */
  function unset(conf: string, sid: string, opt: string): void;

  /**
   * Removes the given option within the first found section matching the specified type,
   * or within the first section of the entire config if no type is specified.
   * Convenience wrapper around uci.set_first().
   * @param conf The name of the configuration to remove the option from.
   * @param type Optional type of the first section to find. If null, the first section of the entire config is written to.
   * @param opt The name of the option to remove.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#unset_first
   */
  function unset_first(conf: string, type: string | null, opt: string): void;

  /**
   * Adds a new section of the given type to the given configuration.
   * @param conf The name of the configuration to add the section to.
   * @param type The type of the section to add.
   * @param name Optional name of the section. If omitted, an anonymous section is added.
   * @returns The section ID of the newly added section.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#add
   */
  function add(conf: string, type: string, name?: string): string;

  /**
   * Removes the section with the given ID from the given configuration.
   * @param conf The name of the configuration to remove the section from.
   * @param sid The ID of the section to remove.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#remove
   */
  function remove(conf: string, sid: string): void;

  /**
   * Clones an existing section of the given type to the given configuration.
   * @param conf The name of the configuration into which to clone the section.
   * @param type The type of the section to clone.
   * @param srcsid The source section id to clone.
   * @param put_next Optional whether to put the cloned item next (true) or last (false: default).
   * @param name Optional name of the new cloned section. If omitted, an anonymous section is created.
   * @returns The section ID of the newly cloned section.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#clone
   */
  function clone(conf: string, type: string, srcsid: string, put_next?: boolean, name?: string): string;

  /**
   * Generates a new, unique section ID for the given configuration.
   * Note: The generated ID is temporary and will be replaced with cfgXXXXXX once the configuration is saved.
   * @param conf The configuration to generate the new section ID for.
   * @returns A newly generated unique section ID in the form newXXXXXX.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#createSID
   */
  function createSID(conf: string): string;

  /**
   * Resolves a given section ID in extended notation to the internal section ID value.
   * Extended notation is in the form @typename[#]. Returns null if extended ID cannot be resolved.
   * @param conf The configuration to resolve the section ID for.
   * @param sid The section ID to resolve. Can be in extended notation @typename[#] or regular form.
   * @returns The resolved section ID or the original ID if not in extended notation, or null if not found.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#resolveSID
   */
  function resolveSID(conf: string, sid: string): string | null;

  /**
   * Moves the first specified section within the given configuration before or after the second specified section.
   * @param conf The configuration to move the section within.
   * @param sid1 The ID of the section to move.
   * @param sid2 Optional ID of the target section. If null, sid1 is moved to the end.
   * @param after Optional when true, sid1 is moved after sid2; when false, moved before (default: false).
   * @returns true if the section was successfully moved, false if either section is not found.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#move
   */
  function move(conf: string, sid1: string, sid2?: string | null, after?: boolean): boolean;

  /**
   * Submits all local configuration changes to the remote ubus api,
   * adds, removes and reorders remote sections as needed, and reloads all loaded configurations.
   * @returns Promise resolving to an array of configuration names which have been reloaded.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#save
   */
  function save(): Promise<string[]>;

  /**
   * Instructs the remote ubus UCI api to commit all saved changes with rollback protection
   * and attempts to confirm the pending commit operation to cancel the rollback timer.
   * @param timeout Optional override for the confirmation timeout after which a rollback is triggered (default: 10).
   * @returns Promise resolving/rejecting with the ubus RPC status code.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#apply
   */
  function apply(timeout?: number): Promise<number>;

  /**
   * Fetches uncommitted UCI changes from the remote ubus RPC api.
   * @returns Promise resolving to an object containing configuration names as keys and arrays of change records as values.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#changes
   */
  function changes(): Promise<Record<string, ChangeRecord[]>>;

  /**
   * Enumerates the sections of the given configuration, optionally filtered by type.
   * @param conf The name of the configuration to enumerate sections for.
   * @param type Optional type filter. If specified, only sections of this type are enumerated.
   * @param cb Optional callback to invoke for each enumerated section.
   * @returns A sorted array of the section objects within the configuration, filtered by type if specified.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.uci.html#sections
   */
  function sections(conf: string, type?: string, cb?: SectionsCallback): SectionObject[];
}
