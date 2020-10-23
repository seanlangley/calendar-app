import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import * as redux from 'react-redux';
import { mapStateToProps } from '../redux/react_funcs';
import { root_state_t } from '../redux/reducers'
import { Table, table_data_t } from '../components/actTable';
import {get_month_data, get_week_data} from './ActDetailScreen';

const moment = require('moment');
moment.locale('en');
let months = moment.monthsShort();
let weekdays = moment.weekdaysShort();

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
                month_data.number_done[index].value
            ];
        });
        month_table.unshift(['Month', 'Total Done']);
        week_table = weekdays.map((day: string, index: number) => {
            return [
                day,
                week_data.number_done[index].value];
        });
        week_table.unshift(['Weekday', 'Total Done']);
        setWeekTable(week_table);
        setMonthTable(month_table);
    }, [props.actTypes[props.currActType].acts]);

    return (
        <ScrollView>
            <Table
                data={monthTable}
                title={"Monthly"}
            />
            <Table
                data={weekTable}
                title={"Weekly"}
            />
        </ScrollView>

    );
}
export default redux.connect(mapStateToProps, null)(ActTableScreen);