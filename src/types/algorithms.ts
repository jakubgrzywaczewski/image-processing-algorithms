export const Algorithm = {
  FLOYD_STEINBERG: 'floyd-steinberg',
  GRAYSCALE: 'grayscale',
  REVERSE: 'reverse',
  RESTORE: 'restore',
  DOWNLOAD: 'download',
} as const;

export type Algorithm = (typeof Algorithm)[keyof typeof Algorithm];
