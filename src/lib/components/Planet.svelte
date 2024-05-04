<script lang="ts">
	import { calculateEllipticalOrbitPosition } from '$lib/utils';
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';

	export let scale: number;
	export let color: number;
	export let orbitSpeed: number;
	export let semiMajorAxis: number;
	export let eccentricity: number;
	export let inclination: number;
	export let sunPosition: THREE.Vector3;

	const getPositionForAngle = (angle: number) => {
		const positionForAngle = calculateEllipticalOrbitPosition(
			angle,
			semiMajorAxis,
			eccentricity,
			inclination,
			sunPosition
		);
		return positionForAngle;
	};

	let angle = Math.random() * Math.PI * 2;
	let position = getPositionForAngle(angle);

	useTask((delta) => {
		const newAngle = angle + orbitSpeed * delta;
		angle = newAngle;
		position = getPositionForAngle(newAngle);
	});
</script>

<T.Mesh {scale} position={position.toArray()}>
	<T.SphereGeometry />
	<T.MeshStandardMaterial {color} />
</T.Mesh>
