import { cubicOut } from 'svelte/easing';
import { tweened } from 'svelte/motion';
import { derived, get } from 'svelte/store';

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
