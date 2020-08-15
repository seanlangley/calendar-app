import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import * as native from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Calendar, Agenda } from 'react-native-calendars';
import { connect } from 'react-redux';
import { mapStateToProps } from '../redux/react_funcs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as actions from '../redux/actions';
import {H1, P} from '../components/StyledText';

var styles_g = require('../constants/styles');
const moment = require('moment');
let msPerDay = 24 * 60 * 60 * 1000;

interface marked_day {
    color: string;
    startingDay: boolean;
    endingDay: boolean;
    marked: boolean;
}
interface marked_day_dict {
    [day: string]: marked_day;
}

interface active_day_dict {
    [day_in_ms: number]: boolean;
}
interface pressed_day {
    year: number;
    month: number;
    day: number;
    timestamp: number;
    dateString: string;
}

var activeDays: active_day_dict = {};

export function LinksScreen(props: any) {
    const [isLoading, setLoading] = useState(true);
    const [markedDates, setMarkedDates] = useState<marked_day_dict>({});
    const [enterManually, setEnterManually] = useState(false);
    const [selectedDay, setSelectedDay] = useState("");
    const [recorded, setRecorded] = useState("");
    const [doneColor, setDoneColor] = useState("green");
    const [notDoneColor, setNotDoneColor] = useState("red");

    useEffect(() => {
        if (isLoading) {
            activeDays = {};
            initialize_marked_days(props.actTypes[props.currActType]);
            setLoading(false);
        }
    }, []);

    return (
        <KeyboardAwareScrollView
            style={styles_g.container}
            contentContainerStyle={styles.contentContainer}
            keyboardOpeningTime={10}
            extraHeight={10}
        >
            <Calendar
                markedDates={markedDates}
                markingType={'period'}
                onDayPress={(pressed_day: pressed_day) => {
                    if (enterManually) {
                        setSelectedDay(pressed_day.dateString)
                        let act = props.actTypes[props.currActType].acts[pressed_day.dateString];
                        if (act != undefined && act.was_done && Number.isInteger(act.number_done) && act.number_done > 0) {
                            setRecorded("Recorded: " + act.number_done.toString());
                        }
                        else {
                            setRecorded("");
                        }
                    }
                    else {
                        handle_automatic_update(pressed_day);
                    }
                }}
            />
        </KeyboardAwareScrollView >
    );

    function handle_automatic_update(pressed_day: pressed_day) {
        var marked_dates = JSON.parse(JSON.stringify(markedDates));
        var curr_day_info = marked_dates[pressed_day.dateString]
        var curr_color = curr_day_info == undefined ? 'white' : curr_day_info.color;
        var post_action = "";
        var next_color = "";
        if (curr_color == 'white') {
            next_color = doneColor;
            post_action = "was_done";
        }
        else if (curr_color == doneColor) {
            next_color = 'white';
            post_action = "delete";
        }
        if (post_action == "" || next_color == "") {
            console.error("Invalid configuration");
        }
        update_calendar(pressed_day.dateString, next_color, false);
        props.dispatch(actions.postAct({
            day: pressed_day.dateString,
            action: post_action,
            name: props.currActType,
            number_done: "0",
        }));
    }

    function update_calendar(selectedDay: string, next_color: string, marked: boolean) {
        var marked_dates = JSON.parse(JSON.stringify(markedDates));
        var pressed_day = new Date(selectedDay);
        var prev_day = new Date(Math.round(pressed_day.getTime() - msPerDay));
        var next_day = new Date(Math.round(pressed_day.getTime() + msPerDay));
        function getISOString(day: Date) {
            return day.toISOString().slice(0, 10);
        }

        if (is_day_active(prev_day.getTime())) {
            marked_dates[getISOString(prev_day)]['endingDay'] = next_color == 'white' ? true : false;
        }
        if (is_day_active(next_day.getTime())) {
            marked_dates[getISOString(next_day)]['startingDay'] = next_color == 'white' ? true : false;
        }
        activeDays[pressed_day.getTime()] = next_color == 'white' ? false : true;
        marked_dates[getISOString(pressed_day)] = {
            'color': next_color,
            'startingDay': is_start_day(pressed_day.getTime()),
            'endingDay': is_end_day(pressed_day.getTime()),
            'marked': marked,
        };
        setMarkedDates(marked_dates);

    }

    function is_day_active(day_in_ms: number): boolean {
        if (!(day_in_ms in activeDays)) {
            activeDays[day_in_ms] = false;
        }
        return activeDays[day_in_ms];
    }

    function is_start_day(day_ms: number): boolean {
        //A day is a start day if the prev day is not active
        var prev = Math.round(day_ms - msPerDay);
        return !is_day_active(prev);
    }

    function is_end_day(day_ms: number): boolean {
        //A day is an end day if the next day is not active
        var next = Math.round(day_ms + msPerDay);
        return !is_day_active(next);
    }

    function initialize_marked_days(data: any): void {
        var marked_dates: marked_day_dict = {};

        Object.keys(data.acts).forEach(day => {
            activeDays[new Date(day).getTime()] = true;
        });

        Object.keys(data.acts).forEach((day) => {
            let act = data.acts[day];
            let curr_ms = new Date(day).getTime();
            let marked: boolean;
            if (act.was_done && Number.isInteger(act.number_done) && act.number_done > 0) {
                marked = true;
            }
            else {
                marked = false;
            }
            marked_dates[day] = {
                'color': act.was_done ? doneColor : notDoneColor,
                'startingDay': is_start_day(curr_ms),
                'endingDay': is_end_day(curr_ms),
                'marked': marked,
            };
        });
        setMarkedDates(marked_dates);
    }

}


export default connect(mapStateToProps, null)(LinksScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    contentContainer: {
        paddingTop: 15,
    },
});

