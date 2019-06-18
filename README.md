# React Direct Graph

> React component for drawing direct graphs with rectangular (non-curve) edges

[![Build Status](https://travis-ci.org/lempiy/react-direct-graph.svg?branch=master)](https://travis-ci.org/lempiy/react-direct-graph) [![NPM](https://img.shields.io/npm/v/react-direct-graph.svg)](https://www.npmjs.com/package/react-direct-graph) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-direct-graph
```

## Usage

```tsx
import * as React from "react";

import DirectGraph from "react-direct-graph";

const sellSize = 150;
const padding = sellSize * 0.25;

const graph = [
    {
        id: "A",
        next: ["B"],
        payload: {
            any: true
        }
    },
    {
        id: "U",
        next: ["G"],
        payload: {
            any: true
        }
    },
    {
        id: "B",
        next: ["C", "D", "E", "F"],
        payload: {
            any: true
        }
    },
    {
        id: "C",
        next: [],
        payload: {
            any: true
        }
    },
    {
        id: "D",
        next: [],
        payload: {
            any: true
        }
    },
    {
        id: "E",
        next: [],
        payload: {
            any: true
        }
    },
    {
        id: "F",
        next: [],
        payload: {
            any: true
        }
    }
];

class Example extends React.Component {
    render() {
        return (
            <DirectGraph list={graph} sellSize={sellSize} padding={padding} />
        );
    }
}
```

## License

MIT © [lempiy](https://github.com/lempiy)
