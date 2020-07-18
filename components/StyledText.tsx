import * as React from 'react';
import { Text } from 'react-native';

export function MonoText(props: any) {
    return <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />;
}

export function H1(props: any) {
    return <Text {...props} style={[props.style, {
        fontSize: 20,
        fontWeight: 'bold'
    }]} />;
}