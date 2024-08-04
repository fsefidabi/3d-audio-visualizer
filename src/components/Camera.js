import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import Application from "./Application"

export default class Camera {
    constructor() {
        this.application = new Application()
        this.scene = this.application.scene
        this.canvas = this.application.canvas
        this.sizes = this.application.sizes

        this.setInstance()
        this.setOrbitControls()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(50, this.sizes.width / this.sizes.height)
        this.instance.position.z = 10
        this.scene.add(this.instance)
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.enableZoom = false
        this.controls.enableRotate = true
    }

    handleResize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    handleUpdate() {
        this.controls.update()
    }
}
