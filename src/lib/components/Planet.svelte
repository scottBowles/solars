<script lang="ts">
	import { calculateEllipticalOrbitPosition } from '$lib/utils';
	import { T, useTask } from '@threlte/core';
	import type { Writable } from 'svelte/store';
	import * as THREE from 'three';

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
