import { getContext, setContext } from 'svelte';
import { cubicOut } from 'svelte/easing';
import { tweened } from 'svelte/motion';
import { derived, get, writable, type Writable } from 'svelte/store';

export const makeTweenedPosition = (initialPosition: [number, number, number]) => {
	const x = tweened(initialPosition[0], {
		duration: 1000,
		easing: cubicOut
	});
	const y = tweened(initialPosition[1], {
		duration: 1000,
		easing: cubicOut
	});
	const z = tweened(initialPosition[2], {
		duration: 1000,
		easing: cubicOut
	});

	const store = derived([x, y, z], ([$x, $y, $z]) => [$x, $y, $z] as [number, number, number]);

	return {
		subscribe: store.subscribe,
		set: (position: [number, number, number]) => {
			x.set(position[0]);
			y.set(position[1]);
			z.set(position[2]);
		},
		update: (fn: (position: [number, number, number]) => [number, number, number]) => {
			const value = fn([get(x), get(y), get(z)]);
			x.set(value[0]);
			y.set(value[1]);
			z.set(value[2]);
		}
	};
};

type CloudValues = {
	uScale: number;
	uDetail: number;
	uRoughness: number;
	uLacunarity: number;
	uDistortion: number;
	uColorStart: [number, number, number];
	uColorEnd: [number, number, number];
	uCloudCoverage: number;
	uCloudDensity: number;
};

export const setCloudValues = () => {
	const initValues: CloudValues = {
		uScale: 0.39,
		uDetail: 7.7,
		uRoughness: 0.61,
		uLacunarity: 2.5,
		uDistortion: 0.26,
		uColorStart: [1, 1, 1], // White clouds,
		uColorEnd: [0.7, 0.7, 0.7], // Light grey clouds,
		uCloudCoverage: 0.51, // Adjust this to control cloud coverage,
		uCloudDensity: 0.34
	};
	const cloudValues = writable<CloudValues>(initValues);
	setContext('cloudValues', cloudValues);
	return cloudValues;
};

export const getCloudValues = () => {
	return getContext<Writable<CloudValues>>('cloudValues');
};

type GlobalValues = {
	yellowClockwise: boolean;
	redClockwise: boolean;
	scaleFactor: number;
	speedFactor: number;
};

export const setGlobalValues = () => {
	const initValues: GlobalValues = {
		yellowClockwise: true,
		redClockwise: true,
		scaleFactor: 1,
		speedFactor: 1
	};
	const globalValues = writable<GlobalValues>(initValues);
	setContext('globalValues', globalValues);
	return globalValues;
};

export const getGlobalValues = () => {
	return getContext<Writable<GlobalValues>>('globalValues');
};
