import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory-native';
import { View, Text } from 'react-native';

const moment = require('moment');
moment.locale('en');
let months_as_str = moment.monthsShort();
let weekdays_as_str = moment.weekdaysShort();
var month_indices = [];
var week_indices = [];
for (var i = 0; i < 12; i++){
    month_indices.push(i);
}
for (var i = 0; i < 7; i++){
    week_indices.push(i);
}

export function MonthChart(props){
    return (
        <View>
            <Text>{props.name}</Text>
            <VictoryChart>
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
            x='month'
            y='ratio'
            />
            </VictoryChart>
        </View>
    );
}

export function WeekChart(props){
    return (
        <View>
            <Text>{props.name}</Text>
            <VictoryChart>
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
            x='weekday'
            y='ratio'
            />
            </VictoryChart> 
        </View>
    );
}