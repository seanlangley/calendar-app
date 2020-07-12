import React, { useState, useEffect } from 'react';
import * as native from 'react-native';
import { MonthChart, WeekChart } from '../components/actChart';
import { ScrollView } from 'react-native-gesture-handler';
import * as redux from 'react-redux';
import { mapStateToProps } from '../redux/react_funcs';
import { root_state, activity_dict } from '../redux/reducers'

const moment = require('moment');
moment.locale('en');

interface chart_data {
    index: number;
    value: number;
}

function ActDetailScreen(props: root_state) {
    const [month_data, set_month_data] = useState<chart_data[]>([]);
    const [week_data, set_week_data] = useState<chart_data[]>([]);

    useEffect(() => {
        let acts = props.actTypes[props.currActType].acts;
        set_month_data(get_month_ratios(acts));
        set_week_data(get_week_ratios(acts));
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

function get_week_ratios(acts: activity_dict): chart_data[] {
    var weekdays_true = Array(7).fill(0, 0, 7);
    var weekdays_recorded = Array(7).fill(0, 0, 7);
    var weekdays_ratios = Array(7).fill(0, 0, 7);
    Object.keys(acts).forEach(day => {
        let act = acts[day];
        let curr_day = moment(day);
        if (act.was_done) {
            weekdays_true[curr_day.day()] += 1;
        }
        weekdays_recorded[curr_day.day()] += 1;
    });

    for (let i = 0; i < 7; i++) {
        var ratio = weekdays_true[i] / weekdays_recorded[i];
        if (ratio == Infinity || isNaN(ratio)) {
            ratio = 0;
        }
        weekdays_ratios[i] = {
            weekday: i,
            ratio: ratio
        };
    }
    return weekdays_ratios;
}