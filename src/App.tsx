import './App.css'
import {Canvas, extend, useFrame, useThree} from "@react-three/fiber";
import {OrbitControls, shaderMaterial} from "@react-three/drei";
import fragment from "./shaders/fragment.glsl?raw";
import vertex from "./shaders/vertex.glsl?raw";
import * as THREE from "three";
import {useMemo, useRef} from "react";
import {useControls} from "leva";
import {AdditiveBlending} from "three";

const ColorMaterial = shaderMaterial(
    {
        uTime: 0,
        uSize: 1.0,
    },
    // the tag is optional, it allows the VSC to syntax highlibht and lint glsl,
    // also allows imports and other things
    vertex,
    fragment
)
extend({ColorMaterial})

function useShaderControls() {
    return useControls({
        uSize: {
            value: 40,
            min: 1,
            max: 50,
            step: 1,
        }
    })
}

const parameters: any = {}
parameters.count = 200000
parameters.size = 0.005
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.5
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

function GetMesh() {
    const { gl, viewport, size } = useThree()

    const ref = useRef<THREE.Mesh>();
    const {uSize} = useShaderControls();
    const [colors, sizes, scales] = useMemo(() => {
        const positions = new Float32Array(parameters.count * 3)
        const colors = new Float32Array(parameters.count * 3)
        const scales = new Float32Array(parameters.count * 1)

        const insideColor = new THREE.Color(parameters.insideColor)
        const outsideColor = new THREE.Color(parameters.outsideColor)

        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3

            // Position
            const radius = Math.random() * parameters.radius

            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius

            positions[i3] = Math.cos(branchAngle) * radius + randomX
            positions[i3 + 1] = randomY
            positions[i3 + 2] = Math.sin(branchAngle) * radius + randomZ

            // Color
            const mixedColor = insideColor.clone()
            mixedColor.lerp(outsideColor, radius / parameters.radius)

            colors[i3] = mixedColor.r
            colors[i3 + 1] = mixedColor.g
            colors[i3 + 2] = mixedColor.b

            // Scale
            scales[i] = 1.0 * Math.random()

        }
        return [colors, positions, scales]
    }, [])


    useFrame(({clock}) => {
      if(!ref.current)  return

        // ts-ignore
        ref.current.material.uniforms.uTime.value = clock.elapsedTime
    })

    console.log(gl.getPixelRatio())

    return (<points ref={ref} visible>
        <bufferGeometry attach="geometry">
            <bufferAttribute attach={"attributes-position"} count={sizes.length / 3} array={sizes} itemSize={3}/>
            <bufferAttribute attach={"attributes-color"} count={colors.length / 3} array={colors} itemSize={3}/>
            <bufferAttribute attach={"attributes-aScale"} count={scales.length} array={scales} itemSize={1}/>
        </bufferGeometry>
        <colorMaterial
            depthWrite={false}
            vertexColors={true}
            blending={AdditiveBlending}
            transparent
            uTime={0}
            uSize={uSize}
            key={ColorMaterial.key}
        />
    </points>)
}

function App() {
    return (
        <>
            <Canvas camera={{position: [3, 3, 3]}}>
                <OrbitControls/>
                <GetMesh/>
            </Canvas>
            <ul className="credits">
                <li>🧛 By <a href="https://twitter.com/Wahlstra">@Wahlstra</a> with ThreeJS (R3F). Source <a
                    href="https://github.com/magnuswahlstrand/demo-r3f-dissolve-shader">here</a></li>
                <li>🧊 Inspiration by Bruno Simon's <a href="https://threejs-journey.com/">excellent course on Three
                    JS</a></li>
                <li>🐻‍❄️ Gopher by <a href="http://reneefrench.blogspot.com/">Renee French</a>.</li>
            </ul>
        </>
    )
}

export default App
