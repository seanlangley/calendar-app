import React from 'react';
import {View, Text} from 'react-native';
import {H1, P} from './StyledText'

interface prop_t {
    data: [string, number][];
}

export function Table(props: prop_t) {
    function renderRow(data: [string, number]) {
        return (
            <View key={data[0]} style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
                { /* Edit these as they are your cells. You may even take parameters to display different data / react elements etc. */}
                <View style={{ flex: 1, alignSelf: 'stretch' }}><P>{data[0]}</P></View>
                <View style={{ flex: 1, alignSelf: 'stretch' }}><P>{data[1]}</P></View>
            </View>
        );
    }

    let the_table = props.data.map((datum) => { // This will render a row for each data element.
        return renderRow(datum);
    });
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {the_table}
        </View>
    );
}


let _data = [['jan', 0,1,2,3,4], ['feb', 0,1,2,3,4]]
export function Table_h(props: any) {
    function renderRow(data: [string, number]) {
        let the_row = data.map(item => {
            return (<View style={{ flex: 1, alignSelf: 'stretch' }}><Text>{item}</Text></View>);
        });
        return (
            <View key={data[0]} style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }}>
                { /* Edit these as they are your cells. You may even take parameters to display different data / react elements etc. */}
                {the_row}
            </View>
        );
    }

    let the_table = props.data.map((datum) => { // This will render a row for each data element.
        return renderRow(datum);
    });
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {the_table}
        </View>
    );
}