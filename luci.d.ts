/**
 * LuCI TypeScript definitions
 * These types represent the LuCI framework APIs used in views
 */

declare namespace LuCI {

  type ParamsForArgs<Args extends any[]> = Args extends []
    ? never
    : { length: Args["length"] } & readonly string[];

  type InferReturn<R> = unknown extends R ? undefined : R;
  type RpcFn<A extends readonly any[], R> = (...args: A) => Promise<R>;

  /**
   * Environment settings used by the LuCI runtime
   * @see https://openwrt.github.io/luci/jsapi/LuCI.html#env
   */
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
    data: any,
    duration: number,
  ) => void;
}

// Global LuCI objects available via LuCI 'require' lines
declare const L: {
  view: (new (...args: any[]) => typeof LuCI.view) & {
      extend<TN extends {}>(proto: Partial<typeof LuCI.view>): new (...args: any[]) => typeof LuCI.view & TN;
  };
  form: typeof LuCI.form;
  fs: typeof LuCI.fs;
  ui: typeof LuCI.ui;
  rpc: typeof LuCI.rpc;
  uci: typeof LuCI.uci;
  Poll: typeof LuCI.poll;
  /** Legacy L.Request class alias (deprecated) */
  Request: new (...args: any[]) => any;
  /** Legacy L.dom class alias (deprecated) */
  dom: new (...args: any[]) => any;
  env: LuCI.Env;

  /**
   * Compares two values numerically and returns -1, 0, or 1.
   * Meant for use with Array.sort().
   */
  naturalCompare: (a: any, b: any) => number;

  /**
   * Return a bound function using the given self as this context.
   */
  bind(fn: Function, self: any, ...args: any[]): Function;

  /**
   * A wrapper around raise() which also renders the error either as
   * modal overlay or directly into the view body.
   */
  error(type?: Error | string, fmt?: string, ...args: any[]): never;

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
  isArguments(val?: any): boolean;

  /** Tests whether the passed argument is a JavaScript object. */
  isObject(val?: any): boolean;

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
  raise(type?: Error | string, fmt?: string, ...args: any[]): never;

  /** Load an additional LuCI JavaScript class and return the instantiated class. */
  require(name: string, from?: string[]): Promise<any>;

  /** Returns a promise resolving with either the given value or the default on rejection. */
  resolveDefault(value: any, defvalue: any): Promise<any>;

  /** Construct a URL path relative to the global static resource path. */
  resource(...parts: string[]): string;

  /** Start the polling loop (deprecated). */
  run(): boolean;

  /** Convert and sort array numerically using naturalCompare(). */
  sortedArray(val: any): any[];

  /** Return an array of sorted object keys. */
  sortedKeys(obj: object, key?: string | null, sortmode?: 'addr' | 'num'): string[];

  /** Remove a polling entry (deprecated). */
  stop(entry: Function): boolean;

  /** Convert the given value to an array. */
  toArray(val: any): any[];

  /** Construct a URL relative to the script path of the server side LuCI application. */
  url(...parts: string[]): string;

  Class: {
    extend(proto: any): any;
  };
};

declare const E: (...args: any[]) => HTMLElement;

type SpecifierMap = {
  d: number;
  s: string;
  f: number;
};

type ParseFormat<
  S extends string,
  Acc extends any[] = [],
> = S extends `${infer _}%${infer K}${infer Rest}`
  ? K extends keyof SpecifierMap
    ? ParseFormat<Rest, [...Acc, SpecifierMap[K]]>
    : ParseFormat<Rest, Acc>
  : Acc;

declare class Formatter<S extends string> {
  format(...args: ParseFormat<S>): string;
}
// i18n translate function
declare function _<S extends string>(s: S): Formatter<S> & string;
// declare function _(
//   text: string,
//   ...args: any[]
// ): string & { format(...args: any[]): string };

declare const widgets: any;
declare const fwmodel: { getZoneColorStyle(zone: string): string };
