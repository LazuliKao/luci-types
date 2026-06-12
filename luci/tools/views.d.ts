/**
 * LuCI View helper tools
 *
 * Provides log-reader views for the LuCI system log.
 *
 * @see https://github.com/openwrt/luci/blob/master/modules/luci-base/htdocs/luci-static/resources/tools/views.js
 */
declare namespace LuCI.tools.views {
  /**
   * Tuple describing a syslog facility entry: [numericCode, key, displayName].
   */
  type FacilityEntry = [string, string, string];

  /**
   * Tuple describing a syslog severity entry: [numericCode, key, displayName].
   */
  type SeverityEntry = [string, string, string];

  /**
   * Return value of `retrieveLog()`.
   */
  interface LogData {
    value: string;
    rows: number;
  }

  /**
   * A LogreadBox view class instance.
   *
   * Created by calling `LogreadBox(logtag?, name?)` which returns
   * an `L.view` subclass configured for system log display.
   */
  interface LogreadBoxView {
    logFacilityFilter: string;
    invertLogFacilitySearch: boolean;
    logSeverityFilter: string;
    invertLogSeveritySearch: boolean;
    logTextFilter: string;
    invertLogTextSearch: boolean;
    logTagFilter: string;
    logName: string;
    fetchMaxRows: number;

    /** Pre-defined syslog facility entries with numeric codes, keys and display labels. */
    facilities: FacilityEntry[];

    /** Pre-defined syslog severity entries with numeric codes, keys and display labels. */
    severity: SeverityEntry[];

    /**
     * Fetch log entries from the system and apply current filter settings.
     *
     * Attempts to read via ubus `log.read` first and falls back to
     * executing the syslog wrapper when ubus is unavailable.
     *
     * @returns Formatted log text and row count.
     */
    retrieveLog(): Promise<LogData>;

    /**
     * Poll the system log and update the `<textarea id="syslog">` element.
     */
    pollLog(): Promise<void>;

    /**
     * Called before the view is rendered.
     * Registers the poll callback and loads UCI system config.
     *
     * @returns The log data for the initial render.
     */
    load(): Promise<LogData>;

    /**
     * Render the log viewer with filter controls and log text area.
     *
     * @param loglines - Log data from `load()` or `retrieveLog()`.
     * @returns A DOM node containing the complete log view.
     */
    render(loglines: LogData): Node;

    handleSaveApply: null;
    handleSave: null;
    handleReset: null;
  }

  interface LogreadBoxViewConstructor {
    new (): LogreadBoxView;
    extend(properties: Record<string, unknown>): LogreadBoxViewConstructor;
  }

  interface ViewsModule {
    /**
     * Create a LogreadBox view class for displaying system log entries.
     *
     * @param logtag - Optional log tag to pre-filter messages.
     * @param name - Optional display name for the log panel.
     * @returns An `L.view` subclass configured for system log display.
     */
    LogreadBox(logtag?: string, name?: string): LogreadBoxViewConstructor;
  }

  interface ViewsModuleConstructor {
    new (): ViewsModule;
    extend(properties: Record<string, unknown>): ViewsModuleConstructor;
  }
}
