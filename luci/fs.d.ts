declare namespace LuCI.fs {
  /**
   * File stat entry object returned by stat(), lstat(), and list() operations.
   * Contains detailed file metadata and permissions information.
   */
  interface FileStatEntry {
    /** Name of the directory entry */
    name: string;
    /** Type of the entry: 'block', 'char', 'directory', 'fifo', 'symlink', 'file', 'socket', or 'unknown' */
    type: string;
    /** Size in bytes */
    size: number;
    /** Access permissions (mode bits) */
    mode: number;
    /** Last access time in seconds since epoch */
    atime: number;
    /** Last modification time in seconds since epoch */
    mtime: number;
    /** Last change time in seconds since epoch */
    ctime: number;
    /** Inode number */
    inode: number;
    /** Numeric owner user ID */
    uid: number;
    /** Numeric owner group ID */
    gid: number;
    /** User name of owner */
    user: string;
    /** Group name of owner */
    group: string;
    /** Dictionary of properties of any symlink target (for list operation result entries) */
    target?: Record<string, unknown>;
  }

  /**
   * File execution result object returned by exec() and exec_direct().
   * Contains the exit code and optional stdout/stderr output.
   */
  interface FileExecResult {
    /** The exit code of the invoked command */
    code: number;
    /** The stdout produced by the command, if any */
    stdout?: string;
    /** The stderr produced by the command, if any */
    stderr?: string;
  }

  /**
   * Execute the specified command, optionally passing params and environment variables.
   *
   * Note: The command must be either the path to an executable, or a basename without arguments
   * in which case it will be searched in $PATH. If specified, the values given in params will
   * be passed as arguments to the command.
   *
   * The key/value pairs in the optional env table are translated to setenv() calls prior to
   * running the command.
   *
   * @param command - The command to invoke
   * @param params - Optional array of arguments to pass to the command
   * @param env - Optional environment variables to set
   * @returns A promise resolving to an object describing the execution results or rejecting with an error
   * @see https://openwrt.github.io/luci/jsapi/LuCI.fs.html
   */
  function exec(command: string, params?: string[], env?: Record<string, string>): Promise<FileExecResult>;

  /**
   * Execute the specified command, bypassing ubus.
   *
   * Note: The command must be either the path to an executable, or a basename without arguments
   * in which case it will be searched in $PATH. If specified, the values given in params will
   * be passed as arguments to the command.
   *
   * This function will invoke the requested commands through the cgi-io helper applet at
   * /cgi-bin/cgi-exec which bypasses the ubus rpc transport. This is useful to fetch large
   * command outputs which might exceed the ubus message size limits or which contain binary data.
   *
   * The cgi-io helper will enforce the same access permission rules as the ubus based exec call.
   *
   * @param command - The command to invoke
   * @param params - Optional array of arguments to pass to the command
   * @param type - Optional expected output type: 'text' (default), 'json', or 'blob'
   * @param latin1 - Optional whether to encode the command line as Latin1 instead of UTF-8 (default: false)
   * @param stderr - Optional whether to include stderr output in command output (default: false)
   * @param responseProgress - Optional callback function receiving ProgressEvent instances during transfer
   * @returns A promise resolving with the command stdout output interpreted according to the specified type
   * @see https://openwrt.github.io/luci/jsapi/LuCI.fs.html
   */
  function exec_direct(
    command: string,
    params?: string[],
    type?: 'blob' | 'text' | 'json',
    latin1?: boolean,
    stderr?: boolean,
    responseProgress?: (ev: ProgressEvent) => void
  ): Promise<unknown>;

  /**
   * Read the contents of the given file, split it into lines, trim leading and trailing white space
   * of each line and return the resulting array.
   *
   * This function is guaranteed to not reject its promises. On failure, an empty array will be returned.
   *
   * @param path - The file path to read
   * @returns A promise resolving to an array containing the stripped lines of the given file or [] on failure
   * @see https://openwrt.github.io/luci/jsapi/LuCI.fs.html
   */
  function lines(path: string): Promise<string[]>;

  /**
   * Obtains a listing of the specified directory.
   *
   * @param path - The directory path to list
   * @returns A promise resolving to an array of stat detail objects or rejecting with an error
   * @see https://openwrt.github.io/luci/jsapi/LuCI.fs.html
   */
  function list(path: string): Promise<FileStatEntry[]>;

  /**
   * Return symlink aware file stat information on the specified path.
   * This call differs from stat() in that it gives information about the symlink itself
   * instead of following the symlink, whereby size is the length of the string of the
   * symlink target path and file name.
   *
   * @param path - The filesystem path to lstat
   * @returns A promise resolving to a stat detail object or rejecting with an error
   * @see https://openwrt.github.io/luci/jsapi/LuCI.fs.html
   */
  function lstat(path: string): Promise<FileStatEntry>;

  /**
   * Read the contents of the given file and return them.
   *
   * Note: This function is unsuitable for obtaining binary data.
   *
   * @param path - The file path to read
   * @returns A promise resolving to a string containing the file contents or rejecting with an error
   * @see https://openwrt.github.io/luci/jsapi/LuCI.fs.html
   */
  function read(path: string): Promise<string>;

  /**
   * Read the contents of the given file and return them, bypassing ubus.
   *
   * This function will read the requested file through the cgi-io helper applet at
   * /cgi-bin/cgi-download which bypasses the ubus rpc transport. This is useful to fetch
   * large file contents which might exceed the ubus message size limits or which contain binary data.
   *
   * The cgi-io helper will enforce the same access permission rules as the ubus based read call.
   *
   * @param path - The file path to read
   * @param type - Optional expected type of read file contents: 'text' (default), 'json', or 'blob'
   * @returns A promise resolving with the file contents interpreted according to the specified type
   * @see https://openwrt.github.io/luci/jsapi/LuCI.fs.html
   */
  function read_direct(path: string, type?: 'blob' | 'text' | 'json'): Promise<unknown>;

  /**
   * Unlink the given file.
   *
   * @param path - The file path to remove
   * @returns A promise resolving to 0 or rejecting with an error
   * @see https://openwrt.github.io/luci/jsapi/LuCI.fs.html
   */
  function remove(path: string): Promise<number>;

  /**
   * Return file stat information on the specified path.
   *
   * @param path - The filesystem path to stat
   * @returns A promise resolving to a stat detail object or rejecting with an error
   * @see https://openwrt.github.io/luci/jsapi/LuCI.fs.html
   */
  function stat(path: string): Promise<FileStatEntry>;

  /**
   * Read the contents of the given file, trim leading and trailing white space and return
   * the trimmed result. In case of errors, return an empty string instead.
   *
   * Note: This function is useful to read single-value files in /sys or /proc.
   * This function is guaranteed to not reject its promises. On failure, an empty string
   * will be returned.
   *
   * @param path - The file path to read
   * @returns A promise resolving to the file contents or the empty string on failure
   * @see https://openwrt.github.io/luci/jsapi/LuCI.fs.html
   */
  function trimmed(path: string): Promise<string>;

  /**
   * Write the given data to the specified file path.
   * If the specified file path does not exist, it will be created, given sufficient permissions.
   *
   * Note: data will be converted to a string using String(data) or to '' when it is null.
   *
   * @param path - The file path to write to
   * @param data - Optional file data to write. If null, it will be set to an empty string
   * @param mode - Optional permissions to use on file creation (default: 420 / 0644)
   * @returns A promise resolving to 0 or rejecting with an error
   * @see https://openwrt.github.io/luci/jsapi/LuCI.fs.html
   */
  function write(path: string, data?: unknown, mode?: number): Promise<number>;
}
