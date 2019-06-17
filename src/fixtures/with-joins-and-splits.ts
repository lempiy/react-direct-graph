export const withJoinsAndSplitsFixture = [
    {
        id: "A",
        next: ["B"],
        payload: {
            exist: true
        }
    },
    {
        id: "U",
        next: ["G"],
        payload: {
            exist: true
        }
    },
    {
        id: "B",
        next: ["C", "D", "E", "F", "M"],
        payload: {
            exist: true
        }
    },
    {
        id: "C",
        next: ["G"],
        payload: {
            exist: true
        }
    },
    {
        id: "D",
        next: ["H"],
        payload: {
            exist: true
        }
    },
    {
        id: "E",
        next: ["H"],
        payload: {
            exist: true
        }
    },
    {
        id: "F",
        next: ["N", "O"],
        payload: {
            exist: true
        }
    },
    {
        id: "N",
        next: ["I"],
        payload: {
            exist: true
        }
    },
    {
        id: "O",
        next: ["P"],
        payload: {
            exist: true
        }
    },
    {
        id: "P",
        next: ["I"],
        payload: {
            exist: true
        }
    },
    {
        id: "M",
        next: ["L"],
        payload: {
            exist: true
        }
    },
    {
        id: "G",
        next: ["I"],
        payload: {
            exist: true
        }
    },
    {
        id: "H",
        next: ["J"],
        payload: {
            exist: true
        }
    },
    {
        id: "I",
        next: [],
        payload: {
            exist: true
        }
    },
    {
        id: "J",
        next: ["K"],
        payload: {
            exist: true
        }
    },
    {
        id: "K",
        next: ["L"],
        payload: {
            exist: true
        }
    },
    {
        id: "L",
        next: [],
        payload: {
            exist: true
        }
    }
];
