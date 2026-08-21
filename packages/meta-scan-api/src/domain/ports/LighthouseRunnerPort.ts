import type * as chromeLauncher from "chrome-launcher";

export type ChromeProcess = chromeLauncher.LaunchedChrome;

export interface LighthouseRunnerPort {
  launch(): Promise<ChromeProcess>;
  safeKill(proc?: ChromeProcess): Promise<void>;
}
