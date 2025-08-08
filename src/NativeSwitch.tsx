import { flattenStyles } from "./ui/MendixStyles";
import React, { createElement, ReactElement, useCallback } from "react";
import { View, Text, Switch as SwitchComponent, Platform } from "react-native";
import { extractStyles } from "@mendix/pluggable-widgets-tools";
import { ActionValue } from "mendix";

import { NativeSwitchProps } from "../typings/NativeSwitchProps";
import { SwitchStyle, defaultSwitchStyle, CheckBoxInputType } from "./ui/Styles";

export type Props = NativeSwitchProps<SwitchStyle>;

export const executeAction = (action?: ActionValue): void => {
    if (action && action.canExecute && !action.isExecuting) {
        action.execute();
    }
};

export function NativeSwitch(props: Props): ReactElement {
    const { label, labelOrientation, showLabel, name, onChange, booleanAttribute, labelPosition  } = props;
    const combinedStyles = flattenStyles(defaultSwitchStyle, props.style);
    const styles = processStyles(combinedStyles);
    const horizontalOrientation = showLabel && labelOrientation === "horizontal";
    const editable = !booleanAttribute.readOnly;
    const hasValidationMessage = !!booleanAttribute.validation;
    const onChangeCallback = useCallback(() => {
        if (booleanAttribute.status === "available") {
            booleanAttribute.setValue(!booleanAttribute.value);
            
            executeAction(onChange);
        }
    }, [booleanAttribute, onChange]);

    const containerStyles = editable ? styles.container : { ...styles.container, ...styles.containerDisabled };
    const labelStyles = editable ? styles.label : { ...styles.label, ...styles.labelDisabled };
    const inputProps = editable
        ? hasValidationMessage
            ? { ...styles.inputProps, ...styles.inputErrorProps }
            : styles.inputProps
        : { ...styles.inputProps, ...styles.inputDisabledProps };

    const inputStyle: CheckBoxInputType = editable
        ? hasValidationMessage
            ? [styles.input, styles.inputError]
            : styles.input
        : [styles.input, styles.inputDisabled];

    const labelValue = label?.status === "available" ? label.value : "";

    // Create the switch element with the appropriate styles and properties
    const switchElement = (
        <SwitchComponent
            disabled={!editable}
            testID={name}
            style={inputStyle}
            onValueChange={editable ? onChangeCallback : undefined}
            value={booleanAttribute.value}
            trackColor={{
                true: inputProps.trackColorOn,
                false: inputProps.trackColorOff
            }}
            thumbColor={booleanAttribute.value ? inputProps.thumbColorOn : inputProps.thumbColorOff}
            {...(Platform.OS === "ios" ? { ios_backgroundColor: inputProps.trackColorOff } : {})}
        />
    );

    // Create the label element if showLabel is true
    const labelElement = showLabel ? (
        <Text
            testID={`${name}$label`}
            style={[labelStyles, 
                    horizontalOrientation ? { flex: 1 } : null,
                    horizontalOrientation && labelPosition === "right" ? { marginLeft: 8 } : null
            ]}
        >
            {labelValue}
        </Text>
    ) : null;

    // Create the validation message element if hasValidationMessage is true
    const validationMessage = (
    <Text testID={`${name}$alert`} style={styles.validationMessage}>
        {hasValidationMessage ? booleanAttribute.validation : " "}
    </Text>
    );

    return (
        <View
            testID={`${name}$wrapper`}
            style={[
                containerStyles,
                horizontalOrientation ? { flexDirection: "column", alignItems: "flex-start" } : null
            ]}
        >
            <View
                style={[
                    horizontalOrientation
                        ? { flexDirection: "row", alignItems: "center", width: "100%" }
                        : {}
                ]}
            >
                {horizontalOrientation
                    ? (labelPosition === "right"
                        ? [switchElement, labelElement]
                        : [labelElement, switchElement])
                    : (
                        <>
                            {labelElement}
                            {switchElement}
                        </>
                    )}
            </View>
            {validationMessage}
        </View>
    );
}

function processStyles(style: SwitchStyle): any {
    const {
        input: inputStyle,
        inputDisabled: inputDisabledStyle,
        inputError: inputErrorStyle,
        label: labelStyle,
        ...others
    } = style;

    const inputPropsKeys: Array<keyof CheckBoxInputType> = [
        "thumbColorOn",
        "thumbColorOff",
        "trackColorOn",
        "trackColorOff"
    ];
    const [inputProps, input] = extractStyles(inputStyle, inputPropsKeys);
    const [inputDisabledProps, inputDisabled] = extractStyles(inputDisabledStyle, inputPropsKeys);
    const [inputErrorProps, inputError] = extractStyles(inputErrorStyle, inputPropsKeys);
    const [labelProps, label] = extractStyles(labelStyle, ["numberOfLines"]);

    return {
        inputProps,
        input,
        inputDisabledProps,
        inputDisabled,
        inputErrorProps,
        inputError,
        labelProps,
        label,
        ...others
    };
}