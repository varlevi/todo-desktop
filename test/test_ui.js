// TODO: http://www.matthiassommer.it/programming/desktop/integration-e2e-test-electron-mocha-spectron-chai/

const Application = require("spectron").Application;
const assert = require("assert");
const electronPath = require("electron");
const path = require("path");


describe("Electron UI", function () {
    process.env.TODO_PATH = path.join(__dirname, "assets", "todo.txt");
    this.timeout(10000);

    beforeEach(function () {
        this.app = new Application({
            path: electronPath,
            args: [path.join(__dirname, "..")]
        });
        return this.app.start();
    });

    afterEach(function () {
        if (this.app && this.app.isRunning()) {
            return this.app.stop();
        }
    });

    it("opens a window initially", function () {
        return this.app.client.getWindowCount().then(function (count) {
            assert.equal(count, 1);
        });
    });
});
