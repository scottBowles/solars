<script lang="ts">
	import DemoApp from '$lib/components/DemoApp.svelte';
	import { setCloudValues } from '$lib/stores';
	import { Pane, Point, Slider } from 'svelte-tweakpane-ui';

	const cloudValues = setCloudValues();
</script>

<div>
	<Pane position="draggable">
		<Point bind:value={$cloudValues.uColorStart} label="uColorStart" min={0} max={1} />
		<Point bind:value={$cloudValues.uColorEnd} label="uColorStart" min={0} max={1} />
		<Slider bind:value={$cloudValues.uScale} label="uScale" min={0} max={2} step={0.01} />
		<Slider bind:value={$cloudValues.uDetail} label="uDetail" min={0} max={10} step={0.1} />
		<Slider bind:value={$cloudValues.uRoughness} label="uRoughness" min={0} max={1} step={0.01} />
		<Slider bind:value={$cloudValues.uLacunarity} label="uLacunarity" min={0} max={5} step={0.1} />
		<Slider bind:value={$cloudValues.uDistortion} label="uDistortion" min={0} max={1} step={0.01} />
		<Slider
			bind:value={$cloudValues.uCloudCoverage}
			label="uCloudCoverage"
			min={0}
			max={1}
			step={0.01}
		/>
		<Slider
			bind:value={$cloudValues.uCloudDensity}
			label="uCloudDensity"
			min={0}
			max={1}
			step={0.01}
		/>
	</Pane>
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
