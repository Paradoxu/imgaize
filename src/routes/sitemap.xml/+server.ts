import { getAllConversions } from '$lib/formats';

const BASE_URL = 'https://imgaize.app';

// Get current date in ISO format for lastmod
const today = new Date().toISOString().split('T')[0];

export async function GET() {
	const conversions = getAllConversions();

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
	<!-- Homepage -->
	<url>
		<loc>${BASE_URL}/</loc>
		<lastmod>${today}</lastmod>
		<changefreq>weekly</changefreq>
		<priority>1.0</priority>
	</url>
	
	<!-- Conversion Pages -->
${conversions
	.map(
		(c) => `	<url>
		<loc>${BASE_URL}/${c.slug}</loc>
		<lastmod>${today}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.8</priority>
	</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600',
			'X-Robots-Tag': 'noindex'
		}
	});
}
