<script lang="ts">
	import {
		type ImageFormat,
		formats,
		inputFormats,
		outputFormats,
		getFormatByExtension,
		getFormatByValue,
		generateConversionSlug
	} from '$lib/formats';

	interface Props {
		initialInputFormat?: ImageFormat;
		initialOutputFormat?: ImageFormat;
		updateUrl?: boolean;
		onFormatChange?: (from: ImageFormat, to: ImageFormat) => void;
	}

	let { 
		initialInputFormat = 'png', 
		initialOutputFormat = 'webp', 
		updateUrl = true,
		onFormatChange
	}: Props = $props();

	let inputFormat = $state<ImageFormat>(initialInputFormat);
	let outputFormat = $state<ImageFormat>(initialOutputFormat);
	
	// Notify parent when formats change
	function notifyFormatChange() {
		onFormatChange?.(inputFormat, outputFormat);
	}
	let selectedFile = $state<File | null>(null);
	let previewUrl = $state<string | null>(null);
	let convertedUrl = $state<string | null>(null);
	let isDragging = $state(false);
	let isConverting = $state(false);
	let errorMessage = $state<string | null>(null);

	// Update URL without triggering navigation (preserves component state)
	function updateUrlPath(from: ImageFormat, to: ImageFormat) {
		if (updateUrl && typeof window !== 'undefined') {
			const newSlug = generateConversionSlug(from, to);
			const newUrl = `/${newSlug}`;
			const currentPath = window.location.pathname;
			if (currentPath !== newUrl) {
				history.replaceState(history.state, '', newUrl);
			}
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			handleFile(files[0]);
		}
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const files = target.files;
		if (files && files.length > 0) {
			handleFile(files[0]);
		}
	}

	function handleFile(file: File) {
		errorMessage = null;
		convertedUrl = null;

		if (!file.type.startsWith('image/')) {
			errorMessage = 'Please select a valid image file.';
			return;
		}

		// Validate that file matches the selected input format
		const ext = file.name.split('.').pop()?.toLowerCase() || '';
		const detectedFormat = getFormatByExtension(ext);
		
		if (!detectedFormat || detectedFormat.value !== inputFormat) {
			const expectedFormat = getFormatByValue(inputFormat);
			const expectedExts = expectedFormat?.extensions.map(e => `.${e}`).join(', ') || inputFormat;
			errorMessage = `Please select a ${expectedFormat?.label || inputFormat.toUpperCase()} file (${expectedExts}). The selected file appears to be ${detectedFormat?.label || 'an unknown format'}.`;
			return;
		}

		selectedFile = file;

		// Create preview
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		previewUrl = URL.createObjectURL(file);
	}

	async function convertImage() {
		if (!selectedFile || !previewUrl) return;

		isConverting = true;
		errorMessage = null;

		try {
			const img = new Image();
			img.src = previewUrl;

			await new Promise((resolve, reject) => {
				img.onload = resolve;
				img.onerror = reject;
			});

			const canvas = document.createElement('canvas');
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;

			const ctx = canvas.getContext('2d');
			if (!ctx) {
				throw new Error('Failed to get canvas context');
			}

			// Get output format info
			const outputFormatInfo = formats.find((f) => f.value === outputFormat);

			// For formats without transparency, fill with white background
			if (outputFormatInfo && !outputFormatInfo.supportsTransparency) {
				ctx.fillStyle = '#FFFFFF';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			}

			ctx.drawImage(img, 0, 0);

			const outputMime = outputFormatInfo?.mime || 'image/png';
			const quality = outputFormat === 'jpeg' || outputFormat === 'webp' || outputFormat === 'avif' ? 0.92 : undefined;

			const blob = await new Promise<Blob>((resolve, reject) => {
				canvas.toBlob(
					(b) => {
						if (b) resolve(b);
						else reject(new Error('Failed to convert image. This format may not be supported by your browser.'));
					},
					outputMime,
					quality
				);
			});

			if (convertedUrl) {
				URL.revokeObjectURL(convertedUrl);
			}
			convertedUrl = URL.createObjectURL(blob);
		} catch (err) {
			errorMessage = err instanceof Error ? err.message : 'Failed to convert image. Please try again.';
			console.error(err);
		} finally {
			isConverting = false;
		}
	}

	function downloadImage() {
		if (!convertedUrl || !selectedFile) return;

		const link = document.createElement('a');
		link.href = convertedUrl;
		const baseName = selectedFile.name.replace(/\.[^/.]+$/, '');
		const outputExt = formats.find((f) => f.value === outputFormat)?.extensions[0] || outputFormat;
		link.download = `${baseName}.${outputExt}`;
		link.click();
	}

	function reset() {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		if (convertedUrl) URL.revokeObjectURL(convertedUrl);
		selectedFile = null;
		previewUrl = null;
		convertedUrl = null;
		errorMessage = null;
	}

	function onInputFormatChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const newFormat = target.value as ImageFormat;
		
		// Check if current file is compatible with the new input format
		if (selectedFile) {
			const ext = selectedFile.name.split('.').pop()?.toLowerCase() || '';
			const fileFormat = getFormatByExtension(ext);
			
			// If the file's format doesn't match the new input format, reset
			if (!fileFormat || fileFormat.value !== newFormat) {
				reset();
			} else if (convertedUrl) {
				// Just clear converted result if format is compatible (needs re-conversion)
				URL.revokeObjectURL(convertedUrl);
				convertedUrl = null;
			}
		}
		
		inputFormat = newFormat;
		updateUrlPath(inputFormat, outputFormat);
		notifyFormatChange();
	}

	function onOutputFormatChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		outputFormat = target.value as ImageFormat;
		// Clear converted result when format changes (needs re-conversion)
		if (convertedUrl) {
			URL.revokeObjectURL(convertedUrl);
			convertedUrl = null;
		}
		notifyFormatChange();
		updateUrlPath(inputFormat, outputFormat);
	}

	// Get the current input format info for file filtering
	let currentInputFormat = $derived(getFormatByValue(inputFormat));
	
	// Generate accept string for file input based on selected format
	let acceptedFileTypes = $derived(() => {
		if (!currentInputFormat) return 'image/*';
		// Include both MIME type and extensions for better compatibility
		const extensions = currentInputFormat.extensions.map(ext => `.${ext}`).join(',');
		return `${currentInputFormat.mime},${extensions}`;
	});

	// Get supported formats list for display
	const supportedFormatsText = inputFormats.map((f) => f.label).join(', ');
