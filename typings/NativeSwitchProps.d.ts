/**
 * This file was generated from NativeSwitch.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue, EditableValue } from "mendix";

export type LabelOrientationEnum = "horizontal" | "vertical";

export type LabelPositionEnum = "left" | "right";

export interface NativeSwitchProps<Style> {
    name: string;
    style: Style[];
    booleanAttribute: EditableValue<boolean>;
    onChange?: ActionValue;
    showLabel: boolean;
    label?: DynamicValue<string>;
    labelOrientation: LabelOrientationEnum;
    labelPosition: LabelPositionEnum;
}

export interface NativeSwitchPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    booleanAttribute: string;
    onChange: {} | null;
    showLabel: boolean;
    label: string;
    labelOrientation: LabelOrientationEnum;
    labelPosition: LabelPositionEnum;
}
