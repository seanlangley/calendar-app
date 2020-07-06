import React, { useState, useEffect } from 'react';
import * as native from 'react-native';
import { MonthChart, WeekChart } from '../components/actChart';
import { ScrollView } from 'react-native-gesture-handler';
import * as redux from 'react-redux';
import { mapStateToProps } from '../redux/react_funcs';

const moment = require('moment');
moment.locale('en');

function ActDetailScreen(props) {
    const [month_data, set_month_data] = useState([]);
    const [week_data, set_week_data] = useState([]);

    useEffect(() => {
        var weekdays_true = Array(7).fill(0, 0, 7);
        var weekdays_recorded = Array(7).fill(0,0,7);
        var weekdays_ratios = Array(7).fill(0,0,7);
        var monthdays_true = Array(12).fill(0,0,12);
        var monthdays_recorded = Array(12).fill(0,0,12);
        var monthdays_ratios = Array(12).fill(0,0,12);
        var days_true = 0;
        var days_recorded = 0;
        Object.keys(props.actTypes[props.currActType].acts).forEach(day => {
            let act = props.actTypes[props.currActType].acts[day];
            let curr_day = moment(day);
            if (act.was_done){
                weekdays_true[curr_day.day()] += 1;
                monthdays_true[curr_day.month()] += 1;
                days_true += 1;
            }
            weekdays_recorded[curr_day.day()] += 1;
            monthdays_recorded[curr_day.month()] += 1;
            days_recorded += 1;
        });

        for (let i = 0; i < 7; i++){
            var ratio = weekdays_true[i] / weekdays_recorded[i];
            if (ratio == Infinity || isNaN(ratio)){
                ratio = 0;
            }
            weekdays_ratios[i] = {
                weekday: i,
                ratio: ratio
            };
        }
        for (let i = 0; i < 12; i++){
            var ratio = monthdays_true[i] / monthdays_recorded[i];
            if (ratio == Infinity || isNaN(ratio)){
                ratio = 0;
            }
            monthdays_ratios[i] = {
                month: i,
                ratio: ratio
            };
        }
        set_month_data(monthdays_ratios);
        set_week_data(weekdays_ratios);
    }, [props.actTypes[props.currActType].acts]);
    return (
        <native.View>
                <ScrollView>
                    <MonthChart data={month_data} />
                    <WeekChart data={week_data} />
                </ScrollView>
        </native.View>
    );
}
export default redux.connect(mapStateToProps, null)(ActDetailScreen);
