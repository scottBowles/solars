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
	import Clouds from './Clouds.svelte';

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

	let planet = new THREE.Object3D();

	const getPositionForAngle = (angle: number) =>
		calculateEllipticalOrbitPosition({
			angle,
			semiMajorAxis,
			eccentricity,
			inclination,
			sunPosition
		});

	let angle = Math.random() * Math.PI * 2;
	let position = getPositionForAngle(angle);

	const { start, stop } = useTask(
		(delta) => {
			const newAngle = reverse ? angle - orbitSpeed * delta : angle + orbitSpeed * delta;
			angle = newAngle;
			position = getPositionForAngle(newAngle);
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

<Planet4_cycles_uncompressed
	{scale}
	position={position.toArray()}
	on:click={handleClick}
	on:create={({ ref }) => {
		planet = ref;
	}}
/>
<Clouds position={position.toArray()} sphereGeometryArgs={[scale * 1.05, 32, 32]} />
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
