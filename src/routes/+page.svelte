<script lang="ts">
	import ImageConverter from '$lib/components/ImageConverter.svelte';
	import { getAllConversions, inputFormats, outputFormats } from '$lib/formats';

	// Get popular conversions for SEO internal linking
	const popularConversions = [
		'jpeg-to-png',
		'png-to-jpeg',
		'png-to-webp',
		'jpeg-to-webp',
		'webp-to-png',
		'webp-to-jpeg',
		'heic-to-jpeg',
		'heic-to-png',
		'gif-to-png',
		'bmp-to-png',
		'avif-to-png',
		'png-to-avif'
	];

	const featuredConversions = getAllConversions().filter((c) =>
		popularConversions.includes(c.slug)
	);

	// Structured data for homepage
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'Imgaize - Free Online Image Converter',
		description:
			'Convert images between PNG, JPEG, WebP, GIF, BMP, AVIF, TIFF, ICO, and HEIC formats instantly in your browser. Free, fast, and private.',
		applicationCategory: 'MultimediaApplication',
		operatingSystem: 'Any',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		featureList: [
			'Convert between 9+ image formats',
			'No file upload to server - works locally',
			'Fast browser-based processing',
			'Supports PNG, JPEG, WebP, GIF, BMP, AVIF, TIFF, ICO, HEIC',
			'Free and unlimited conversions'
		]
	};

	const organizationData = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'Imgaize',
		url: 'https://imgaize.com',
		logo: 'https://imgaize.com/favicon.svg'
	};
</script>

<svelte:head>
	<title>Imgaize - Free Online Image Converter | PNG, JPEG, WebP, AVIF & More</title>
	<meta
		name="description"
		content="Convert images between PNG, JPEG, WebP, GIF, BMP, AVIF, TIFF, ICO, and HEIC formats instantly. Free online tool that works in your browser - no upload needed, 100% private."
	/>
	<meta
		name="keywords"
		content="image converter, png to jpeg, jpeg to png, webp converter, avif converter, heic converter, online image converter, free image converter, convert image format"
	/>
	<link rel="canonical" href="https://imgaize.com/" />

	<!-- Open Graph -->
	<meta property="og:title" content="Imgaize - Free Online Image Converter" />
	<meta
		property="og:description"
		content="Convert images between PNG, JPEG, WebP, GIF, BMP, AVIF, and more formats instantly in your browser. Free, fast, and private."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://imgaize.com/" />
	<meta property="og:site_name" content="Imgaize" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Imgaize - Free Online Image Converter" />
	<meta
		name="twitter:description"
		content="Convert images between PNG, JPEG, WebP, GIF, BMP, AVIF, and more formats instantly. Free and private."
	/>

	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify(organizationData)}</script>`}
</svelte:head>

<div class="min-h-screen bg-midnight relative overflow-hidden">
	<!-- Background gradient effects -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
		<div
			class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan/20 to-violet/20 rounded-full blur-3xl"
		></div>
		<div
			class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-violet/15 to-electric/15 rounded-full blur-3xl"
		></div>
		<div
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan/5 to-violet/5 rounded-full blur-3xl"
		></div>
	</div>

	<div class="relative z-10 max-w-3xl mx-auto px-6 py-12">
		<!-- Header -->
		<header class="text-center mb-12">
			<h1
				class="font-display text-5xl font-bold bg-gradient-to-r from-cyan via-electric to-violet bg-clip-text text-transparent mb-3 tracking-tight"
			>
				Imgaize
			</h1>
			<p class="text-mist text-lg">Convert your images between formats instantly</p>
		</header>

		<!-- Main Card -->
		<main>
			<article
				class="bg-obsidian/80 backdrop-blur-xl border border-steel/50 rounded-2xl p-8 shadow-2xl shadow-midnight/50"
			>
				<ImageConverter updateUrl={true} />
			</article>

			<!-- Features Section -->
			<section class="mt-12 grid md:grid-cols-3 gap-6">
				<div class="text-center p-6 bg-obsidian/30 rounded-xl border border-steel/30">
					<div
						class="w-12 h-12 mx-auto mb-4 rounded-xl bg-cyan/10 flex items-center justify-center"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-6 h-6 text-cyan"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
					</div>
					<h3 class="text-cloud font-semibold mb-2">100% Private</h3>
					<p class="text-mist text-sm">
						Your images never leave your device. All processing happens locally in your browser.
					</p>
				</div>
				<div class="text-center p-6 bg-obsidian/30 rounded-xl border border-steel/30">
					<div
						class="w-12 h-12 mx-auto mb-4 rounded-xl bg-violet/10 flex items-center justify-center"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-6 h-6 text-violet"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					</div>
					<h3 class="text-cloud font-semibold mb-2">Lightning Fast</h3>
					<p class="text-mist text-sm">
						No upload needed. Convert images instantly using modern browser technology.
					</p>
				</div>
				<div class="text-center p-6 bg-obsidian/30 rounded-xl border border-steel/30">
					<div
						class="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald/10 flex items-center justify-center"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="w-6 h-6 text-emerald"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h3 class="text-cloud font-semibold mb-2">Always Free</h3>
					<p class="text-mist text-sm">
						No limits, no watermarks, no sign-up required. Unlimited conversions.
					</p>
				</div>
			</section>

			<!-- Supported Formats -->
			<section class="mt-12">
				<h2 class="text-cloud text-xl font-semibold mb-6 text-center">Supported Formats</h2>
				<div class="flex flex-wrap justify-center gap-3">
					{#each inputFormats as format}
						<div
							class="px-4 py-2 bg-slate/50 border border-steel/50 rounded-lg text-cloud text-sm"
							title={format.description}
						>
							{format.label}
						</div>
					{/each}
				</div>
			</section>

			<!-- Popular Conversions for SEO -->
			<section class="mt-12">
				<h2 class="text-cloud text-xl font-semibold mb-6 text-center">Popular Conversions</h2>
				<nav class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" aria-label="Popular image conversions">
					{#each featuredConversions as conversion}
						<a
							href="/{conversion.slug}"
							class="px-4 py-3 bg-obsidian/50 border border-steel/30 rounded-xl text-center hover:border-cyan/50 hover:bg-slate/30 transition-all group"
						>
							<span class="text-cloud group-hover:text-cyan transition-colors">
								{conversion.from.toUpperCase()} → {conversion.to.toUpperCase()}
							</span>
						</a>
					{/each}
				</nav>
			</section>
		</main>

		<!-- Footer -->
		<footer class="text-center mt-12 text-mist text-sm space-y-4">
			<p>All conversions happen locally in your browser. Your images never leave your device.</p>
			<p class="text-steel">
				© {new Date().getFullYear()} Imgaize. Free online image converter.
			</p>
		</footer>
	</div>
</div>
