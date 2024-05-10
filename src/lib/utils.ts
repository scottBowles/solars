import * as THREE from 'three';

export function calculateEllipticalOrbitPosition({
	angle,
	semiMajorAxis,
	eccentricity,
	inclination,
	sunPosition
}: {
	angle: number;
	semiMajorAxis: number;
	eccentricity: number;
	inclination: number;
	sunPosition: THREE.Vector3;
}): THREE.Vector3 {
	const trueAnomaly = angle;
	const r =
		(semiMajorAxis * (1 - eccentricity * eccentricity)) /
		(1 + eccentricity * Math.cos(trueAnomaly));
	const x = r * Math.cos(trueAnomaly);
	const z = r * Math.sin(trueAnomaly);
	const newPosition = new THREE.Vector3(x, 0, z);
	newPosition.applyAxisAngle(new THREE.Vector3(1, 0, 0), inclination);
	newPosition.add(sunPosition);
	return newPosition;
}

export function radianDifference(a: number, b: number): number {
	const diff = Math.abs(a - b);
	// account for the fact that the angle wraps around
	return diff < Math.PI ? diff : 2 * Math.PI - diff;
}

export function isAWithinBRadiansofC(a: number, b: number, c: number): boolean {
	const diff = radianDifference(a, c);
	return diff < b;
}

const normalizeAngle = (angle: number) => Math.abs((angle % (2 * Math.PI)) * Math.sign(angle));

export const getFigureEightPositionForAngle = ({
	sunPosition,
	midpointBetweenTheSuns,
	angle,
	semiMajorAxis,
	eccentricity,
	inclination,
	direction = 'clockwise'
}: {
	sunPosition: THREE.Vector3;
	midpointBetweenTheSuns: THREE.Vector3;
	angle: number;
	semiMajorAxis: number;
	eccentricity: number;
	inclination: number;
	direction?: 'clockwise' | 'counterclockwise';
}) => {
	const radius = semiMajorAxis;
	// the angle at which the path transitions between the circular orbit and a linear path to the other sun
	const orbitTransitionAngle = Math.acos(radius / sunPosition.distanceTo(midpointBetweenTheSuns));
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
			const pointAtWhichItLeftTheCircularOrbit = calculateEllipticalOrbitPosition({
				angle: (angleFromSunToMidpoint - orbitTransitionAngle) * directionAdj,
				semiMajorAxis,
				eccentricity,
				inclination,
				sunPosition
			});
			return pointAtWhichItLeftTheCircularOrbit
				.clone()
				.sub(midpointBetweenTheSuns)
				.multiplyScalar(portionOfTheWayTowardTheMidpoint)
				.add(midpointBetweenTheSuns);
		} else {
			const portionOfTheWayAwayFromTheMidpoint =
				(orbitTransitionAngle - radianDifference(angleFromSunToMidpoint, normalizedAngle)) /
				orbitTransitionAngle;
			const pointAtWhichItReturnedToTheCircularOrbit = calculateEllipticalOrbitPosition({
				angle: (angleFromSunToMidpoint + orbitTransitionAngle) * directionAdj,
				semiMajorAxis,
				eccentricity,
				inclination,
				sunPosition
			});
			return midpointBetweenTheSuns
				.clone()
				.sub(pointAtWhichItReturnedToTheCircularOrbit)
				.multiplyScalar(portionOfTheWayAwayFromTheMidpoint)
				.add(pointAtWhichItReturnedToTheCircularOrbit);
		}
	} else {
		return calculateEllipticalOrbitPosition({
			angle,
			semiMajorAxis,
			eccentricity,
			inclination,
			sunPosition
		});
	}
};
