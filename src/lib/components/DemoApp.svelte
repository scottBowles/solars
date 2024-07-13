<script lang="ts">
	import { Canvas } from '@threlte/core';
	import DemoScene from './DemoScene.svelte';
</script>

<Canvas dpr={Math.min(window.devicePixelRatio, 2)}>
	<DemoScene />
</Canvas>
