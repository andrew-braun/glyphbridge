export const GENERATED_PUBLICATION_MANIFEST_FILE = "published-lessons-manifest.json";
const PUBLICATION_CACHE_KEY_PREFIX = "glyphbridge-publication";

export function getPublicationArtifactFileName(publicationId: string): string {
	return `published-lessons.${publicationId}.json`;
}

export function getPublicationCacheKey(publicationId: string): string {
	return `${PUBLICATION_CACHE_KEY_PREFIX}-${publicationId}`;
}
