import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Calendar } from 'react-native-calendars';
import DropDownPicker from 'react-native-dropdown-picker';
import {connect} from 'react-redux';
import { mapStateToProps } from '../redux/react_funcs';
import {check_fetch} from '../utils/utils';

var use_server = true;
var url;
if (use_server) {
    url = 'http://localhost:8000/activities/';
}
let msPerDay = 24 * 60 * 60 * 1000;
var activeDays = {}
var daysToPost = {}

function LinksScreen(props) {
    const [isLoading, setLoading] = useState(true);
    const [markedDates, setMarkedDates] = useState({});

    function is_day_active(day_in_ms, act_name){
        if (!(day_in_ms in activeDays[act_name])){
            activeDays[act_name][day_in_ms] = false;
        }
        return activeDays[act_name][day_in_ms];
    }
    function set_is_day_active(value, day_in_ms, act_name){
        activeDays[act_name][day_in_ms] = value;
    }

    function is_start_day(day_ms, act_name){
        //A day is a start day if the prev day is not active
        var prev = Math.round(day_ms - msPerDay);
        return !is_day_active(prev, act_name);
    }

    function is_end_day(day_ms, act_name){
        //A day is an end day if the next day is not active
        var next = Math.round(day_ms + msPerDay);
        return !is_day_active(next, act_name);
    }

    function initialize_data(data) {
        var marked_dates = {};
        var dropdown_data = [];
        var activity_types = {};

        Object.keys(props.chartData).forEach(act_name => {
            marked_dates[act_name] = {};
            daysToPost[act_name] = {};
            activeDays[act_name] = {};
        });
        data.forEach(act => {
            var act_type = act.act_type;
            if (!(act_type.name in activity_types)) {
                activity_types[act_type.name] = [];
            }
            activity_types[act_type.name].push(act);
            activeDays[act_type.name][new Date(act.day).getTime()] = true;
        });

        Object.keys(activity_types).forEach(act_name => {
            dropdown_data.push({label: act_name});
            marked_dates[act_name] = {};
            var curr_act_type = activity_types[act_name];

            curr_act_type.forEach((act, idx) => {
                var curr_ms = new Date(curr_act_type[idx].day).getTime();
                marked_dates[act.act_type.name][act.day] = {
                    'color': act.was_done ? 'green' : 'red',
                    'startingDay': is_start_day(curr_ms, act_name),
                    'endingDay': is_end_day(curr_ms, act_name),
                };
            });
        });
        setMarkedDates(marked_dates);
    }

    if (use_server) {
        useEffect(() => {
            check_fetch('activities/', 'GET', props.authToken)
            .then(json => {
                initialize_data(json);
                setLoading(false);
            })
            .catch(error => console.error(error));
        }, []);
    }
    else {
        useEffect(() => {
            initialize_data(DATA);
            setLoading(false);
        }, []);
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {isLoading ? <ActivityIndicator /> : (
                <Calendar
                    markedDates={markedDates[props.currActType]}
                    markingType={'period'}
                    onDayPress={(pressed_day) => {
                        let currActType = props.currActType;
                        var marked_dates = JSON.parse(JSON.stringify(markedDates));
                        var curr_day_info = marked_dates[currActType][pressed_day.dateString]
                        var curr_color = curr_day_info == undefined ? 'white' : curr_day_info.color;
                        var next_color;
                        var pressed_day_obj = new Date(pressed_day.dateString);
                        var pressed_day_ms = pressed_day_obj.getTime();
                        var prev_day_ms = Math.round(pressed_day_ms - msPerDay);
                        var next_day_ms = Math.round(pressed_day_ms + msPerDay);
                        var prev_day_isostr = new Date(prev_day_ms).toISOString().slice(0, 10);
                        var next_day_isostr = new Date(next_day_ms).toISOString().slice(0, 10);
                        var should_be_active;
                        var prev_day_state;
                        var next_day_state;
                        var post_action;

                        if (curr_color == 'white'){
                            next_color = 'green';
                            should_be_active = true;
                            prev_day_state = false;
                            next_day_state = false;
                            post_action = "was_done";

                        }
                        else if(curr_color == 'green'){
                            next_color = 'red';
                            should_be_active = true;
                            post_action = "not_done";
                        }
                        else if(curr_color == 'red'){
                            next_color = 'white';
                            should_be_active = false;
                            prev_day_state = true;
                            next_day_state = true;
                            post_action = "delete";
                        }
                        else {
                            console.error('Unhandled color');
                        }
                        daysToPost[currActType][pressed_day.dateString] = post_action;

                        if (is_day_active(prev_day_ms, currActType) && prev_day_state != undefined){
                            marked_dates[currActType][prev_day_isostr]['endingDay'] = prev_day_state;
                        }
                        if (is_day_active(next_day_ms, currActType) && next_day_state != undefined){
                            marked_dates[currActType][next_day_isostr]['startingDay'] = next_day_state;;
                        }
                        set_is_day_active(should_be_active, pressed_day_ms, currActType);
                        marked_dates[currActType][pressed_day.dateString] = {
                            'color': next_color,
                            'startingDay': is_start_day(pressed_day_ms, currActType),
                            'endingDay': is_end_day(pressed_day_ms, currActType),
                        };
                        setMarkedDates(marked_dates);
                    }}
                />
            )}
            <Text>Currently viewing activities for {props.currActType}</Text>
            <Button
            title={isLoading ? "" : "Submit"}
            onPress={() => {
                check_fetch('create_activities', 'POST', props.authToken, daysToPost)
                .catch(error => console.error(error));
            }}
            />
        </ScrollView>
    );
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

if (!use_server) {
    var DATA = [
        {
            "day": "2020-06-19",
            "was_done": true,
            "act_type": {
                "url": "http://localhost:8000/activity_types/2/",
                "name": "drank_alcohol",
                "user": "http://localhost:8000/users/1/"
            }
        },
        {
            "day": "2020-06-20",
            "was_done": true,
            "act_type": {
                "url": "http://localhost:8000/activity_types/1/",
                "name": "workout",
                "user": "http://localhost:8000/users/1/"
            }
        },
        {
            "day": "2020-06-20",
            "was_done": true,
            "act_type": {
                "url": "http://localhost:8000/activity_types/2/",
                "name": "drank_alcohol",
                "user": "http://localhost:8000/users/1/"
            }
        },
        {
            "day": "2020-06-21",
            "was_done": true,
            "act_type": {
                "url": "http://localhost:8000/activity_types/1/",
                "name": "workout",
                "user": "http://localhost:8000/users/1/"
            }
        },
        {
            "day": "2020-06-21",
            "was_done": true,
            "act_type": {
                "url": "http://localhost:8000/activity_types/2/",
                "name": "drank_alcohol",
                "user": "http://localhost:8000/users/1/"
            }
        },
        {
            "day": "2020-06-23",
            "was_done": true,
            "act_type": {
                "url": "http://localhost:8000/activity_types/1/",
                "name": "workout",
                "user": "http://localhost:8000/users/1/"
            }
        }
    ]
}

