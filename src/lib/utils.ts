import * as THREE from 'three';

export function calculateEllipticalOrbitPosition(
	angle: number,
	semiMajorAxis: number,
	eccentricity: number,
	inclination: number,
	sunPosition: THREE.Vector3
): THREE.Vector3 {
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
