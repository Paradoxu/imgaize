export type ImageFormat = 'png' | 'jpeg' | 'webp' | 'gif' | 'bmp' | 'avif' | 'tiff' | 'ico' | 'heic';

export interface FormatInfo {
	value: ImageFormat;
	label: string;
	mime: string;
	extensions: string[];
	description: string;
	supportsTransparency: boolean;
	canEncode: boolean; // Browser can export to this format
}

export const formats: FormatInfo[] = [
	{
		value: 'png',
		label: 'PNG',
		mime: 'image/png',
		extensions: ['png'],
		description: 'Portable Network Graphics - Lossless compression with transparency',
		supportsTransparency: true,
		canEncode: true
	},
	{
		value: 'jpeg',
		label: 'JPEG',
		mime: 'image/jpeg',
		extensions: ['jpg', 'jpeg'],
		description: 'Joint Photographic Experts Group - Best for photographs',
		supportsTransparency: false,
		canEncode: true
	},
	{
		value: 'webp',
		label: 'WebP',
		mime: 'image/webp',
		extensions: ['webp'],
		description: 'Modern format with excellent compression and transparency',
		supportsTransparency: true,
		canEncode: true
	},
	{
		value: 'gif',
		label: 'GIF',
		mime: 'image/gif',
		extensions: ['gif'],
		description: 'Graphics Interchange Format - Supports animation',
		supportsTransparency: true,
		canEncode: false
	},
	{
		value: 'bmp',
		label: 'BMP',
		mime: 'image/bmp',
		extensions: ['bmp'],
		description: 'Bitmap Image - Uncompressed raster graphics',
		supportsTransparency: false,
		canEncode: true
	},
	{
		value: 'avif',
		label: 'AVIF',
		mime: 'image/avif',
		extensions: ['avif'],
		description: 'AV1 Image Format - Superior compression, modern browsers',
		supportsTransparency: true,
		canEncode: true
	},
	{
		value: 'tiff',
		label: 'TIFF',
		mime: 'image/tiff',
		extensions: ['tiff', 'tif'],
		description: 'Tagged Image File Format - Professional quality',
		supportsTransparency: true,
		canEncode: false
	},
	{
		value: 'ico',
		label: 'ICO',
		mime: 'image/x-icon',
		extensions: ['ico'],
		description: 'Icon format for Windows applications',
		supportsTransparency: true,
		canEncode: false
	},
	{
		value: 'heic',
		label: 'HEIC',
		mime: 'image/heic',
		extensions: ['heic', 'heif'],
		description: 'High Efficiency Image Format - Used by Apple devices',
		supportsTransparency: true,
		canEncode: false
	}
];

// Formats that can be used as output (browser can encode them)
export const outputFormats = formats.filter((f) => f.canEncode);

// All formats can be used as input (browser can decode them)
export const inputFormats = formats;

export function getFormatByValue(value: string): FormatInfo | undefined {
	return formats.find((f) => f.value === value);
}

export function getFormatByExtension(ext: string): FormatInfo | undefined {
	const normalizedExt = ext.toLowerCase().replace('.', '');
	return formats.find((f) => f.extensions.includes(normalizedExt));
}

export function parseConversionSlug(slug: string): { from: ImageFormat; to: ImageFormat } | null {
	const match = slug.match(/^([a-z]+)-to-([a-z]+)$/i);
	if (!match) return null;

	const [, fromStr, toStr] = match;
	const fromFormat = formats.find(
		(f) => f.value === fromStr.toLowerCase() || f.extensions.includes(fromStr.toLowerCase())
	);
	const toFormat = outputFormats.find(
		(f) => f.value === toStr.toLowerCase() || f.extensions.includes(toStr.toLowerCase())
	);

	if (!fromFormat || !toFormat) return null;

	return { from: fromFormat.value, to: toFormat.value };
}

export function generateConversionSlug(from: ImageFormat, to: ImageFormat): string {
	return `${from}-to-${to}`;
}

// Generate all valid conversion combinations for sitemap
export function getAllConversions(): Array<{ from: ImageFormat; to: ImageFormat; slug: string }> {
	const conversions: Array<{ from: ImageFormat; to: ImageFormat; slug: string }> = [];

	for (const input of inputFormats) {
		for (const output of outputFormats) {
			if (input.value !== output.value) {
				conversions.push({
					from: input.value,
					to: output.value,
					slug: generateConversionSlug(input.value, output.value)
				});
			}
		}
	}

	return conversions;
}
