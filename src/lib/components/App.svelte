<script lang="ts">
	import { browser } from '$app/environment';
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
</script>

{#if browser}
	<Canvas dpr={Math.min(window?.devicePixelRatio ?? 1, 2)}>
		<Scene />
	</Canvas>
{/if}
