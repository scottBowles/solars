<script lang="ts">
	import { T } from '@threlte/core';
	import { interactivity, OrbitControls, Stars } from '@threlte/extras';
	import Planet4_cycles_uncompressed from '$lib/components/models/Planet4_cycles_uncompressed.svelte';
	import RedSun from '$lib/components/models/RedSun.svelte';
	import YellowSun from '$lib/components/models/YellowStar.svelte';

	import { makeTweenedPosition } from '$lib/stores';
	import { redSunPosition, yellowSunPosition } from '$lib/constants';
	import Clouds from './Clouds.svelte';

	interactivity();

	const cameraPosition = makeTweenedPosition([0, 10, 10]);
	let cameraTarget = [0, 0, 0] as [number, number, number];
</script>

<T.PerspectiveCamera makeDefault position={$cameraPosition}>
	<OrbitControls enableZoom={true} enableDamping target={cameraTarget} />
</T.PerspectiveCamera>

<T.AmbientLight intensity={3.7} />

<Stars />
<T.Group>
	<RedSun scale={0.06} position={redSunPosition.toArray()} />
	<T.PointLight intensity={7} color="#ff0000" position={redSunPosition.toArray()} />

	<YellowSun scale={0.004} position={yellowSunPosition.toArray()} />
	<T.PointLight intensity={7} color="#ffff00" position={yellowSunPosition.toArray()} />

	<Planet4_cycles_uncompressed scale={3} position={[0, 0, 0]} />
	<Clouds position={[0, 0, 0]} sphereGeometryArgs={[3.15, 32, 32]} />
</T.Group>
