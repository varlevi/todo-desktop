const assert = require("assert");
const util = require("../src/util.js");


describe("getDateFromHeader", function () {
    it("works when year is provided", function () {
        assert.strictEqual(
            util.getDateFromHeader("Monday, 10/22/2018"),
            "2018-10-22"
        );
    });

    it("works when year is not provided", function () {
        let currentYear = new Date().getFullYear();
        assert.strictEqual(
            util.getDateFromHeader("Monday, 10/22"),
            currentYear + "-10-22"
        );
    });
});


describe("padLeft", function () {
    it("works for single digit", function () {
        assert.strictEqual(util.padLeft(1), "01");
        assert.strictEqual(util.padLeft(7), "07");
        assert.strictEqual(util.padLeft(9), "09");
        assert.strictEqual(util.padLeft(0), "00");
    });

    it("works for multiple digits", function () {
        assert.strictEqual(util.padLeft(10), "10");
        assert.strictEqual(util.padLeft(99), "99");
    });
});


describe("stripLeadingZeroes", function () {
    it("strips a leading zero", function () {
        assert.strictEqual(util.stripLeadingZeroes("01"), "1");
    });

    it("strips multiple leading zeroes", function () {
        assert.strictEqual(util.stripLeadingZeroes("0007"), "7");
    });

    it("doesn't strip anything else", function () {
        assert.strictEqual(util.stripLeadingZeroes("10"), "10");
    });
});


describe("indexToDayOfWeek", function () {
    it("works for Sunday", function () {
        assert.strictEqual(util.indexToDayOfWeek(0), "Sunday");
    });

    it("works for Monday", function () {
        assert.strictEqual(util.indexToDayOfWeek(1), "Monday");
    });

    it("works for Tuesday", function () {
        assert.strictEqual(util.indexToDayOfWeek(2), "Tuesday");
    });

    it("works for Wednesday", function () {
        assert.strictEqual(util.indexToDayOfWeek(3), "Wednesday");
    });

    it("works for Thursday", function () {
        assert.strictEqual(util.indexToDayOfWeek(4), "Thursday");
    });

    it("works for Friday", function () {
        assert.strictEqual(util.indexToDayOfWeek(5), "Friday");
    });

    it("works for Saturday", function () {
        assert.strictEqual(util.indexToDayOfWeek(6), "Saturday");
    });

    it("works for index out of range", function () {
        assert.strictEqual(util.indexToDayOfWeek(-1), "unknown day of the week");
        assert.strictEqual(util.indexToDayOfWeek(7), "unknown day of the week");
    });
});
