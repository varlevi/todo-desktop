const { app, BrowserWindow } = require("electron");

// Global reference to window object.
let win;

function createWindow() {
    win = new BrowserWindow({ width: 800, height: 600 });
    win.loadFile("index.html");

    win.webContents.openDevTools();

    win.on("closed", () => {
        win = null;
    });
}

app.on("ready", createWindow);

// These functions are from the tutorial:
//   https://electronjs.org/docs/tutorial/first-app
// They make the application behavior properly on macOS.
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
