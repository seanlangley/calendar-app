import React from 'react';
import {View} from 'react-native';
import {H1, P} from './StyledText'

export function Table() {
    function renderRow(data: number) {
        return (
            <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row' }} key={data}>
                { /* Edit these as they are your cells. You may even take parameters to display different data / react elements etc. */}
                <View style={{ flex: 1, alignSelf: 'stretch' }}><P>{"hi"}</P></View>
                <View style={{ flex: 1, alignSelf: 'stretch' }}><P>{"hi"}</P></View>
                <View style={{ flex: 1, alignSelf: 'stretch' }}><P>{"hi"}</P></View>
            </View>
        );
    }

    const data = [1, 2, 3, 4, 5];
    let _table = data.map((datum) => { // This will render a row for each data element.
        return renderRow(datum);
    });
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {_table}
        </View>
    );
}
