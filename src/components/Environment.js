import * as THREE from "three"
import Application from "./Application"

export default class Environment {
    constructor() {
        this.application = new Application()
        this.scene = this.application.scene

        this.setSunLight()
        this.setAmbientLight()
    }

    setSunLight() {
        this.sunLight = new THREE.DirectionalLight(0xffffff, 2)
        this.sunLight.castShadow = true
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(2, 2, 0)
        this.scene.add(this.sunLight)
    }

    setAmbientLight() {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(this.ambientLight)
    }
}
