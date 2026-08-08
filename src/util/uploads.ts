const UUID =
  '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}';

/**
 * Normalize a stored letter image fileKey for DELETE /uploads.
 *
 * Upload flow stores `unprocessed/{corr}___{letter}___{view}___{uuid}.{ext}`.
 * Seeded / legacy rows often store processed paths like
 * `images/{corr}/{letter}/{view}/{uuid}_large_N.jpg`, which the older delete
 * handler rejected. Convert those to the unprocessed ___ form so delete works
 * against both old and new API deployments.
 */
export const toDeleteUploadFileKey = (fileKey: string): string => {
  const decoded = decodeURIComponent(fileKey);

  if (decoded.includes('___')) {
    return decoded;
  }

  const match = new RegExp(
    `^images\\/([^/]+)\\/([^/]+)\\/([^/]+)\\/(${UUID})(?:_large(?:_\\d+)?|_thumb)?(\\.[^.]+)$`,
    'i',
  ).exec(decoded);

  if (!match) {
    return decoded;
  }

  const [, correspondenceId, letterId, view, uuid, ext] = match;
  return `unprocessed/${correspondenceId}___${letterId}___${view}___${uuid}${ext}`;
};
