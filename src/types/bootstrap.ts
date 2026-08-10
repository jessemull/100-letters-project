import { CorrespondenceCard } from './correspondence';

/** Shape of `public/data/bootstrap.json` written by `scripts/prebuild.js`. */
export type BootstrapData = {
  correspondences: CorrespondenceCard[];
  dataVersion: number;
  earliestSentAtDate: string;
  totalCorrespondences: number;
};
