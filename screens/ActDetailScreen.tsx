import React, { useState, useEffect } from 'react';
import * as native from 'react-native';
import { MonthChart, WeekChart, chart_data } from '../components/actChart';
import { ScrollView } from 'react-native-gesture-handler';
import * as redux from 'react-redux';
import { mapStateToProps } from '../redux/react_funcs';
import { root_state, activity_dict } from '../redux/reducers'

const moment = require('moment');
moment.locale('en');


function ActDetailScreen(props: root_state) {
    const [monthData, set_month_data] = useState<chart_data[]>([]);
    const [weekData, set_week_data] = useState<chart_data[]>([]);
    const [weekNumbers, set_week_numbers] = useState<chart_data[]>([]);

    useEffect(() => {
        let acts = props.actTypes[props.currActType].acts;
        let month_data = get_month_ratios(acts);
        let week_data = get_week_data(acts);
        set_month_data(month_data);
        set_week_data(week_data.boolean_ratios);
        set_week_numbers(week_data.number_done);
    }, [props.actTypes[props.currActType].acts]);
    return (
        <native.View>
            <ScrollView>
                <MonthChart data={monthData} />
                <WeekChart data={weekData} />
                <WeekChart data={weekNumbers} />
            </ScrollView>
        </native.View>
    );
}

export default redux.connect(mapStateToProps, null)(ActDetailScreen);

function get_month_ratios(acts: activity_dict): chart_data[] {
    let monthdays_true = Array(12).fill(0, 0, 12);
    let monthdays_recorded = Array(12).fill(0, 0, 12);
    let monthdays_ratios: chart_data[] = Array(12).fill(0, 0, 12);
    Object.keys(acts).forEach(day => {
        let act = acts[day];
        let curr_day = moment(day);
        if (act.was_done) {
            monthdays_true[curr_day.month()] += 1;
        }
        monthdays_recorded[curr_day.month()] += 1;
    });
    for (let i = 0; i < 12; i++) {
        let ratio = monthdays_true[i] / monthdays_recorded[i];
        if (ratio == Infinity || isNaN(ratio)) {
            ratio = 0;
        }
        monthdays_ratios[i] = {
            index: i,
            value: ratio
        };
    }
    return monthdays_ratios;
}

interface week_data_t {
    boolean_ratios: chart_data[];
    number_done: chart_data[];
}

function get_week_data(acts: activity_dict): week_data_t {
    let weekdays_true: number[] = Array(7).fill(0, 0, 7);
    let weekdays_recorded: number[] = Array(7).fill(0, 0, 7);
    let weekday_numbers: number[] = Array(7).fill(0,0,7);
    let week_data: week_data_t = {
        boolean_ratios: Array(7).fill(0,0,7),
        number_done: Array(7).fill(0,0,7),
    };
    Object.keys(acts).forEach(day => {
        let act = acts[day];
        let curr_day = moment(day);
        if (act.was_done) {
            weekdays_true[curr_day.day()] += 1;
        }
        if (act.was_done && Number.isInteger(act.number_done) && act.number_done != 0) {
            weekday_numbers[curr_day.day()] += act.number_done;
        }
        weekdays_recorded[curr_day.day()] += 1;
    });

    for (let i = 0; i < 7; i++) {
        var ratio = weekdays_true[i] / weekdays_recorded[i];
        if (ratio == Infinity || isNaN(ratio)) {
            ratio = 0;
        }
        week_data.boolean_ratios[i] = {
            index: i,
            value: ratio
        };
        week_data.number_done[i] = {
            index: i,
            value: weekday_numbers[i]
        }
    }
    return week_data;
}