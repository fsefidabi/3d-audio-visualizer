import * as THREE from "three"
import CustomShaderMaterial from "three-custom-shader-material/vanilla"
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js"
import Application from "./Application.js"
import vertexShader from "../shaders/wobblySphere/vertex.glsl"
import fragmentShader from "../shaders/wobblySphere/fragment.glsl"

export default class WobblySphere {
    constructor(analyzer) {
        this.application = new Application()
        this.scene = this.application.scene
        this.camera = this.application.camera.instance
        this.sizes = this.application.sizes
        this.renderer = this.application.renderer.instance
        this.debugger = this.application.debugger

        this.audioAnalyser = analyzer

        this.setGeometry()
        this.setMaterial()
        this.setGlowEffect()
        this.setWobblySphere()
        if (this.debugger?.gui) {
            this.setDebuggerProperties()
        }
    }

    setGeometry() {
        this.geometry = new THREE.IcosahedronGeometry(2.5, 50)
        this.geometry = mergeVertices(this.geometry)
        this.geometry.computeTangents()
    }

    setMaterial() {
        this.setUniforms()

        this.material = new CustomShaderMaterial({
            baseMaterial: THREE.MeshPhysicalMaterial,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: this.uniforms,
            silent: true,
            metalness: 0,
            roughness: 0.5,
            color: "#FFFFFF",
            transmission: 0,
            ior: 1.5,
            thickness: 1.5,
            transparent: true,
            wireframe: false
        })

        this.depthMaterial = new CustomShaderMaterial({
            baseMaterial: THREE.MeshDepthMaterial,
            vertexShader: vertexShader,
            silent: true,
            depthPacking: THREE.RGBADepthPacking
        })
    }

    setUniforms() {
        this.uniforms = {
            uTime: new THREE.Uniform(0),
            uPositionFrequency: new THREE.Uniform(0.5),
            uTimeFrequency: new THREE.Uniform(0.2),
            uStrength: new THREE.Uniform(0.3),

            uWarpPositionFrequency: new THREE.Uniform(0.38),
            uWarpTimeFrequency: new THREE.Uniform(0.12),
            uWarpStrength: new THREE.Uniform(1.7),

            uColorA: new THREE.Uniform(new THREE.Color(this.debugger.debugObject.colorA)),
            uColorB: new THREE.Uniform(new THREE.Color(this.debugger.debugObject.colorB)),

            uAudioFrequency: new THREE.Uniform(0)
        }
    }

    setWobblySphere() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.customDepthMaterial = this.depthMaterial
        this.mesh.receiveShadow = true
        this.mesh.castShadow = true
        this.scene.add(this.mesh)
    }

    setDebuggerProperties() {
        this.debugger.gui.material = this.debugger.gui.addFolder("Material")
        this.debugger.gui.material.add(this.material, "metalness", 0, 1, 0.001)
        this.debugger.gui.material.add(this.material, "roughness", 0, 1, 0.001)
        this.debugger.gui.material.add(this.material, "transmission", 0, 1, 0.001)
        this.debugger.gui.material.add(this.material, "ior", 0, 10, 0.001)
        this.debugger.gui.material.add(this.material, "thickness", 0, 10, 0.001)

        this.debugger.gui.uniforms = this.debugger.gui.addFolder("Uniforms")
        this.debugger.gui.uniforms.add(this.uniforms.uPositionFrequency, "value", 0, 2, 0.001).name("uPositionFrequency")
        this.debugger.gui.uniforms.add(this.uniforms.uTimeFrequency, "value", 0, 2, 0.001).name("uTimeFrequency")
        this.debugger.gui.uniforms.add(this.uniforms.uStrength, "value", 0, 2, 0.001).name("uStrength")

        this.debugger.gui.uniforms.add(this.uniforms.uWarpPositionFrequency, "value", 0, 2, 0.001).name("uWarpPositionFrequency")
        this.debugger.gui.uniforms.add(this.uniforms.uWarpTimeFrequency, "value", 0, 2, 0.001).name("uWarpTimeFrequency")
        this.debugger.gui.uniforms.add(this.uniforms.uWarpStrength, "value", 0, 2, 0.001).name("uWarpStrength")

        this.debugger.gui.colors = this.debugger.gui.addFolder("Colors")
        this.debugger.gui.colors.addColor(this.debugger.debugObject, "colorA").onChange(() => this.uniforms.uColorA.value.set(this.debugger.debugObject.colorA))
        this.debugger.gui.colors.addColor(this.debugger.debugObject, "colorB").onChange(() => this.uniforms.uColorB.value.set(this.debugger.debugObject.colorB))
    }

    setGlowEffect() {
        this.renderScene = new RenderPass(this.scene, this.camera)

        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(this.sizes.width, this.sizes.height))
        this.bloomPass.threshold = 0.5
        this.bloomPass.strength = 0.5
        this.bloomPass.radius = 0.8

        this.bloomComposer = new EffectComposer(this.renderer)
        this.bloomComposer.addPass(this.renderScene)
        this.bloomComposer.addPass(this.bloomPass)

        this.outputPass = new OutputPass()
        this.bloomComposer.addPass(this.outputPass)
    }

    handleUpdate(elapsedTime) {
        this.uniforms.uTime.value = elapsedTime
        this.uniforms.uAudioFrequency.value = this.audioAnalyser.getAverageFrequency()
        this.bloomComposer.render()
        this.mesh.rotation.x += elapsedTime * 0.0001
        this.mesh.rotation.y += elapsedTime * 0.0001
    }

    handleResize() {
        this.bloomComposer.setSize(this.sizes.width, this.sizes.height)
    }
}
