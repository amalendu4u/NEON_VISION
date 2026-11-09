import type { NeonTheme } from './shared/theme-context';

export interface NeonVisionFeatures {
  sleepTimer: boolean;
  autoplayNext: boolean;
  theaterMode: boolean;
  screenshotExport: boolean;
  playlist: boolean;
  chapters: boolean;
}

export interface NeonVisionConfig {
  theme: NeonTheme;
  features: NeonVisionFeatures;
}

export type NeonVisionConfigInput = Partial<Omit<NeonVisionConfig, 'features'>> & {
  features?: Partial<NeonVisionFeatures>;
};

export const DEFAULT_NEON_VISION_CONFIG: NeonVisionConfig = {
  theme: 'spectrum',
  features: {
    sleepTimer: true,
    autoplayNext: true,
    theaterMode: true,
    screenshotExport: true,
    playlist: true,
    chapters: true,
  },
};

export function resolveNeonVisionConfig(input: NeonVisionConfigInput = {}): NeonVisionConfig {
  return {
    theme: input.theme ?? DEFAULT_NEON_VISION_CONFIG.theme,
    features: { ...DEFAULT_NEON_VISION_CONFIG.features, ...input.features },
  };
}
