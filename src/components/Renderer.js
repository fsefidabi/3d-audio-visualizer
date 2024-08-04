import * as THREE from "three"
import Application from "./Application"

export default class Renderer {
    constructor() {
        this.application = new Application()
        this.scene = this.application.scene
        this.canvas = this.application.canvas
        this.sizes = this.application.sizes
        this.camera = this.application.camera

        this.setInstance()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        })
        this.instance.physicallyCorrectLights = true
        this.instance.outputEncoding = THREE.sRGBEncoding
        // this.instance.outputColorSpace = THREE.sRGBEncoding
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setClearColor("#000000")
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    handleResize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    handleUpdate() {
        this.instance.render(this.scene, this.camera.instance)
    }
}
