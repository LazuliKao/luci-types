/**
 * LuCI TypeScript definitions
 * These types represent the LuCI framework APIs used in views
 */


  /**
   * Environment settings used by the LuCI runtime
   * @see https://openwrt.github.io/luci/jsapi/LuCI.html#env
   */
declare namespace LuCI {
  interface Env {
    /** Base URL for LuCI resources */
    base_url: string;
    /** CGI base directory */
    cgi_base: string;
    /** Server document root path */
    documentroot: string;
    /** Media directory path */
    media: string;
    /** Node specification for ACL checks */
    nodespec?: {
      satisfied: boolean;
      readonly: boolean;
    };
    /** Polling interval for request in milliseconds */
    pollinterval?: number;
    /** Request path extracted from URL */
    requestpath: string;
    /** Resource directory path */
    resource: string;
    /** Resource version string for cache busting */
    resource_version?: string;
    /** Current script name */
    scriptname: string;
    /** Session identifier */
    sessionid: string;
    /** CSRF/authentication token */
    token: string;
    /** Ubus RPC endpoint URL */
    ubuspath: string;
  }
  /**
   * Callback invoked when an HTTP reply to a request made via L.get(), L.post() or L.poll()
   * is timed out or received successfully.
   * @see https://openwrt.github.io/luci/jsapi/LuCI.html#.requestCallbackFn
   */
  type requestCallbackFn = (
    xhr: XMLHttpRequest,
    data: unknown,
    duration: number,
  ) => void;
}

// Global LuCI objects available via LuCI 'require' lines
declare const L: {
  view: typeof LuCI.view & {
    extend<TN extends {}>(proto: Partial<typeof LuCI.view>): new (...args: unknown[]) => typeof LuCI.view & TN;
  };
  form: typeof LuCI.form;
  fs: typeof LuCI.fs;
  rpc: typeof LuCI.rpc;
  uci: typeof LuCI.uci;
  Poll: typeof LuCI.poll;
  /** Legacy L.Request class alias (deprecated) */
  Request: new (...args: unknown[]) => unknown;
  /** Legacy L.dom class alias (deprecated) */
  dom: new (...args: unknown[]) => unknown;
  env: LuCI.Env;

  /**
   * Compares two values numerically and returns -1, 0, or 1.
   * Meant for use with Array.sort().
   */
  naturalCompare: (a: unknown, b: unknown) => number;

  /**
   * Return a bound function using the given self as this context.
   */
  bind<T extends (...args: unknown[]) => unknown>(fn: T, self: ThisParameterType<T>, ...args: unknown[]): T;

  /**
   * A wrapper around raise() which also renders the error either as
   * modal overlay or directly into the view body.
   */
  error(type?: Error | string, fmt?: string, ...args: unknown[]): never;

  /** Construct an absolute filesystem path relative to the server document root. */
  fspath(...parts: string[]): string;

  /**
   * Issues a GET request (deprecated, use require('request') instead).
   */
  get(url: string, cb: LuCI.requestCallbackFn): Promise<null>;
  get(url: string, args: Record<string, string>, cb: LuCI.requestCallbackFn): Promise<null>;

  /** Stop the polling loop (deprecated). */
  halt(): boolean;

  /** Test whether a particular system feature is available. */
  hasSystemFeature(feature: string, subfeature?: string): boolean | null;

  /** Check whether a view has sufficient permissions. */
  hasViewPermission(): boolean | null;

  /** Tests whether the passed argument is a function arguments object. */
  isArguments(val?: unknown): boolean;

  /** Tests whether the passed argument is a JavaScript object. */
  isObject(val?: unknown): boolean;

  /** Return the complete URL path to the current view. */
  location(): string;

  /** Construct a URL path relative to the media resource path. */
  media(...parts: string[]): string;

  /** Construct a relative URL path from the given prefix and parts. */
  path(prefix?: string, ...parts: string[]): string;

  /**
   * Register a polling HTTP request (deprecated, use require('poll') instead).
   */
  poll(interval: number, url: string, cb: LuCI.requestCallbackFn, post?: boolean): Function;
  poll(
    interval: number,
    url: string,
    args: Record<string, string>,
    cb: LuCI.requestCallbackFn,
    post?: boolean,
  ): Function;

  /**
   * Issues a POST request (deprecated, use require('request') instead).
   */
  post(url: string, cb: LuCI.requestCallbackFn): Promise<null>;
  post(url: string, args: Record<string, string>, cb: LuCI.requestCallbackFn): Promise<null>;

  /** Captures the current stack trace and throws an error. */
  raise(type?: Error | string, fmt?: string, ...args: unknown[]): never;

  /** Load an additional LuCI JavaScript class and return the instantiated class. */
  require(name: string, from?: string[]): Promise<unknown>;

  /** Returns a promise resolving with either the given value or the default on rejection. */
  resolveDefault<T>(value: T, defvalue: T): Promise<T>;

  /** Construct a URL path relative to the global static resource path. */
  resource(...parts: string[]): string;

  /** Start the polling loop (deprecated). */
  run(): boolean;

  /** Convert and sort array numerically using naturalCompare(). */
  sortedArray<T>(val: T | T[]): T[];

  /** Return an array of sorted object keys. */
  sortedKeys(obj: object, key?: string | null, sortmode?: 'addr' | 'num'): string[];

  /** Remove a polling entry (deprecated). */
  stop(entry: Function): boolean;

  /** Convert the given value to an array. */
  toArray<T>(val: null | string | string[] | SectionObject): T[];

  /** Construct a URL relative to the script path of the server side LuCI application. */
  url(...parts: string[]): string;

  Class: {
    extend(proto: Record<string, unknown>): unknown;
  };
};

declare const E: (name: string, attrs?: Record<string, unknown> | null, ...children: unknown[]) => HTMLElement;

type SpecifierMap = {
  d: number;
  s: string;
  f: number;
};

type ParseFormat<
  S extends string,
  Acc extends unknown[] = [],
> = S extends `${infer _}%${infer K}${infer Rest}`
  ? K extends keyof SpecifierMap
    ? ParseFormat<Rest, [...Acc, SpecifierMap[K]]>
    : ParseFormat<Rest, Acc>
  : Acc;

declare class Formatter<S extends string> {
  format(...args: ParseFormat<S>): string;
}
/** i18n translate function, returns a Formatter for interpolation. */
declare function _<S extends string>(s: S): Formatter<S> & string;

/**
 * Legacy global CBI form widget constructors.
 *
 * Provides access to form widget classes such as `ZoneSelect`,
 * `NetworkSelect`, `DeviceSelect`, `IPSelect`, and others.
 *
 * @deprecated Use `require('tools.widgets')` instead, which returns
 * the typed `LuCI.tools.widgets.WidgetsModule` interface.
 */
declare const widgets: LuCI.tools.widgets.WidgetsModule;

/**
 * Legacy global firewall model reference.
 *
 * @deprecated Use `require('firewall')` instead.
 */
declare const fwmodel: {
  /**
   * Get the CSS style string for a firewall zone badge.
   *
   * Produces a repeating-linear-gradient CSS string for rendering
   * zone colour badges in the form UI.
   *
   * @param zone - The zone name or `null` for unset/device zones.
   * @returns CSS `background:` style string.
   */
  getZoneColorStyle(zone: string | null): string;
};
