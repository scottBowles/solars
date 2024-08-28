<script lang="ts">
	import { calculateEllipticalOrbitPosition } from '$lib/utils';
	import { T, useTask } from '@threlte/core';
	import type { Writable } from 'svelte/store';
	import * as THREE from 'three';
	import GreenPlanet1k from './models/GreenPlanet1k.svelte';
	import LavaPlanet1k from './models/LavaPlanet1k.svelte';
	import PurplePlanet1k from './models/PurplePlanet1k.svelte';
	import BlenderPlanet from './models/BlenderPlanet.svelte';
	import BlenderPlanetUncompressed from './models/BlenderPlanetUncompressed.svelte';
	import Planet3_eevee from './models/Planet3_eevee.svelte';
	import Planet3_uncompressed from './models/Planet3_uncompressed.svelte';
	import Planet3_eevee_uncompressed from './models/Planet3_eevee_uncompressed.svelte';
	import Planet4_cycles_uncompressed from './models/Planet4_cycles_uncompressed.svelte';
	import TestPlanet from './models/Janus2.svelte';
	import Clouds from './Clouds.svelte';
	import Atmosphere from './Atmosphere.svelte';

	export let scale: number;
	export let color: number;
	export let orbitSpeed: number;
	export let semiMajorAxis: number;
	export let eccentricity: number;
	export let inclination: number;
	export let sunPosition: THREE.Vector3;
	export let animateOrbits: Writable<boolean>;
	export let focusedPlanet: Writable<THREE.Object3D | null>;
	export let reverse: boolean = false;
	export let planetC: string = '';

	let planetOrbit: THREE.Group; // The orbit of the planet — governs the position of the planet
	let planet: THREE.Group; // The planet itself — governs the rotation of the planet

	const getPositionForAngle = (angle: number) => {
		const vector3 = calculateEllipticalOrbitPosition({
			angle,
			semiMajorAxis,
			eccentricity,
			inclination,
			sunPosition
		});
		return [vector3.x, vector3.y, vector3.z] as [number, number, number];
	};

	let angle = Math.random() * Math.PI * 2;
	$: position = getPositionForAngle(angle);

	const { start, stop } = useTask(
		(delta) => {
			const newAngle = reverse ? angle - orbitSpeed * delta : angle + orbitSpeed * delta;
			angle = newAngle;
		},
		{ autoStart: false }
	);

	$: {
		if ($animateOrbits) {
			start();
		}
		if (!$animateOrbits) {
			stop();
		}
	}

	const handleClick = () => {
		stop();
		$animateOrbits = false;
		$focusedPlanet = planet;
	};
</script>

<T.Group bind:ref={planetOrbit} {position}>
	<T.Group bind:ref={planet}>
		<TestPlanet {scale} on:click={handleClick} renderOrder={0} />
		<Clouds planetRadius={scale} />
		<Atmosphere planetRadius={scale} renderOrder={1} />
	</T.Group>
</T.Group>

<!-- {#if planetC}
	{#if planetC === 'felucia'}
		<GreenPlanet1k
			{scale}
			position={position.toArray()}
			on:click={handleClick}
			on:create={({ ref }) => {
				planet = ref;
			}}
		/>
	{:else if planetC === 'magmus'}
		<LavaPlanet1k
			{scale}
			position={position.toArray()}
			on:click={handleClick}
			on:create={({ ref }) => {
				planet = ref;
			}}
		/>
	{:else if planetC === 'purple'}
		<PurplePlanet1k
			{scale}
			position={position.toArray()}
			on:click={handleClick}
			on:create={({ ref }) => {
				planet = ref;
			}}
		/>
	{/if}
{:else}
	<T.Mesh
		{scale}
		position={position.toArray()}
		on:click={handleClick}
		on:create={({ ref }) => {
			planet = ref;
		}}
	>
		<T.SphereGeometry />
		<T.MeshStandardMaterial {color} />
	</T.Mesh>
{/if} -->
