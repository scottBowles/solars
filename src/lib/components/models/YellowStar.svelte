<!--
Auto-generated by: https://github.com/threlte/threlte/tree/main/packages/gltf
Command: npx @threlte/gltf@2.0.3 /Users/scottbowles/Dev/threlte/static/models/YellowStar.glb --root /models/ --types --printwidth 120 --precision 2
Author: dainius.vareika (https://sketchfab.com/dainius.vareika)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/yellow-star-66d8471667bd448a8ab46c5cb6bb5f8d
Title: Yellow star
-->

<script lang="ts">
  import type * as THREE from 'three'
  import { Group } from 'three'
  import { T, type Props, type Events, type Slots, forwardEventHandlers } from '@threlte/core'
  import { useGltf } from '@threlte/extras'

  type $$Props = Props<THREE.Group>
  type $$Events = Events<THREE.Group>
  type $$Slots = Slots<THREE.Group> & { fallback: {}; error: { error: any } }

  export const ref = new Group()

  type GLTFResult = {
    nodes: {
      UnstableStarCore_1_0_material_0: THREE.Mesh
      UnstableStarref_2_0_material_1003_0: THREE.Mesh
    }
    materials: {
      material: THREE.MeshStandardMaterial
      ['material_1.003']: THREE.MeshStandardMaterial
    }
  }

  const gltf = useGltf<GLTFResult>('/models/YellowStar.glb')

  const component = forwardEventHandlers()
</script>

<T is={ref} dispose={false} {...$$restProps} bind:this={$component}>
  {#await gltf}
    <slot name="fallback" />
  {:then gltf}
    <T.Group scale={0.01}>
      <T.Group scale={100}>
        <T.Group scale={14.85}>
          <T.Mesh
            geometry={gltf.nodes.UnstableStarCore_1_0_material_0.geometry}
            material={gltf.materials.material}
            rotation={[-Math.PI / 2, 0, 0]}
          />
          <T.Mesh
            geometry={gltf.nodes.UnstableStarref_2_0_material_1003_0.geometry}
            material={gltf.materials['material_1.003']}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={1.01}
          />
        </T.Group>
      </T.Group>
    </T.Group>
  {:catch error}
    <slot name="error" {error} />
  {/await}

  <slot {ref} />
</T>
