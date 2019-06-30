import * as React from "react";

type Props = {
    id: string;
    width: number;
    height: number;
};

export class DefaultMarkerBody extends React.PureComponent {
    render() {
        return (
            <defs>
                <symbol id="markerPoly">
                    <polyline
                        stroke="none"
                        points={"0,0 20,9 20,11 0,20 5,10"}
                    />
                </symbol>
            </defs>
        );
    }
}

export class DefaultMarker extends React.PureComponent<Props> {
    render() {
        const { id, width, height } = this.props;
        return (
            <marker
                id={id}
                viewBox={`0 0 20 20`}
                refX={20}
                refY={10}
                markerUnits="userSpaceOnUse"
                orient="auto"
                markerWidth={width}
                markerHeight={height}
            >
                <use xlinkHref="#markerPoly" />
            </marker>
        );
    }
}
