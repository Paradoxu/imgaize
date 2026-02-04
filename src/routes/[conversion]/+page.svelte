<script lang="ts">
	import ImageConverter from '$lib/components/ImageConverter.svelte';
	import { getAllConversions, getFormatByValue, type ImageFormat, type FormatInfo } from '$lib/formats';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Reactive state for current formats (initialized from URL data)
	let currentFrom = $state<ImageFormat>(data.from);
	let currentTo = $state<ImageFormat>(data.to);

	// Handle format changes from ImageConverter
	function handleFormatChange(from: ImageFormat, to: ImageFormat) {
		currentFrom = from;
		currentTo = to;
	}

	// Derived format info - reactive to format changes
	let fromFormat = $derived(getFormatByValue(currentFrom) as FormatInfo);
	let toFormat = $derived(getFormatByValue(currentTo) as FormatInfo);

	// Get related conversions for internal linking (based on initial data for SEO)
	const relatedConversions = getAllConversions()
		.filter((c) => c.from === data.from || c.to === data.to)
		.filter((c) => c.slug !== `${data.from}-to-${data.to}`)
		.slice(0, 6);

	// Format categories for insights
	const lossyFormats = ['jpeg', 'webp', 'avif'];
	const losslessFormats = ['png', 'gif', 'bmp', 'tiff'];

	// Format-specific use cases
	const formatUseCases: Record<string, string[]> = {
		png: ['Web graphics with transparency', 'Screenshots', 'Logos and icons', 'Graphics with text'],
		jpeg: ['Photographs', 'Social media images', 'Email attachments', 'Print photos'],
		webp: ['Modern websites', 'Progressive web apps', 'Bandwidth optimization', 'Google services'],
		gif: ['Simple animations', 'Memes', 'Reaction images', 'Legacy web graphics'],
		bmp: ['Windows applications', 'Simple image editing', 'Uncompressed archives'],
		avif: ['Next-gen websites', 'High-quality photos with small size', 'HDR images'],
		tiff: ['Professional photography', 'Print publishing', 'Medical imaging', 'Archival storage'],
		ico: ['Website favicons', 'Windows application icons', 'Desktop shortcuts'],
		heic: ['iPhone photos', 'Apple ecosystem', 'Space-efficient photo storage']
	};

	// File size expectations
	const sizeComparisons: Record<string, Record<string, string>> = {
		png: {
			jpeg: 'Expect 50-80% smaller files, ideal for photos',
			webp: 'Expect 30-50% smaller files with transparency support',
			avif: 'Expect 50-70% smaller files with modern compression'
		},
		jpeg: {
			png: 'Files may be larger but with lossless quality',
			webp: 'Expect 25-35% smaller files with similar quality',
			avif: 'Expect 40-50% smaller files with better quality'
		},
		bmp: {
			png: 'Much smaller files with lossless compression',
			jpeg: 'Dramatically smaller files for photos',
			webp: 'Optimal compression for web delivery'
		},
		heic: {
			jpeg: 'Universal compatibility with similar file size',
			png: 'Lossless format for editing, larger files',
			webp: 'Modern web format with excellent compression'
		}
	};

	// Derived insights - reactive to format changes
	let conversionWarnings = $derived.by(() => {
		const warnings: string[] = [];
		if (!fromFormat || !toFormat) return warnings;
		
		// Transparency handling
		if (fromFormat.supportsTransparency && !toFormat.supportsTransparency) {
			warnings.push(`${fromFormat.label} supports transparency, but ${toFormat.label} does not. Transparent areas will be filled with a white background.`);
		}
		
		// Lossy to lossless warning
		if (lossyFormats.includes(currentFrom) && losslessFormats.includes(currentTo)) {
			warnings.push(`Converting from ${fromFormat.label} (lossy) to ${toFormat.label} (lossless) won't recover lost quality, but prevents further degradation.`);
		}
		
		return warnings;
	});

	let conversionInsights = $derived.by(() => {
		const insights: string[] = [];
		if (!fromFormat || !toFormat) return insights;
		
		// Transparency handling
		if (!fromFormat.supportsTransparency && toFormat.supportsTransparency) {
			insights.push(`Converting to ${toFormat.label} allows you to add transparency later if needed.`);
		}
		if (fromFormat.supportsTransparency && toFormat.supportsTransparency) {
			insights.push(`Both formats support transparency - your transparent areas will be preserved.`);
		}
		
		// Compression insights
		if (losslessFormats.includes(currentFrom) && lossyFormats.includes(currentTo)) {
			insights.push(`${toFormat.label} uses lossy compression, which reduces file size but may slightly reduce quality.`);
			if (currentTo === 'webp' || currentTo === 'avif') {
				insights.push(`${toFormat.label} typically achieves 25-35% smaller file sizes than ${fromFormat.label} with similar visual quality.`);
			}
		}
		
		// Browser compatibility notes
		if (currentTo === 'avif') {
			insights.push('AVIF has excellent compression but limited browser support in older browsers.');
		}
		if (currentTo === 'webp') {
			insights.push('WebP is supported by all modern browsers and offers great compression.');
		}
		if (currentFrom === 'heic') {
			insights.push('HEIC files from iPhones are efficiently converted for web use.');
		}
		
		// File size expectations
		const sizeNote = sizeComparisons[currentFrom]?.[currentTo];
		if (sizeNote) {
			insights.push(sizeNote);
		}
		
		return insights;
	});

	let useCases = $derived(formatUseCases[currentTo] || []);

	let isFromLossless = $derived(losslessFormats.includes(currentFrom));
	let isToLossless = $derived(losslessFormats.includes(currentTo));

	// Structured data for SEO (uses initial data for indexing)
	const structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: `${data.fromFormat.label} to ${data.toFormat.label} Converter`,
		description: data.description,
		applicationCategory: 'MultimediaApplication',
		operatingSystem: 'Any',
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		featureList: [
			'Free online conversion',
			'No file upload to server',
			'Works in browser',
			'Fast processing',
			'Supports multiple formats'
		]
	};
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
	<meta name="keywords" content="{data.fromFormat.label} to {data.toFormat.label}, convert {data.fromFormat.label}, {data.fromFormat.label} converter, image converter, free online converter" />
	<link rel="canonical" href="https://imgaize.app/{data.from}-to-{data.to}" />
	
	<!-- Open Graph -->
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={data.description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://imgaize.app/{data.from}-to-{data.to}" />
	
	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={data.title} />
	<meta name="twitter:description" content={data.description} />
	
	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
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
			<a href="/" class="inline-block">
				<h1
					class="font-display text-5xl font-bold bg-gradient-to-r from-cyan via-electric to-violet bg-clip-text text-transparent mb-3 tracking-tight leading-relaxed pb-1"
				>
					Imgaize
				</h1>
			</a>
			<h2 class="text-cloud text-xl font-medium mb-2">
				Convert {fromFormat?.label || 'Image'} to {toFormat?.label || 'Image'}
			</h2>
			<p class="text-mist">
				{fromFormat?.description || 'Select formats to see details'}
			</p>
		</header>

		<!-- Main Card -->
		<main>
			<article
				class="bg-obsidian/80 backdrop-blur-xl border border-steel/50 rounded-2xl p-8 shadow-2xl shadow-midnight/50"
			>
				<ImageConverter
					initialInputFormat={data.from as ImageFormat}
					initialOutputFormat={data.to as ImageFormat}
					updateUrl={true}
					onFormatChange={handleFormatChange}
				/>
			</article>

			<!-- Format Info Section -->
			{#if fromFormat && toFormat}
				<section class="mt-8 bg-obsidian/50 backdrop-blur border border-steel/30 rounded-2xl p-6 space-y-6">
					<h3 class="text-cloud font-semibold text-lg">About this conversion</h3>
					
					<!-- Conversion Warnings -->
					{#if conversionWarnings.length > 0}
						<div class="p-4 bg-amber/10 border border-amber/30 rounded-xl">
							<div class="flex items-start gap-3">
								<div class="w-6 h-6 rounded-full bg-amber/20 flex items-center justify-center shrink-0 mt-0.5">
									<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
									</svg>
								</div>
								<div class="space-y-1">
									<p class="text-amber font-medium text-sm">Things to know</p>
									{#each conversionWarnings as warning}
										<p class="text-mist text-sm">{warning}</p>
									{/each}
								</div>
							</div>
						</div>
					{/if}

					<!-- Conversion Insights -->
					{#if conversionInsights.length > 0}
						<div class="p-4 bg-electric/10 border border-electric/30 rounded-xl">
							<div class="flex items-start gap-3">
								<div class="w-6 h-6 rounded-full bg-electric/20 flex items-center justify-center shrink-0 mt-0.5">
									<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-electric" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
										<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<div>
									<p class="text-electric font-medium text-sm mb-2">Conversion insights</p>
									<ul class="space-y-1.5">
										{#each conversionInsights as insight}
											<li class="text-mist text-sm flex items-start gap-2">
												<span class="text-electric mt-1">•</span>
												<span>{insight}</span>
											</li>
										{/each}
									</ul>
								</div>
							</div>
						</div>
					{/if}

					<!-- Use Cases -->
					{#if useCases.length > 0}
						<div>
							<h4 class="text-cloud font-medium text-sm mb-3">Best uses for {toFormat.label}</h4>
							<div class="flex flex-wrap gap-2">
								{#each useCases as useCase}
									<span class="px-3 py-1.5 bg-slate/50 border border-steel/50 rounded-lg text-mist text-xs">
										{useCase}
									</span>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Format Comparison -->
					<div class="grid md:grid-cols-2 gap-4">
						<div class="p-4 bg-slate/30 rounded-xl border border-steel/30">
							<div class="flex items-center gap-2 mb-3">
								<div class="w-8 h-8 rounded-lg bg-cyan/20 flex items-center justify-center">
									<span class="text-cyan font-bold text-xs">{fromFormat.label.slice(0, 3)}</span>
								</div>
								<div>
									<h4 class="text-cyan font-medium text-sm">Source: {fromFormat.label}</h4>
									<p class="text-mist text-xs">{fromFormat.extensions.map(e => `.${e}`).join(', ')}</p>
								</div>
							</div>
							<p class="text-mist text-sm mb-3">{fromFormat.description}</p>
							<div class="flex flex-wrap gap-2">
								<span class="px-2 py-1 rounded text-xs {fromFormat.supportsTransparency ? 'bg-emerald/20 text-emerald' : 'bg-steel/50 text-mist'}">
									{fromFormat.supportsTransparency ? '✓ Transparency' : '✗ No transparency'}
								</span>
								<span class="px-2 py-1 rounded text-xs {isFromLossless ? 'bg-violet/20 text-violet' : 'bg-amber/20 text-amber'}">
									{isFromLossless ? 'Lossless' : 'Lossy'}
								</span>
							</div>
						</div>
						<div class="p-4 bg-slate/30 rounded-xl border border-steel/30">
							<div class="flex items-center gap-2 mb-3">
								<div class="w-8 h-8 rounded-lg bg-violet/20 flex items-center justify-center">
									<span class="text-violet font-bold text-xs">{toFormat.label.slice(0, 3)}</span>
								</div>
								<div>
									<h4 class="text-violet font-medium text-sm">Output: {toFormat.label}</h4>
									<p class="text-mist text-xs">{toFormat.extensions.map(e => `.${e}`).join(', ')}</p>
								</div>
							</div>
							<p class="text-mist text-sm mb-3">{toFormat.description}</p>
							<div class="flex flex-wrap gap-2">
								<span class="px-2 py-1 rounded text-xs {toFormat.supportsTransparency ? 'bg-emerald/20 text-emerald' : 'bg-steel/50 text-mist'}">
									{toFormat.supportsTransparency ? '✓ Transparency' : '✗ No transparency'}
								</span>
								<span class="px-2 py-1 rounded text-xs {isToLossless ? 'bg-violet/20 text-violet' : 'bg-amber/20 text-amber'}">
									{isToLossless ? 'Lossless' : 'Lossy'}
								</span>
							</div>
						</div>
					</div>
				</section>
			{/if}

			<!-- Related Conversions for SEO -->
			{#if relatedConversions.length > 0}
				<section class="mt-8">
					<h3 class="text-cloud font-semibold text-lg mb-4">Related conversions</h3>
					<nav class="flex flex-wrap gap-2" aria-label="Related image conversions">
						{#each relatedConversions as conversion}
							<a
								href="/{conversion.slug}"
								class="px-4 py-2 bg-slate/50 border border-steel/50 rounded-lg text-mist hover:text-cloud hover:border-cyan/50 hover:bg-slate transition-all text-sm"
							>
								{conversion.from.toUpperCase()} → {conversion.to.toUpperCase()}
							</a>
						{/each}
					</nav>
				</section>
			{/if}
		</main>

		<!-- Footer -->
		<footer class="text-center mt-8 text-mist text-sm">
			<p>All conversions happen locally in your browser. Your images never leave your device.</p>
		</footer>
	</div>
</div>
