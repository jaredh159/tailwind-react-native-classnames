import type { TwConfig } from './tw-config';

let initialTwConfig: TwConfig | undefined;

export function getInitialTwConfig(): TwConfig | undefined {
  return initialTwConfig;
}

export function configure(twConfig: TwConfig): void {
  initialTwConfig = twConfig;
}
