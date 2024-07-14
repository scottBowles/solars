<script lang="ts">
	import { getAtmosphereValues } from '$lib/stores';
	import { T } from '@threlte/core';
	import * as THREE from 'three';

	export let position: [number, number, number];
	export let planetRadius: number;
	export let renderOrder: number;

	const atmosphereValues = getAtmosphereValues();

	$: uniforms = {
		planetColor: {
			value: new THREE.Color(
				$atmosphereValues.planetColor[0],
				$atmosphereValues.planetColor[1],
				$atmosphereValues.planetColor[2]
			)
		},
		scatterColor: {
			value: new THREE.Color(
				$atmosphereValues.scatterColor[0],
				$atmosphereValues.scatterColor[1],
				$atmosphereValues.scatterColor[2]
			)
		},
		alphaMultiplier: { value: $atmosphereValues.alphaMultiplier },
		fresnelPower: { value: $atmosphereValues.fresnelPower },
		atmosphereRadius: { value: $atmosphereValues.atmosphereRadius },
		fadeFromOuterRadius: { value: $atmosphereValues.fadeFromOuterRadius }
	};
</script>

<T.Mesh {position} {renderOrder}>
	<T.SphereGeometry args={[planetRadius * $atmosphereValues.planetRadiusMultiplier, 64, 64]} />
	{#key uniforms}
		<T.ShaderMaterial
			{uniforms}
			vertexShader={`
                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying vec3 vWorldPosition;

                void main() {
                vNormal = normalMatrix * normal;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                vViewPosition = -mvPosition.xyz;
                vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                gl_Position = projectionMatrix * mvPosition;
                }
            `}
			fragmentShader={`
                uniform vec3 planetColor;
                uniform vec3 scatterColor;
                uniform float alphaMultiplier;
                uniform float fresnelPower;
                uniform float atmosphereRadius;
                uniform bool fadeFromOuterRadius;

                varying vec3 vNormal;
                varying vec3 vViewPosition;
                varying vec3 vWorldPosition;

                void main() {
                    vec3 normal = normalize(vNormal);
                    vec3 viewDir = normalize(-vViewPosition);
                    
                    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), fresnelPower);
                    
                    // Scale fresnel by distance from planet center
                    vec3 worldViewDir = normalize(cameraPosition - vWorldPosition);
                    float distanceFromCenter = length(vWorldPosition);
                    float scaledFresnel = fresnel * smoothstep(0.0, atmosphereRadius, distanceFromCenter);

                    vec3 finalColor = mix(planetColor, scatterColor, scaledFresnel);
                    // float alpha = (1.0 - scaledFresnel) * alphaMultiplier;
                    // if fadeFromOuterRadius is true, fade out the atmosphere as we approach the outer radius
                    float alpha = fadeFromOuterRadius ? scaledFresnel * alphaMultiplier : (1.0 - scaledFresnel) / scaledFresnel * alphaMultiplier;

                    gl_FragColor = vec4(finalColor, alpha);

                    // Uncomment the following line for debugging the Fresnel effect
                    // gl_FragColor = vec4(vec3(scaledFresnel), 1.0);
                }
            `}
			transparent={true}
			blending={THREE.AdditiveBlending}
			side={THREE.BackSide}
		/>
	{/key}
</T.Mesh>
