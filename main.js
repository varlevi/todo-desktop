/**
 * The Electron code for the TO-DO app. See `ui.js` for the app's main
 * functionality.
 *
 * Author:  Ian Fisher (iafisher@protonmail.com)
 * Version: October 2018
 */

const { app, BrowserWindow } = require("electron");

// Global reference to window object.
let win;

function createWindow() {
    if (process.env.DEBUG) {
        win = new BrowserWindow({ width: 1200, height: 900 });
        win.loadFile("index.html");

        win.webContents.openDevTools();
    } else {
        win = new BrowserWindow({ width: 650, height: 900 });
        win.loadFile("index.html");
    }

    win.on("closed", () => {
        win = null;
    });
}

app.on("ready", createWindow);

// These functions are from the tutorial:
//   https://electronjs.org/docs/tutorial/first-app
// They make the application behave properly on macOS.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
});

app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});
