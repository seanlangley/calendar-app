import React, { useState, useEffect } from 'react';
import * as native from 'react-native';
import { MonthChart, WeekChart } from '../components/actChart';
import { ScrollView } from 'react-native-gesture-handler';
import * as redux from 'react-redux';
import { mapStateToProps } from '../redux/react_funcs'

function ActDetailScreen(props) {
    const [month_data, set_month_data] = useState([]);
    const [week_data, set_week_data] = useState([]);

    useEffect(() => {
        try{
            set_week_data(props.chartData.data[props.currActType].week);
            set_month_data(props.chartData.data[props.currActType].month);
        }
        catch(e){
            console.warn(e);
        }

    }, []);
    return (
        <native.View>
            {props.chartData.hasData == false ? <native.ActivityIndicator /> : (
                <ScrollView>
                    <MonthChart name={props.currActType} data={props.chartData.data[props.currActType].month} />
                    <WeekChart data={props.chartData.data[props.currActType].week} />
                </ScrollView>
            )}</native.View>
    );
}
export default redux.connect(mapStateToProps, null)(ActDetailScreen);