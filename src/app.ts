import { Engine } from "@babylonjs/core/Engines/engine";
import { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { AdvancedDynamicTexture } from "@babylonjs/gui";

import "@babylonjs/core/Helpers/sceneHelpers"
import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Engines/WebGPU/Extensions/";

//import Debugger from "./debugger"

export default class App {

    private canvas: HTMLCanvasElement;
    private engine: Engine;
    private scene: Scene;
    private camera: ArcRotateCamera;

    constructor( canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    }

    public async init() {
        await this.createEngine();
        this.createScene();
        this.createGui();

        this.engine.runRenderLoop( () => {
            this.scene.render();
        });

        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    private async createEngine() {
        if (navigator.gpu) {

            const webGPUSupported = await WebGPUEngine.IsSupportedAsync;
            if (webGPUSupported) {
                const webgpu = this.engine = new WebGPUEngine(this.canvas, {adaptToDeviceRatio: true, antialias: true,});
                await webgpu.initAsync();
                this.engine = webgpu;
            }
            else {
                this.engine = new Engine(this.canvas, true, {}, true);
            }
        }
        else {
            this.engine = new Engine(this.canvas, true, {}, true);
        }
    }

    private createScene() {
        // create scene
        this.scene = new Scene(this.engine);
        this.scene.createDefaultLight();
        this.scene.createDefaultEnvironment(
            {
                groundColor: Color3.White(),
                skyboxSize: 50,
                groundSize: 15
            }
        );

        // create camera
        this.camera = new ArcRotateCamera('camera', 0.9, 1.22, 10.3, new Vector3(0, 3, 0), this.scene);
        this.camera.wheelDeltaPercentage = 0.025;
        this.camera.useAutoRotationBehavior = true;
        this.camera.lowerRadiusLimit = 5;
        this.camera.upperRadiusLimit = 30;
        this.camera.pinchDeltaPercentage = 0.025;
        this.camera.pinchToPanMaxDistance = 24;
        this.camera.panningSensibility = 1000;
        this.camera.attachControl(this.canvas, true);

       SceneLoader.ImportMesh(
          ""
        , "./assets/"
        , "scene.gltf"
        , this.scene
        , (newMeshes) => {
            //newMeshes[0].position.y = -2;
            //this.camera.setTarget( newMeshes[0].position)
        }
       );

       //create scene debbugger
       //Debugger.create( this.engine, this.scene );
       //Debugger.log('Let the game begin...')c
    }

    private createGui() {
        const gui = AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, this.scene);
        gui.parseFromURLAsync( "./assets/guiTexture.json" );
    }
}