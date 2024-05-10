<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	export let color: number;
	export let sunPosition: THREE.Vector3;
	export let semiMajorAxis: number;
	export let eccentricity: number;
	export let inclination: number;
	export let getPositionForAngle: (arg: {
		sunPosition: THREE.Vector3;
		midpointBetweenTheSuns: THREE.Vector3;
		angle: number;
		semiMajorAxis: number;
		eccentricity: number;
		inclination: number;
		direction?: 'clockwise' | 'counterclockwise';
	}) => THREE.Vector3;
	export let midpointBetweenTheSuns: THREE.Vector3;

	function createOrbitLine(
		semiMajorAxis: number,
		eccentricity: number,
		inclination: number,
		sunPosition: THREE.Vector3,
		midpointBetweenTheSuns: THREE.Vector3
	): THREE.Vector3[] {
		const orbitPoints = [];
		for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
			const position = getPositionForAngle({
				angle,
				semiMajorAxis,
				eccentricity,
				inclination,
				sunPosition,
				midpointBetweenTheSuns
			});
			orbitPoints.push(position);
		}
		return orbitPoints;
	}

	$: orbitLine = createOrbitLine(
		semiMajorAxis,
		eccentricity,
		inclination,
		sunPosition,
		midpointBetweenTheSuns
	);
</script>

<T.Line
	geometry={new THREE.BufferGeometry().setFromPoints(orbitLine)}
	material={new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 })}
/>