</script>

<!-- Format Selectors -->
<div class="flex items-center justify-center gap-4 mb-8">
	<div class="flex-1">
		<label for="input-format" class="block text-sm font-medium text-mist mb-2">
			From
		</label>
		<select
			id="input-format"
			value={inputFormat}
			onchange={onInputFormatChange}
			class="w-full bg-slate border border-steel rounded-xl px-4 py-3 text-cloud focus:outline-none focus:ring-2 focus:ring-cyan/50 focus:border-cyan transition-all cursor-pointer appearance-none"
			style="background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%238b949e%22 stroke-width=%222%22%3E%3Cpath d=%22M6 9l6 6 6-6%22/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 12px center; background-size: 20px;"
		>
			{#each inputFormats as format}
				<option value={format.value}>{format.label}</option>
			{/each}
		</select>
	</div>

	<div class="flex items-end pb-1">
		<div
			class="w-12 h-12 rounded-full bg-gradient-to-r from-cyan to-violet flex items-center justify-center shadow-lg shadow-cyan/20"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-6 h-6 text-midnight"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
			</svg>
		</div>
	</div>

	<div class="flex-1">
		<label for="output-format" class="block text-sm font-medium text-mist mb-2">
			To
		</label>
		<select
			id="output-format"
			value={outputFormat}
			onchange={onOutputFormatChange}
			class="w-full bg-slate border border-steel rounded-xl px-4 py-3 text-cloud focus:outline-none focus:ring-2 focus:ring-violet/50 focus:border-violet transition-all cursor-pointer appearance-none"
			style="background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%238b949e%22 stroke-width=%222%22%3E%3Cpath d=%22M6 9l6 6 6-6%22/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 12px center; background-size: 20px;"
		>
			{#each outputFormats as format}
				<option value={format.value}>{format.label}</option>
			{/each}
		</select>
	</div>
</div>

<!-- Drop Zone -->
<div
	role="button"
	tabindex="0"
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	onclick={() => document.getElementById('file-input')?.click()}
	onkeydown={(e) => e.key === 'Enter' && document.getElementById('file-input')?.click()}
	class="relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group {isDragging
		? 'border-cyan bg-cyan/10 scale-[1.02]'
		: 'border-steel hover:border-mist hover:bg-slate/30'}"
>
	<input
		id="file-input"
		type="file"
		accept={acceptedFileTypes()}
		onchange={handleFileSelect}
		class="hidden"
	/>

	{#if previewUrl}
		<div class="space-y-4">
			<div class="relative inline-block">
				<img
					src={previewUrl}
					alt="Preview of selected image"
					class="max-h-48 max-w-full rounded-xl shadow-lg mx-auto"
				/>
				<button
					onclick={(e) => {
						e.stopPropagation();
						reset();
					}}
					class="absolute -top-2 -right-2 w-8 h-8 bg-coral rounded-full flex items-center justify-center text-white shadow-lg hover:bg-coral/80 transition-colors"
					aria-label="Remove image"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-4 h-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
			<p class="text-mist text-sm">
				{selectedFile?.name}
				<span class="text-steel">•</span>
				{((selectedFile?.size || 0) / 1024).toFixed(1)} KB
			</p>
		</div>
	{:else}
		<div class="space-y-4">
			<div
				class="w-20 h-20 mx-auto rounded-2xl bg-slate flex items-center justify-center group-hover:bg-steel/50 transition-colors"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-10 h-10 text-mist"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="1.5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			</div>
			<div>
				<p class="text-cloud font-medium mb-1">
					Drop your <span class="text-cyan">{currentInputFormat?.label || 'image'}</span> file here or browse
				</p>
				<p class="text-mist text-sm">
					{#if currentInputFormat}
						Accepts {currentInputFormat.extensions.map(e => `.${e}`).join(', ')} files
					{:else}
						Supports {supportedFormatsText}
					{/if}
				</p>
			</div>
		</div>
	{/if}
</div>

<!-- Error Message -->
{#if errorMessage}
	<div class="mt-4 p-4 bg-coral/10 border border-coral/30 rounded-xl text-coral text-sm">
		{errorMessage}
	</div>
{/if}

<!-- Convert Button -->
<button
	onclick={convertImage}
	disabled={!selectedFile || isConverting}
	class="w-full mt-6 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 {selectedFile && !isConverting
		? 'bg-gradient-to-r from-cyan to-violet text-midnight hover:shadow-lg hover:shadow-cyan/30 hover:scale-[1.02] active:scale-[0.98]'
		: 'bg-slate text-mist cursor-not-allowed'}"
>
	{#if isConverting}
		<span class="flex items-center justify-center gap-2">
			<svg class="animate-spin w-5 h-5" viewBox="0 0 24 24">
				<circle
					class="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					stroke-width="4"
					fill="none"
				/>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
			Converting...
		</span>
	{:else}
		Convert to {formats.find((f) => f.value === outputFormat)?.label}
	{/if}
</button>

<!-- Download Section -->
{#if convertedUrl}
	<div class="mt-6 p-6 bg-emerald/10 border border-emerald/30 rounded-xl">
		<div class="flex items-center justify-between flex-wrap gap-4">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-full bg-emerald/20 flex items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-5 h-5 text-emerald"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<div>
					<p class="text-cloud font-medium">Conversion complete!</p>
					<p class="text-mist text-sm">Your image is ready to download</p>
				</div>
			</div>
			<button
				onclick={downloadImage}
				class="flex items-center gap-2 px-5 py-2.5 bg-emerald text-midnight font-semibold rounded-xl hover:bg-emerald/90 transition-colors"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
					/>
				</svg>
				Download
			</button>
		</div>
	</div>
{/if}
