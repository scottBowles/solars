<script lang="ts">
	import {
		calculateEllipticalOrbitPosition,
		isAWithinBRadiansofC,
		radianDifference
	} from '$lib/utils';
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
	const radius = semiMajorAxis;
	// the angle at which the path transitions between the circular orbit and a linear path to the other sun
	const orbitTransitionAngle = Math.acos(
		radius / (yellowSunPosition.distanceTo(redSunPosition) / 2)
	);
	const normalizeAngle = (angle: number) => Math.abs((angle % (2 * Math.PI)) * Math.sign(angle));

	const getPositionForAngle = (
		angle: number,
		sunPosition: THREE.Vector3,
		direction: 'clockwise' | 'counterclockwise'
	) => {
		const angleFromSunToMidpoint = Math.atan2(
			midpointBetweenTheSuns.z - sunPosition.z,
			midpointBetweenTheSuns.x - sunPosition.x
		);
		const normalizedAngle = normalizeAngle(angle);
		const angleIsWithinTransitionAngleFromAngleFromSunToMidpoint = isAWithinBRadiansofC(
			normalizedAngle,
			orbitTransitionAngle,
			angleFromSunToMidpoint
		);

		if (angleIsWithinTransitionAngleFromAngleFromSunToMidpoint) {
			const isMovingTowardMidpoint =
				normalizedAngle < angleFromSunToMidpoint ||
				normalizedAngle - angleFromSunToMidpoint > Math.PI;
			const directionAdj = direction === 'clockwise' ? 1 : -1;
			if (isMovingTowardMidpoint) {
				const portionOfTheWayTowardTheMidpoint =
					radianDifference(normalizedAngle, angleFromSunToMidpoint) / orbitTransitionAngle;
				const pointAtWhichItLeftTheCircularOrbit = calculateEllipticalOrbitPosition(
					(angleFromSunToMidpoint - orbitTransitionAngle) * directionAdj,
					semiMajorAxis,
					eccentricity,
					inclination,
					sunPosition
				);
				return pointAtWhichItLeftTheCircularOrbit
					.clone()
					.sub(midpointBetweenTheSuns)
					.multiplyScalar(portionOfTheWayTowardTheMidpoint)
					.add(midpointBetweenTheSuns);
			} else {
				const portionOfTheWayAwayFromTheMidpoint =
					(orbitTransitionAngle - radianDifference(angleFromSunToMidpoint, normalizedAngle)) /
					orbitTransitionAngle;
				const pointAtWhichItReturnedToTheCircularOrbit = calculateEllipticalOrbitPosition(
					(angleFromSunToMidpoint + orbitTransitionAngle) * directionAdj,
					semiMajorAxis,
					eccentricity,
					inclination,
					sunPosition
				);
				return midpointBetweenTheSuns
					.clone()
					.sub(pointAtWhichItReturnedToTheCircularOrbit)
					.multiplyScalar(portionOfTheWayAwayFromTheMidpoint)
					.add(pointAtWhichItReturnedToTheCircularOrbit);
			}
		} else {
			return calculateEllipticalOrbitPosition(
				angle,
				semiMajorAxis,
				eccentricity,
				inclination,
				sunPosition
			);
		}
	};

	let angle = Math.PI * 2;
	let position = getPositionForAngle(angle, yellowSunPosition, 'counterclockwise');

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
			const absoluteAngle = Math.abs(angle % (2 * Math.PI));
			position = getPositionForAngle(
				-angle,
				sunPosition,
				sun === 'yellowSun' ? 'counterclockwise' : 'clockwise'
			);
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
