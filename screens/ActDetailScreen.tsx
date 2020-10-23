import React, { useState, useEffect } from 'react';
import * as native from 'react-native';
import { MonthChart, WeekChart, chart_data } from '../components/actChart';
import { ScrollView } from 'react-native-gesture-handler';
import * as redux from 'react-redux';
import { mapStateToProps } from '../redux/react_funcs';
import { root_state_t, activity_dict_t } from '../redux/reducers'

interface act_data_t {
    boolean_ratios: chart_data[];
    number_done: chart_data[];
}

const moment = require('moment');
moment.locale('en');
let months = moment.monthsShort();
let weekdays = moment.weekdaysShort();

function ActDetailScreen(props: root_state_t) {
    const [monthData, set_month_data] = useState<chart_data[]>([]);
    const [weekData, set_week_data] = useState<chart_data[]>([]);
    const [weekNumbers, set_week_numbers] = useState<chart_data[]>([]);
    const [monthNumbers, set_month_numbers] = useState<chart_data[]>([]);
    const [domain_state, setDomains] = useState<object[]>([]);

    useEffect(() => {
        let acts = props.actTypes[props.currActType].acts;
        let month_data = get_month_data(acts);
        let week_data = get_week_data(acts);
        let the_data;
        set_month_data(month_data.boolean_ratios);
        set_week_data(week_data.boolean_ratios);
        set_week_numbers(week_data.number_done);
        set_month_numbers(month_data.number_done);
        the_data = [month_data.boolean_ratios, week_data.boolean_ratios,
                        month_data.number_done, week_data.number_done];
        setDomains(get_domains(the_data));

    }, [props.actTypes[props.currActType].acts]);

    return (
        <native.View>
            <ScrollView>
                <MonthChart
                    data={monthNumbers}
                    domain={domain_state[2]}
                    title={"Monthly"}
                />
                <WeekChart
                    data={weekNumbers}
                    domain={domain_state[3]}
                    title={"Weekly"}
                />
            </ScrollView>
        </native.View>
    );
}

export default redux.connect(mapStateToProps, null)(ActDetailScreen);

export function get_month_data(acts: activity_dict_t): act_data_t {
    let monthdays_true = Array(12).fill(0, 0, 12);
    let monthdays_recorded = Array(12).fill(0, 0, 12);
    let month_numbers: number[] = Array(12).fill(0, 0, 12);
    let month_data: act_data_t = {
        boolean_ratios: Array(12).fill(0, 0, 12),
        number_done: Array(12).fill(0, 0, 12),
    }
    Object.keys(acts).forEach(day => {
        let act = acts[day];
        let curr_day = moment(day);
        if (act.was_done) {
            monthdays_true[curr_day.month()] += 1;
        }
        if (act.was_done && Number.isInteger(act.number_done) && act.number_done > 0) {
            month_numbers[curr_day.month()] += act.number_done;
        }
        monthdays_recorded[curr_day.month()] += 1;
    });
    for (let i = 0; i < 12; i++) {
        let ratio = monthdays_true[i] / monthdays_recorded[i];
        if (ratio == Infinity || isNaN(ratio)) {
            ratio = 0;
        }
        month_data.boolean_ratios[i] = {
            index: i,
            value: ratio
        }
        month_data.number_done[i] = {
            index: i,
            value: monthdays_true[i]
        }
    }
    return month_data;
}

export function get_week_data(acts: activity_dict_t): act_data_t {
    let weekdays_true: number[] = Array(7).fill(0, 0, 7);
    let weekdays_recorded: number[] = Array(7).fill(0, 0, 7);
    let weekday_numbers: number[] = Array(7).fill(0, 0, 7);
    let week_data: act_data_t = {
        boolean_ratios: Array(7).fill(0, 0, 7),
        number_done: Array(7).fill(0, 0, 7),
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
            value: weekdays_true[i]
        }
    }
    return week_data;
}

function get_domains(the_data: chart_data[][]) {
    let domains: object[] = [];
    the_data.forEach((dataset, index) => {
        let has_nonzero_value = false;
        dataset.forEach(data => {
            if (data.value != 0) {
                has_nonzero_value = true;
            }
        });
        if (has_nonzero_value) {
            domains[index] = {};
        }
        else {
            domains[index] = { y: 1 };
        }
    });
    return domains;
}