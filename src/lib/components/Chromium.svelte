<script lang="ts">
	import { getFigureEightPositionForAngle } from '$lib/utils';
	import { T, useTask } from '@threlte/core';
	import type { Writable } from 'svelte/store';
	import * as THREE from 'three';

	export let redSunPosition: THREE.Vector3;
	export let yellowSunPosition: THREE.Vector3;
	export let animateOrbits: Writable<boolean>;
	export let focusedPlanet: Writable<THREE.Object3D | null>;
	export let scale: number;
	export let color: number;
	export let orbitSpeed: number;
	export let semiMajorAxis: number;
	export let eccentricity: number;
	export let inclination: number;

	let planet = new THREE.Object3D();

	const midpointBetweenTheSuns = yellowSunPosition.clone().lerp(redSunPosition, 0.5);

	let angle = Math.PI * 2;
	let position = getFigureEightPositionForAngle({
		sunPosition: yellowSunPosition,
		midpointBetweenTheSuns,
		angle,
		semiMajorAxis,
		eccentricity,
		inclination,
		direction: 'counterclockwise'
	});

	let totalTime = 0;

	$: onePeriod = (2 * Math.PI) / orbitSpeed;

	const { start, stop } = useTask(
		(delta) => {
			totalTime += delta;
			const sun = totalTime % (onePeriod * 2) < onePeriod ? 'yellowSun' : 'redSun';
			const sunPosition = {
				yellowSun: yellowSunPosition,
				redSun: redSunPosition
			}[sun];
			let newAngle = {
				yellowSun: orbitSpeed * totalTime + Math.PI,
				redSun: -orbitSpeed * totalTime
			}[sun];
			angle = newAngle;
			position = getFigureEightPositionForAngle({
				sunPosition,
				midpointBetweenTheSuns,
				angle: -angle,
				semiMajorAxis,
				eccentricity,
				inclination,
				direction: sun === 'yellowSun' ? 'counterclockwise' : 'clockwise'
			});
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
