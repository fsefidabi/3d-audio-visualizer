import * as THREE from "three"
import Application from "./Application"
import WobblySphere from "./WobblySphere.js"
import { fromEvent } from "rxjs"

export default class AudioVisualizer {
    constructor() {
        this.application = new Application()

        this.setAudioListener()
        this.loadAudioFile()
        this.setAudioAnalyzer()
        this.setMesh()
    }

    setAudioListener() {
        this.listener = new THREE.AudioListener()
        this.application.camera.instance.add(this.listener)
    }

    loadAudioFile(file = "./Beats.mp3") {
        this.sound = new THREE.Audio(this.listener)
        const audioLoader = new THREE.AudioLoader()
        audioLoader.load(file, (buffer) => {
            this.sound.setBuffer(buffer)
            this.sound.loop = true
        })
    }

    setAudioAnalyzer() {
        this.analyzer = new THREE.AudioAnalyser(this.sound, 32)
        this.setupEventListeners()
    }

    setupEventListeners() {
        fromEvent(window, "play-audio").subscribe(() => {
            this.sound.play()
        })
        fromEvent(window, "pause-audio").subscribe(() => {
            this.sound.pause()
        })
    }

    setMesh() {
        this.mesh = new WobblySphere(this.analyzer)
    }
}
