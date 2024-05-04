<script lang="ts">
	import { calculateEllipticalOrbitPosition } from '$lib/utils';
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	export let color: number;
	export let sunPosition: THREE.Vector3;
	export let semiMajorAxis: number;
	export let eccentricity: number;
	export let inclination: number;

	function createOrbitLine(
		semiMajorAxis: number,
		eccentricity: number,
		inclination: number,
		sunPosition: THREE.Vector3
	): THREE.Vector3[] {
		const orbitPoints = [];
		for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
			const position = calculateEllipticalOrbitPosition(
				angle,
				semiMajorAxis,
				eccentricity,
				inclination,
				sunPosition
			);
			orbitPoints.push(position);
		}
		return orbitPoints;
	}

	$: orbitLine = createOrbitLine(semiMajorAxis, eccentricity, inclination, sunPosition);
</script>

<T.Line
	geometry={new THREE.BufferGeometry().setFromPoints(orbitLine)}
	material={new THREE.LineBasicMaterial({ color })}
/>
