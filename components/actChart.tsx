import React, {useEffect, useState} from 'react';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory-native';
import { View, Text } from 'react-native';

export interface chart_data {
    index: number;
    value: number;
}


interface props {
    data: chart_data[];
    domain: object;
}

export function MonthChart(props: props) {
    const moment = require('moment');
    moment.locale('en');
    let months_as_str = moment.monthsShort();
    var month_indices: number[] = [];
    for (var i = 0; i < 12; i++) {
        month_indices.push(i);
    }
    return (
        <View>
            <VictoryChart maxDomain={props.domain}>
                <VictoryAxis
                    tickValues={month_indices}
                    tickFormat={months_as_str}
                />
                <VictoryAxis
                    dependentAxis
                    tickFormat={x => (x)}
                />
                <VictoryBar
                    data={props.data}
                    x='index'
                    y='value'
                />
            </VictoryChart>
        </View>
    );
}

export function WeekChart(props: props) {
    const moment = require('moment');
    moment.locale('en');
    let weekdays_as_str = moment.weekdaysShort();
    var week_indices: number[] = [];
    for (var i = 0; i < 7; i++) {
        week_indices.push(i);
    }
    return (
        <View>
            <VictoryChart maxDomain={props.domain}>
                <VictoryAxis
                    tickValues={week_indices}
                    tickFormat={weekdays_as_str}
                />
                <VictoryAxis
                    dependentAxis
                    tickFormat={x => (x)}
                />
                <VictoryBar
                    data={props.data}
                    x='index'
                    y='value'
                />
            </VictoryChart>
        </View>
    );
}