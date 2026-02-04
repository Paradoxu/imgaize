import { getAllConversions } from '$lib/formats';

const BASE_URL = 'https://imgaize.com';

export async function GET() {
	const conversions = getAllConversions();

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${BASE_URL}/</loc>
		<changefreq>weekly</changefreq>
		<priority>1.0</priority>
	</url>
${conversions
	.map(
		(c) => `	<url>
		<loc>${BASE_URL}/${c.slug}</loc>
		<changefreq>monthly</changefreq>
		<priority>0.8</priority>
	</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
}
