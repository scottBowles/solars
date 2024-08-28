<script lang="ts">
	import { calculateEllipticalOrbitPosition } from '$lib/utils';
	import { T, useTask } from '@threlte/core';
	import type { Writable } from 'svelte/store';
	import * as THREE from 'three';
	import Atmosphere from './Atmosphere.svelte';
	import Clouds from './Clouds.svelte';
	import TestPlanet from './models/Janus2.svelte';

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

	// Create references to hold our objects
	let planetOrbit: THREE.Group; // The orbit of the planet — governs the position of the planet
	let planet: THREE.Group; // The planet itself — governs the rotation of the planet

	// Initialize vectors and matrix
	const up = new THREE.Vector3(0, 1, 0);
	const directionToSun = new THREE.Vector3();
	const right = new THREE.Vector3();
	const rotationMatrix = new THREE.Matrix4();

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

	// Update function
	const updatePlanetPosition = (delta: number) => {
		// Update orbit
		const angleChange = orbitSpeed * delta;
		const newAngle = reverse ? angle - angleChange : angle + angleChange;
		angle = newAngle;

		// Calculate direction to sun
		directionToSun
			.subVectors(
				new THREE.Vector3(sunPosition.x, sunPosition.y, sunPosition.z),
				planetOrbit.position
			)
			.normalize();

		// Calculate right vector
		right.crossVectors(up, directionToSun).normalize();

		// Recalculate up vector
		up.crossVectors(directionToSun, right).normalize();

		// Create rotation matrix
		rotationMatrix.makeBasis(right, up, directionToSun);

		// Apply rotation to planet
		planet.setRotationFromMatrix(rotationMatrix);
	};

	// Update function
	const { start, stop } = useTask(updatePlanetPosition, { autoStart: false });

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
