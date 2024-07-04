<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import DemoScene from './DemoScene.svelte';

	let yellowDirection: 'clockwise' | 'counterclockwise' = 'clockwise';
	let redDirection: 'clockwise' | 'counterclockwise' = 'clockwise';
	let scaleFactor = 1;
	let speedFactor = 1;
</script>

<input
	type="radio"
	name="yellowDirection"
	id="yellowClockwise"
	bind:group={yellowDirection}
	value="clockwise"
/>
<label for="yellowClockwise" style="color: white;">Yellow Clockwise</label>
<input
	type="radio"
	name="yellowDirection"
	id="yellowCounterclockwise"
	bind:group={yellowDirection}
	value="counterclockwise"
/>
<label for="yellowCounterclockwise" style="color: white;">Yellow Counterclockwise</label>

<br />

<input
	type="radio"
	name="redDirection"
	id="redClockwise"
	bind:group={redDirection}
	value="clockwise"
/>
<label for="redClockwise" style="color: white;">Red Clockwise</label>
<input
	type="radio"
	name="redDirection"
	id="redCounterclockwise"
	bind:group={redDirection}
	value="counterclockwise"
/>
<label for="redCounterclockwise" style="color: white;">Red Counterclockwise</label>

<br />

<label for="scale" style="color: white;">Planet Scale</label>
<input id="scale" type="range" min=".5" max="3" step="0.01" bind:value={scaleFactor} />

<br />

<label for="speed" style="color: white;">Planet Speed</label>
<input id="speed" type="range" min=".5" max="5" step="0.01" bind:value={speedFactor} />

<Canvas dpr={Math.min(window.devicePixelRatio, 2)}>
	<DemoScene />
</Canvas>
