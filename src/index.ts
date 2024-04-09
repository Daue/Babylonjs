import { DefaultLoadingScreen } from "@babylonjs/core/Loading/loadingScreen";
import App from "./app";

DefaultLoadingScreen.prototype.displayLoadingUI = () => { console.log("display loading ui")};
DefaultLoadingScreen.prototype.hideLoadingUI = () => { console.log("hide loading ui")};

const app = new App("renderCanvas");
app.init();

/* export const babylonInit = async (): Promise<void> => {
    console.log('dam');
};

babylonInit().then(() => {
    console.log('BABYLON init!!!')
}); */
