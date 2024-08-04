import * as THREE from "three"
import Sizes from "../utils/sizes"
import { Random } from "random-js"
import Time from "../utils/time"
import Camera from "./Camera"
import Renderer from "./Renderer"
import World from "./World"
import Debugger from "./Debugger.js"

let instance = null

export default class Application {
    constructor(canvas) {
        if (instance) {
            return instance
        }
        instance = this

        window.application = this

        this.canvas = canvas
        this.scene = new THREE.Scene()
        this.clock = new THREE.Clock()
        this.random = new Random()
        this.sizes = new Sizes()
        this.time = new Time()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.debugger = new Debugger()
        this.world = new World()

        this.sizes.resizeSubject.subscribe(() => {
            this.handleResize()
        })

        this.time.tickSubject.subscribe(() => {
            this.handleUpdate()
        })
    }

    handleResize() {
        this.camera.handleResize()
        this.renderer.handleResize()
        this.world.audioVisualizer.mesh.handleResize()
    }

    handleUpdate() {
        this.camera.handleUpdate()
        this.renderer.handleUpdate()
        if (this.world.audioVisualizer?.mesh) {
            this.world.audioVisualizer.mesh.handleUpdate(this.time.elapsed)
        }
    }
}
