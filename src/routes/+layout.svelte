<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="robots" content="index, follow" />
	<meta name="author" content="Imgaize" />
	<meta name="theme-color" content="#0d1117" />
	<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
</svelte:head>

{@render children()}
