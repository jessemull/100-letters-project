import { Status } from '@ts-types/correspondence';

export const correspondenceStatusMap: Record<Status, string> = {
  [Status.COMPLETED]: 'Completed',
  [Status.PENDING]: 'Pending',
  [Status.RECEIVED]: 'Received',
  [Status.RESPONDED]: 'Responded',
  [Status.SENT]: 'Sent',
  [Status.UNSENT]: 'Unsent',
};
