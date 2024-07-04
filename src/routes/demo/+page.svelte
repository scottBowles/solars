<script>
	import DemoApp from '$lib/components/DemoApp.svelte';
	import DemoScene from '$lib/components/DemoScene.svelte';
	import { Canvas } from '@threlte/core';
	$: console.log(window.devicePixelRatio);
</script>

<div>
	<DemoApp />
</div>

<style>
	:global(body) {
		margin: 0;
		overflow: hidden;
	}

	div {
		width: 100vw;
		height: 100vh;
		/* background: rgb(13, 19, 32);
		background: linear-gradient(180deg, rgba(13, 19, 32, 1) 0%, rgba(8, 12, 21, 1) 100%); */
		background: linear-gradient(180deg, rgba(6, 13, 21, 1) 0%, rgba(5, 8, 12, 1) 100%);
	}
</style>
