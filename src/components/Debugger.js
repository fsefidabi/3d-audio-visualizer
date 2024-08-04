import GUI from "lil-gui"

export default class Debugger {
    constructor() {
        // this.setGui()
        this.debugObject = {
            colorA: "#6c6cd0",
            colorB: "#d3d3d3",
        }
    }

    setGui() {
        this.gui = new GUI({ width: 325 })

    }
}
