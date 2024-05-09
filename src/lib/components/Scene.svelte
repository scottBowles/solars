<script lang="ts">
	import * as THREE from 'three';
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { Stars } from '@threlte/extras';
	import { interactivity } from '@threlte/extras';
	import { writable } from 'svelte/store';

	import RedSun from '$lib/components/models/RedSun.svelte';
	import YellowSun from '$lib/components/models/YellowStar.svelte';
	import Planet from '$lib/components/Planet.svelte';
	import { yellowSunPosition, redSunPosition, PLANETS } from '$lib/constants';

	import OrbitLine from './OrbitLine.svelte';
	import { makeTweenedPosition } from '$lib/stores';
	import Chromium from './Chromium.svelte';

	export let yellowDirection: 'clockwise' | 'counterclockwise';
	export let redDirection: 'clockwise' | 'counterclockwise';
	export let scaleFactor: number;
	export let speedFactor: number;

	interactivity();

	const animateOrbits = writable(true);

	const cameraPosition = makeTweenedPosition([0, 10, 10]);
	let cameraTarget = [0, 0, 0] as [number, number, number];

	let focusedPlanet = writable<THREE.Object3D | null>(null);

	const updateFocusedPlanet = (planet: THREE.Object3D | null) => {
		if (planet) {
			$animateOrbits = false;
			const position = planet.position.toArray();
			cameraTarget = position;
			$cameraPosition = [position[0], position[1], position[2] + 0.4];
		} else {
			$cameraPosition = [0, 10, 10];
			$animateOrbits = true;
			cameraTarget = [0, 0, 0];
		}
	};

	$: updateFocusedPlanet($focusedPlanet);
</script>

<svelte:body
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			$focusedPlanet = null;
		}
	}}
/>

<T.PerspectiveCamera makeDefault position={$cameraPosition}>
	<OrbitControls enableZoom={true} enableDamping target={cameraTarget} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.07} />

<Stars />
<T.Group>
	<RedSun scale={0.06} position={redSunPosition.toArray()} />
	<T.PointLight intensity={7} color="#ff0000" position={redSunPosition.toArray()} />

	<YellowSun scale={0.004} position={yellowSunPosition.toArray()} />
	<T.PointLight intensity={7} color="#ffff00" position={yellowSunPosition.toArray()} />

	{#each PLANETS as { scale, color, orbitSpeed, sunPosition, semiMajorAxis, eccentricity, inclination }}
		<Planet
			scale={scale * scaleFactor}
			{color}
			orbitSpeed={orbitSpeed * speedFactor}
			{sunPosition}
			{semiMajorAxis}
			{eccentricity}
			{inclination}
			{animateOrbits}
			{focusedPlanet}
			reverse={(sunPosition === yellowSunPosition && yellowDirection === 'counterclockwise') ||
				(sunPosition === redSunPosition && redDirection === 'counterclockwise')}
		/>
		<OrbitLine {color} {sunPosition} {semiMajorAxis} {eccentricity} {inclination} />
	{/each}
	<Chromium
		scale={0.1 * scaleFactor}
		color={0xff0000}
		orbitSpeed={0.07 * speedFactor}
		semiMajorAxis={5}
		eccentricity={0}
		inclination={0}
		{redSunPosition}
		{yellowSunPosition}
		{animateOrbits}
		{focusedPlanet}
	/>
	<OrbitLine
		color={0xff0000}
		sunPosition={redSunPosition}
		semiMajorAxis={5}
		eccentricity={0}
		inclination={0}
	/>
	<OrbitLine
		color={0xff0000}
		sunPosition={yellowSunPosition}
		semiMajorAxis={5}
		eccentricity={0}
		inclination={0}
	/>
</T.Group>
