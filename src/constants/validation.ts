export const Regex: Record<string, RegExp> = {
  youtube:
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]+)/i,
  vimeo: /vimeo\.com(?:\/channels\/\w+)?\/(\d+)$/i,
};
