const assert = require("assert");
const serde = require("../src/serde.js");


describe("serialize", function () {
    it("should return empty string for no data", function () {
        assert.strictEqual(serde.serialize([]), "");
    });

    it("should handle section with no items", function () {
        const data = [
            { title: "Thursday", items: [] },
        ];
        assert.strictEqual(serde.serialize(data), "=== Thursday ===\n\n");
    });

    it("should handle one section with some items", function () {
        const data = [
            {
                title: "Monday",
                items: [
                    { text: "Study for CS exam", finished: false },
                    { text: "Philosophy paper", finished: true },
                ]
            },
        ];
        assert.strictEqual(
            serde.serialize(data),
            "=== Monday ===\n- [ ] Study for CS exam\n- [x] Philosophy paper\n\n"
        );
    });

    it("should handle multiple sections, all with items", function () {
        const data = [
            {
                title: "Work",
                items: [
                    { text: "Submit reimbursement form", finished: false },
                    { text: "Prep for 1:1", finished: true },
                ]
            },
            {
                title: "Home",
                items: [
                    { text: "Buy milk", finished: true },
                    { text: "Fix lawnmower", finished: true },
                ]
            },
        ];
        assert.strictEqual(
            serde.serialize(data),
            "=== Work ===\n- [ ] Submit reimbursement form\n- [x] Prep for 1:1\n\n" +
            "=== Home ===\n- [x] Buy milk\n- [x] Fix lawnmower\n\n"
        );
    });

    it("should handle multiple sections, some blank", function () {
        const data = [
            {
                title: "Work",
                items: [
                    { text: "Submit reimbursement form", finished: false },
                    { text: "Prep for 1:1", finished: true },
                ]
            },
            {
                title: "School",
                items: []
            },
            {
                title: "Home",
                items: [
                    { text: "Buy milk", finished: true },
                    { text: "Fix lawnmower", finished: true },
                ]
            },
        ];
        assert.strictEqual(
            serde.serialize(data),
            "=== Work ===\n- [ ] Submit reimbursement form\n- [x] Prep for 1:1\n\n" +
            "=== School ===\n\n=== Home ===\n- [x] Buy milk\n- [x] Fix lawnmower\n\n"
        );
    });
});


describe("deserialize", function () {
    it("should deserialize empty string to empty list", function () {
        assert.deepStrictEqual(serde.deserialize(""), []);
    });

    it("should handle one empty section", function () {
        assert.deepStrictEqual(
            serde.deserialize("=== Work ===\n\n"),
            [{ title: "Work", items: [] }]
        );
    });

    it("should handle one section with one unfinished item", function () {
        assert.deepStrictEqual(
            serde.deserialize("=== Work ===\n- [ ] Finish code review\n\n"),
            [
                {
                    title: "Work",
                    items: [{ text: "Finish code review", finished: false }]
                }
            ]
        )
    });

    it("should handle one section with one finished item", function () {
        assert.deepStrictEqual(
            serde.deserialize("=== Work ===\n- [x] Finish code review\n\n"),
            [
                {
                    title: "Work",
                    items: [{ text: "Finish code review", finished: true }]
                }
            ]
        )
    });

    it("should handle one section with multiple items", function () {
        assert.deepStrictEqual(
            serde.deserialize(
                "=== Work ===\n- [x] Finish code review\n- [ ] Polish slides\n\n"
            ),
            [
                {
                    title: "Work",
                    items: [
                        { text: "Finish code review", finished: true },
                        { text: "Polish slides", finished: false }
                    ]
                }
            ]
        )
    });

    it("should handle multiple sections, all with items", function () {
        assert.deepStrictEqual(
            serde.deserialize(
                "=== Work ===\n- [ ] Submit form\n- [x] Prep for 1:1\n\n" +
                "=== Home ===\n- [x] Buy milk\n- [x] Fix lawnmower\n\n"
            ),
            [
                {
                    title: "Work",
                    items: [
                        { text: "Submit form", finished: false },
                        { text: "Prep for 1:1", finished: true },
                    ],
                },
                {
                    title: "Home",
                    items: [
                        { text: "Buy milk", finished: true },
                        { text: "Fix lawnmower", finished: true },
                    ],
                },
            ]
        );
    });

    it("should handle multiple sections, some empty", function () {
        assert.deepStrictEqual(
            serde.deserialize(
                "=== Work ===\n- [ ] Submit form\n- [x] Prep for 1:1\n\n" +
                "=== School ===\n\n=== Home ===\n- [x] Buy milk\n" +
                "- [x] Fix lawnmower\n\n"
            ),
            [
                {
                    title: "Work",
                    items: [
                        { text: "Submit form", finished: false },
                        { text: "Prep for 1:1", finished: true },
                    ],
                },
                {
                    title: "School",
                    items: [],
                },
                {
                    title: "Home",
                    items: [
                        { text: "Buy milk", finished: true },
                        { text: "Fix lawnmower", finished: true },
                    ],
                },
            ]
        );
    });

    // TODO: Some deserialization tests with unusual whitespace
});
