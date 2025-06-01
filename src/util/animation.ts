import { baseHeartConfig } from '@constants/animation';

export const generateHearts = (count = 25) => {
  return Array.from({ length: count }, (_, i) => {
    const base = baseHeartConfig[i % baseHeartConfig.length];
    return {
      delay: base.delay + Math.random() * 10,
      baseOffsetY: base.baseOffsetY + (Math.random() - 0.5) * 0.2,
      baseOffsetX: base.baseOffsetX + (Math.random() - 0.5) * 0.4,
      baseSize: base.baseSize + (Math.random() - 0.5) * 8,
    };
  });
};
