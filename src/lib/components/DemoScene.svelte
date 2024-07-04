<script lang="ts">
	import { T } from '@threlte/core';
	import { interactivity, OrbitControls, Stars } from '@threlte/extras';
	import { writable } from 'svelte/store';
	import * as THREE from 'three';

	import RedSun from '$lib/components/models/RedSun.svelte';
	import YellowSun from '$lib/components/models/YellowStar.svelte';
	import { redSunPosition, yellowSunPosition } from '$lib/constants';

	import { makeTweenedPosition } from '$lib/stores';
	import Planet4_cycles_uncompressed from './models/Planet4_cycles_uncompressed.svelte';

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

<T.AmbientLight intensity={0.7} />

<Stars />
<T.Group>
	<RedSun scale={0.06} position={redSunPosition.toArray()} />
	<T.PointLight intensity={7} color="#ff0000" position={redSunPosition.toArray()} />

	<YellowSun scale={0.004} position={yellowSunPosition.toArray()} />
	<T.PointLight intensity={7} color="#ffff00" position={yellowSunPosition.toArray()} />

	<Planet4_cycles_uncompressed scale={1} position={[0, 0, 0]} />
</T.Group>
