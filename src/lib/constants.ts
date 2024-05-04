import * as THREE from 'three';

export const yellowSunPosition = new THREE.Vector3(5, 0, 0);
export const redSunPosition = new THREE.Vector3(-5, 0, 0);

export const PLANETS = [
	{
		scale: 0.1,
		color: 0x0000ff,
		orbitSpeed: 0.5,
		sunPosition: yellowSunPosition,
		semiMajorAxis: 1.8,
		eccentricity: 0.019,
		inclination: 0.122
	},
	{
		scale: 0.1,
		color: 0x00ff00,
		orbitSpeed: 0.252,
		sunPosition: yellowSunPosition,
		semiMajorAxis: 2.6,
		eccentricity: 0.097,
		inclination: 0
	},
	{
		scale: 0.1,
		color: 0xffa500,
		orbitSpeed: 0.08,
		sunPosition: yellowSunPosition,
		semiMajorAxis: 3.4,
		eccentricity: 0.149,
		inclination: 0.023
	},
	{
		scale: 0.1,
		color: 0x800080,
		orbitSpeed: 0.04,
		sunPosition: yellowSunPosition,
		semiMajorAxis: 4.6,
		eccentricity: 0.133,
		inclination: 0.014
	},
	{
		scale: 0.1,
		color: 0x0000ff,
		orbitSpeed: 0.5,
		sunPosition: redSunPosition,
		semiMajorAxis: 1.7,
		eccentricity: -0.007,
		inclination: 0.059
	},
	{
		scale: 0.1,
		color: 0x00ff00,
		orbitSpeed: 0.252,
		sunPosition: redSunPosition,
		semiMajorAxis: 2.2,
		eccentricity: -0.094,
		inclination: 0.031
	},
	{
		scale: 0.1,
		color: 0xffa500,
		orbitSpeed: 0.08,
		sunPosition: redSunPosition,
		semiMajorAxis: 3.5,
		eccentricity: -0.052,
		inclination: 0.044
	},
	{
		scale: 0.1,
		color: 0x800080,
		orbitSpeed: 0.04,
		sunPosition: redSunPosition,
		semiMajorAxis: 4.2,
		eccentricity: -0.01,
		inclination: 0.031
	}
];
