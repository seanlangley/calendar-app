import React from 'react';
import {View, Text} from 'react-native';
import {H1, P} from './StyledText'

let styles_g = require('../constants/styles');

export type table_data_t = [string, number|string];
interface prop_t {
    data: table_data_t[];
    title: string;
}

export function Table(props: prop_t) {
    function renderRow(data: table_data_t, is_even: boolean) {
        let color: string;
        if (is_even){
            color = '#bababa';
        }
        else {
            color = 'white';
        }
        return (
            <View key={data[0]} style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', backgroundColor: color}}>
                { /* Edit these as they are your cells. You may even take parameters to display different data / react elements etc. */}
                <View style={{ flex: 1, alignSelf: 'stretch' }}><P>{data[0]}</P></View>
                <View style={{ flex: 1, alignSelf: 'stretch' }}><P>{data[1]}</P></View>
            </View>
        );
    }

    let the_table = props.data.map((datum, index) => { // This will render a row for each data element.
        return renderRow(datum, index % 2 == 0);
    });
    return (
        <View style={styles_g.container}>
            <H1>{props.title}</H1>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {the_table}
            </View>
        </View>
    );
}
