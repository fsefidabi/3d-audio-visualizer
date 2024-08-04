import * as THREE from "three";
import { Subject } from "rxjs"

export default class Time {
    constructor() {
        this.tickSubject = new Subject()
        this.clock = new THREE.Clock()

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick() {
        this.elapsed = this.clock.getElapsedTime()

        this.tickSubject.next()

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}
