import { getFormatByValue, parseConversionSlug } from '$lib/formats';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const parsed = parseConversionSlug(params.conversion);

	if (!parsed) {
		throw error(404, {
			message: 'Invalid conversion format. Please use a format like "jpeg-to-png".'
		});
	}

	const fromFormat = getFormatByValue(parsed.from);
	const toFormat = getFormatByValue(parsed.to);

	if (!fromFormat || !toFormat) {
		throw error(404, {
			message: 'Unsupported image format.'
		});
	}

	return {
		from: parsed.from,
		to: parsed.to,
		fromFormat,
		toFormat,
		title: `Convert ${fromFormat.label} to ${toFormat.label} - Free Online Converter | Imgaize`,
		description: `Convert ${fromFormat.label} images to ${toFormat.label} format online for free. ${fromFormat.description}. Fast, secure, and works entirely in your browser.`
	};
};
