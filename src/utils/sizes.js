import { fromEvent, Subject } from "rxjs"

export default class Sizes {
    constructor() {
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        this.resizeSubject = new Subject()
        this.setupResizeListener()
    }

    setupResizeListener() {
        fromEvent(window, "resize").subscribe(() => {
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)
            this.resizeSubject.next()
        })
    }
}
