<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { Stars } from '@threlte/extras';

	import RedSun from '$lib/components/models/RedSun.svelte';
	import YellowSun from '$lib/components/models/YellowStar.svelte';
	import Planet from '$lib/components/Planet.svelte';
	import OrbitLine from './OrbitLine.svelte';
	import { yellowSunPosition, redSunPosition, PLANETS } from '$lib/constants';
</script>

<T.PerspectiveCamera makeDefault position={[0, 10, 10]} fov={45}>
	<OrbitControls enableZoom={false} enableDamping />
</T.PerspectiveCamera>

<T.AmbientLight intensity={0.07} />

<Stars />

<RedSun scale={0.06} position={redSunPosition.toArray()} />
<T.PointLight intensity={7} color="#ff0000" position={redSunPosition.toArray()} />

<YellowSun scale={0.004} position={yellowSunPosition.toArray()} />
<T.PointLight intensity={7} color="#ffff00" position={yellowSunPosition.toArray()} />

{#each PLANETS as { scale, color, orbitSpeed, sunPosition, semiMajorAxis, eccentricity, inclination }}
	<Planet {scale} {color} {orbitSpeed} {sunPosition} {semiMajorAxis} {eccentricity} {inclination} />
	<OrbitLine {color} {sunPosition} {semiMajorAxis} {eccentricity} {inclination} />
{/each}
