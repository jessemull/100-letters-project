import { generateHearts } from '@util/animation';

export const baseHeartConfig = [
  { delay: 1.5, baseOffsetY: 0.15, baseOffsetX: 0.3, baseSize: 24 },
  { delay: 0, baseOffsetY: 0.4, baseOffsetX: 0.5, baseSize: 32 },
  { delay: 2, baseOffsetY: 0.05, baseOffsetX: 0.7, baseSize: 36 },
  { delay: 1, baseOffsetY: 0.25, baseOffsetX: 0.4, baseSize: 24 },
];

export const heartsConfig = generateHearts(50);
