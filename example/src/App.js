import React, {
    Component
} from 'react'

import {ExampleEdit, exampleEditCode} from './components'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const cellSize = 100
const padding = cellSize * 0.25

export default class App extends Component {
    
    render() {
        return (
            <main>
                <section className="example">
                    <ExampleEdit cellSize={cellSize} padding={padding}></ExampleEdit>
                    <SyntaxHighlighter language='jsx' style={darcula}>{exampleEditCode}</SyntaxHighlighter>
                </section>
            </main>
        )
    }
}
