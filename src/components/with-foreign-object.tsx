import * as React from "react"

interface WithForeignObjectProps {
    width: number
    height: number
    x: number
    y: number
}

export const withForeignObject = <P extends Object>(
    WrappedSVGComponent: React.ComponentType<P>
): React.FC<P & WithForeignObjectProps> => ({
    width,
    height,
    x,
    y,
    ...props
}: WithForeignObjectProps) => (
    <foreignObject
        x={x}
        y={y}
        width={width}
        height={height}
        className={"node-icon"}
    >
        <WrappedSVGComponent {...props as P} />
    </foreignObject>
);
