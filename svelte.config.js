import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		
		// Prerender settings for better SEO
		prerender: {
			crawl: true,
			entries: ['*'],
			handleHttpError: 'warn',
			handleMissingId: 'warn'
		},
		
		// CSP and security headers
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', 'unsafe-inline'],
				'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
				'font-src': ['self', 'https://fonts.gstatic.com'],
				'img-src': ['self', 'data:', 'blob:'],
				'connect-src': ['self'],
				'frame-ancestors': ['none'],
				'base-uri': ['self'],
				'form-action': ['self']
			}
		},

		// Alias for cleaner imports
		alias: {
			$components: 'src/lib/components'
		}
	}
};

export default config;
