import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import * as native from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Calendar, Agenda } from 'react-native-calendars';
import { connect } from 'react-redux';
import { mapStateToProps } from '../redux/react_funcs';
import * as actions from '../redux/actions';

var styles_g = require('../constants/styles');
const moment = require('moment');
let msPerDay = 24 * 60 * 60 * 1000;

interface marked_day {
    color: string;
    startingDay: boolean;
    endingDay: boolean;
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

var activeDays: active_day_dict = {}

function LinksScreen(props: any) {
    const [isLoading, setLoading] = useState(true);
    const [markedDates, setMarkedDates] = useState<marked_day_dict>({});
    const [numberDone, setNumberDone] = useState("");
    const [enterManually, setEnterManually] = useState(false);
    const [wasDone, setWasDone] = useState(false);
    const [selectedDay, setSelectedDay] = useState("");

    useEffect(() => {
        if (isLoading) {
            initialize_marked_days(props.actTypes[props.currActType]);
            setLoading(false);
        }
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {isLoading ? <ActivityIndicator /> : (
                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                    {isLoading ? <ActivityIndicator /> : (
                        <Calendar
                            markedDates={markedDates}
                            markingType={'period'}
                            onDayPress={enterManually ? (pressed_day: pressed_day) => setSelectedDay(pressed_day.dateString) : handle_automatic_update}
                        />
                    )}
                    <native.Switch
                        trackColor={{ false: "white", true: "#81b0ff" }}
                        thumbColor={enterManually ? "blue" : "white"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setEnterManually(!enterManually)}
                        value={enterManually}
                    />
                    <Text>{enterManually ? "Entering Manually" : "Entering automatically"}</Text>
                    {enterManually ? (
                        <View>
                            <Text>{selectedDay}</Text>
                            <native.TextInput
                                style={styles_g.textBox}
                                placeholder={"Number done"}
                                value={numberDone}
                                onChangeText={setNumberDone}
                            />
                            <Text>{wasDone ? 'Done' : 'Not Done'}</Text>
                            <native.Switch
                                trackColor={{ false: "white", true: "#81b0ff" }}
                                thumbColor={enterManually ? "blue" : "white"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => {
                                    setWasDone(!wasDone);
                                }}
                                value={wasDone}
                            />
                            <View style={styles_g.leftAlign}>
                                <Button
                                    title={"Submit"}
                                    onPress={() => handle_manual_update(selectedDay, 'modify', wasDone, numberDone)}
                                />
                                <Button
                                    title={"Delete"}
                                    onPress={() => handle_manual_update(selectedDay, 'delete')}
                                />
                            </View>
                        </View>
                    ) : (
                            <View />
                        )
                    }
                </ScrollView>
            )}
        </View>
    );

    function handle_manual_update(selectedDay: string, action: string, was_done?: boolean, numberDone?: string) {
        var redux_action;
        if (action != 'delete' && was_done == undefined) {
            console.error('invalid configuration');
        }
        var next_color;
        if (action == 'delete'){
            next_color = 'white';
            redux_action = 'delete';
        }
        else {
            next_color = was_done ? 'green' : 'red'
            redux_action = was_done ? 'was_done' : 'not_done';
        }
        update_calendar(selectedDay, next_color);
        props.dispatch(actions.postAct({
            day: selectedDay,
            action: redux_action,
            name: props.currActType
        }));
    }
    
    function handle_automatic_update(pressed_day: pressed_day) {
        var marked_dates = JSON.parse(JSON.stringify(markedDates));
        var curr_day_info = marked_dates[pressed_day.dateString]
        var curr_color = curr_day_info == undefined ? 'white' : curr_day_info.color;
        var post_action;
        var next_color: string = curr_color;
        if (curr_color == 'white') {
            next_color = 'green';
            post_action = "was_done";
        }
        else if (curr_color == 'green') {
            next_color = 'red';
            post_action = "not_done";
        }
        else if (curr_color == 'red') {
            next_color = 'white';
            post_action = "delete";
        }
        update_calendar(pressed_day.dateString, next_color);
        props.dispatch(actions.postAct({
            day: pressed_day.dateString,
            action: post_action,
            name: props.currActType
        }));

    }

    function update_calendar(selectedDay: string, next_color: string){
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
            var curr_ms = new Date(day).getTime();
            marked_dates[day] = {
                'color': data.acts[day].was_done ? 'green' : 'red',
                'startingDay': is_start_day(curr_ms),
                'endingDay': is_end_day(curr_ms),
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

