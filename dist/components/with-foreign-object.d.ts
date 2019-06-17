import * as React from "react";
interface WithForeignObjectProps {
    width: number;
    height: number;
    x: number;
    y: number;
}
export declare const withForeignObject: <P extends Object>(WrappedSVGComponent: React.ComponentType<P>) => React.FunctionComponent<P & WithForeignObjectProps>;
export {};
