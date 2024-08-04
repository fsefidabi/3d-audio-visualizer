import Application from "./Application"
import Environment from "./Environment"
import AudioVisualizer from "./AudioVisualizer.js"
import WobblySphere from "./WobblySphere.js"

export default class World {
    constructor() {
        this.application = new Application()
        this.scene = this.application.scene
        this.environment = new Environment()
        this.audioVisualizer = new AudioVisualizer()
    }
}
