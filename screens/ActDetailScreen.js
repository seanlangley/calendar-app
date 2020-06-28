import React from 'react';
import { Text, View } from 'react-native';
import { MonthChart, WeekChart } from '../components/actChart';
import {ScrollView} from 'react-native-gesture-handler';
import * as redux from 'react-redux';
import { mapStateToProps } from '../redux/react_funcs'

function ActDetailScreen(props) {
    let month_data = props.chartData[props.currActType].month;
    let week_data = props.chartData[props.currActType].week;
    return (
        <ScrollView>
            <MonthChart name={props.currActType} data={month_data}/>
            <WeekChart data={week_data}/>
        </ScrollView>
    );
}
export default redux.connect(mapStateToProps, null)(ActDetailScreen);