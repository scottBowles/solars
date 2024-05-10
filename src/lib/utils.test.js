import { expect, test } from 'vitest';
import { isAWithinBRadiansofC } from './utils';

test('1 is within 2 radians of 0', () => {
	expect(isAWithinBRadiansofC(1, 2, 0)).toBe(true);
});

test('1 is not within 0.5 radians of 0', () => {
	expect(isAWithinBRadiansofC(1, 0.5, 0)).toBe(false);
});

test('6 is within 1 radian of 0', () => {
	expect(isAWithinBRadiansofC(6, 1, 0)).toBe(true);
});
