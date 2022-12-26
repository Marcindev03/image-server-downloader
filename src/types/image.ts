export type Image = {
  id: string;
  sourceUrl: string;
  downloadUrl: string;
  createdAt: string;
  downloadedAt: string | null;
  isDownloaded: boolean;
};

export type ImageInput = {
  sourceUrl?: string;
  downloadUrl?: string;
  createdAt?: string;
  downloadedAt?: string | null;
  isDownloaded?: boolean;
}
