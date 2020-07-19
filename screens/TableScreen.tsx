import React, { useState, useEffect } from 'react';
import * as native from 'react-native';
import { MonthChart, WeekChart, chart_data } from '../components/actChart';
import { ScrollView } from 'react-native-gesture-handler';
import * as redux from 'react-redux';
import { mapStateToProps } from '../redux/react_funcs';
import { root_state_t, activity_dict_t } from '../redux/reducers'
import { Table, table_data_t } from '../components/actTable';
import {get_month_data, get_week_data} from './ActDetailScreen';

const moment = require('moment');
moment.locale('en');
let months = moment.monthsShort();
let weekdays = moment.weekdaysShort();
let styles_g = require('../constants/styles');

function ActTableScreen(props: root_state_t) {
    const [monthTable, setMonthTable] = useState<table_data_t[]>([]);
    const [weekTable, setWeekTable] = useState<table_data_t[]>([]);

    useEffect(() => {
        let month_table: table_data_t[];
        let week_table: table_data_t[];
        let acts = props.actTypes[props.currActType].acts;
        let month_data = get_month_data(acts);
        let week_data = get_week_data(acts);

        month_table = months.map((month: string, index: number) => {
            return [
                month,
                Math.round(month_data.boolean_ratios[index].value * 100) / 100,
                month_data.number_done[index].value
            ];
        });
        month_table.unshift(['Month', 'Done/Recorded', 'Total Done']);
        week_table = weekdays.map((day: string, index: number) => {
            return [
                day,
                Math.round(week_data.boolean_ratios[index].value * 100) / 100,
                week_data.number_done[index].value];
        });
        week_table.unshift(['Week', 'Done/Recorded', 'Total Done']);
        setWeekTable(week_table);
        setMonthTable(month_table);
    }, [props.actTypes[props.currActType].acts]);

    return (
        <ScrollView>
            <Table
                data={monthTable}
                title={"Month data"}
            />
            <Table
                data={weekTable}
                title={"Week data"}
            />
        </ScrollView>

    );
}
export default redux.connect(mapStateToProps, null)(ActTableScreen);