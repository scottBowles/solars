<script lang="ts">
	import { calculateEllipticalOrbitPosition } from '$lib/utils';
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

	const getPositionForAngle = (angle: number, sunPosition: THREE.Vector3) =>
		calculateEllipticalOrbitPosition(angle, semiMajorAxis, eccentricity, inclination, sunPosition);

	let angle = Math.PI * 2;
	let position = getPositionForAngle(angle, yellowSunPosition);

	let totalTime = 0;

	const onePeriod = (2 * Math.PI) / orbitSpeed;

	const { start, stop } = useTask(
		(delta) => {
			totalTime += delta;
			let newAngle = angle + orbitSpeed * delta;
			angle = newAngle;
			// get sun position for a figure eight between the two suns
			const sun = totalTime % (onePeriod * 2) < onePeriod ? 'yellowSun' : 'redSun';
			const sunPosition = {
				yellowSun: yellowSunPosition,
				redSun: redSunPosition
			}[sun];
			newAngle = {
				yellowSun: newAngle + Math.PI,
				redSun: -newAngle
			}[sun];
			position = getPositionForAngle(-newAngle, sunPosition);
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
