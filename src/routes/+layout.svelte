<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const siteUrl = 'https://imgaize.app';
	const siteName = 'Imgaize';
</script>

<svelte:head>
	<!-- Favicon -->
	<link rel="icon" href={favicon} type="image/svg+xml" />
	<link rel="icon" href="/favicon.ico" sizes="32x32" />
	<link rel="apple-touch-icon" href="/icon-192.png" />
	
	<!-- SEO Robots -->
	<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<meta name="bingbot" content="index, follow" />
	
	<!-- Site Identity -->
	<meta name="author" content={siteName} />
	<meta name="publisher" content={siteName} />
	<meta name="creator" content={siteName} />
	<meta name="generator" content="SvelteKit" />
	
	<!-- Theme & Colors -->
	<meta name="theme-color" content="#0d1117" media="(prefers-color-scheme: dark)" />
	<meta name="theme-color" content="#0d1117" media="(prefers-color-scheme: light)" />
	<meta name="color-scheme" content="dark" />
	
	<!-- Sitemap -->
	<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
	
	<!-- Default Open Graph (can be overridden by pages) -->
	<meta property="og:site_name" content={siteName} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="{siteUrl}/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="Imgaize - Free Online Image Converter" />
	
	<!-- Default Twitter Card (can be overridden by pages) -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@imgaize" />
	<meta name="twitter:image" content="{siteUrl}/og-image.png" />
	
	<!-- Additional SEO -->
	<meta name="application-name" content={siteName} />
	<meta name="referrer" content="origin-when-cross-origin" />
	
	<!-- Alternate Language (if you plan to add more languages) -->
	<link rel="alternate" hreflang="en" href={siteUrl} />
	<link rel="alternate" hreflang="x-default" href={siteUrl} />
</svelte:head>

{@render children()}
