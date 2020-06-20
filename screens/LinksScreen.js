import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { RectButton, ScrollView, FlatList } from 'react-native-gesture-handler';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import DropDownPicker from 'react-native-dropdown-picker';

var __TEST__ = false;
var REST_URL;
if (!__TEST__) {
    var REST_URL = 'http://localhost:8000/activities';
}
let msPerDay = 24 * 60 * 60 * 1000;

export default function LinksScreen() {
    const [isLoading, setLoading] = useState(true);
    const [markedDates, setMarkedDates] = useState({});
    const [dropdownData, setDropdownData] = useState({});
    const [currActType, setCurrActType] = useState("workout");
    const [activeDays, setActiveDays] = useState({});

    function initialize_data(data) {
        var marked_dates = {};
        var dropdown_data = [];
        var activity_types = {};
        var active_days = {};

        data.forEach(act => {
            var act_type = act.act_type;
            if (!(act_type.name in activity_types)) {
                activity_types[act_type.name] = [];
                active_days[act_type.name] = [];
            }
            activity_types[act_type.name].push(act);
            active_days[act_type.name].push(new Date(act.day).getTime());
        });

        Object.keys(activity_types).forEach(act_name => {
            dropdown_data.push({label: act_name});
            marked_dates[act_name] = {};
            var curr_act_type = activity_types[act_name];

            function is_start_day(day){
                prev = Math.round(day - msPerDay);
                if (active_days[act_name].indexOf(prev) == -1){
                    return true;
                }
                return false;
            }
            function is_end_day(day){
                var next = Math.round(day + msPerDay);
                if (active_days[act_name].indexOf(next) == -1){
                    return true;
                }
                return false;
            }

            curr_act_type.forEach((act, idx) => {
                var curr = new Date(curr_act_type[idx].day).getTime();
                marked_dates[act.act_type.name][act.day] = {
                    'color': act.was_done ? 'green' : 'red',
                    'startingDay': is_start_day(curr),
                    'endingDay': is_end_day(curr),
                };
            });
        });
        setMarkedDates(marked_dates);
        setDropdownData(dropdown_data);
    }

    if (__TEST__) {
        useEffect(() => {
            initialize_data(DATA);
            setLoading(false);
        }, []);
    }

    else {
        useEffect(() => {
            fetch(REST_URL)
                .then((response) => response.json())
                .then((json) => initialize_data(json))
                .catch((error) => console.error(error))
                .finally(() => setLoading(false));
        }, []);
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {isLoading ? <ActivityIndicator /> : (
                <Calendar
                    markedDates={markedDates[currActType]}
                    markingType={'period'}
                    onDayPress={(day) => {
                        function transition_color(curr_color){
                            switch(curr_color){
                                case 'white': return 'green';
                                case 'green': return 'red';
                                case 'red': return 'white'
                                default: console.error("Unhandled color");
                            }
                        }
                        var marked_dates = JSON.parse(JSON.stringify(markedDates));
                        var curr_day = marked_dates['workout'][day.dateString]
                        if (curr_day == undefined){
                            marked_dates['workout'][day.dateString] = {'color': 'green'};
                        }
                        else{
                            var new_color = transition_color(curr_day.color);
                            marked_dates['workout'][day.dateString].color = new_color;
                        }
                        setMarkedDates(marked_dates);
                    }}
                />
            )}
            {isLoading ? <ActivityIndicator /> : (
                <DropDownPicker
                    items={dropdownData}
                    onChangeItem={item => setCurrActType(item.label)}
                />
            )}
            <Button
            title={isLoading ? "" : "Submit"}
            onPress={() => {
                fetch('http://localhost:8000/new_act_app', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: {
                        hello: 'world'
                    }
                });
            }}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    contentContainer: {
        paddingTop: 15,
    },
});

if (__TEST__) {
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

