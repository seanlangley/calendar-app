import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { RectButton, ScrollView, FlatList } from 'react-native-gesture-handler';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

var __TEST__ = false;
var REST_URL;
if (!__TEST__) {
  var REST_URL = 'http://localhost:8000/activities';
}

export default function LinksScreen() {
  const [isLoading, setLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState({});

  function initialize_data(data) {
    var marked_dates = {};
    var activity_types = {};
    data.forEach(act => {
      if (!(act.name in activity_types)){
          activity_types[act.name] = [];
      }
      activity_types[act.name].push(act);
    });

    Object.keys(activity_types).forEach(act_name => {
      marked_dates[act_name] = {};
      var in_streak = false;
      var curr_act_type = activity_types[act_name];

      curr_act_type.forEach((act, idx) => {
        var is_start_day = false;
        var is_end_day = false;
        var color;
        var prev, curr, next;
        var daydiff;
        var msPerDay = 24 * 60 * 60 * 1000;
        if (idx == 0){
          is_start_day = true;
        }
        else if (idx == curr_act_type.length -1){
          is_end_day = true;
        }
        else {
          prev = new Date(curr_act_type[idx-1].day);
          curr = new Date(curr_act_type[idx].day);
          next = new Date(curr_act_type[idx+1].day);
          daydiff = (prev.getTime() - curr.getTime()) / msPerDay;
          if (Math.round(daydiff) != -1){
            is_start_day = true;
          }
          daydiff = (next.getTime() - curr.getTime()) / msPerDay;
          if (Math.round(daydiff) != 1){
            is_end_day = true;
          }
        }
        color = act.was_done ? 'green' : 'red';

        marked_dates[act.name][act.day] = {
          'color': color,
          'startingDay': is_start_day,
          'endingDay': is_end_day
        };
      });
    });

    setMarkedDates(marked_dates);
  }

if(__TEST__){
  useEffect(() => {
    initialize_data(DATA);
    setLoading(false);
  }, []);
}

else{
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
          markedDates={markedDates.workout}
          markingType={'period'}
        />
      )}

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
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
});

if (__TEST__) {
  var DATA = [
    {
      "day": "2020-06-10",
      "was_done": true,
      "user": "http://localhost:8000/users/1/",
      "name": "workout"
    },
    {
      "day": "2020-06-11",
      "was_done": true,
      "user": "http://localhost:8000/users/1/",
      "name": "workout"
    },
    {
      "day": "2020-06-12",
      "was_done": true,
      "user": "http://localhost:8000/users/1/",
      "name": "workout"
    },
    {
      "day": "2020-06-16",
      "was_done": true,
      "user": "http://localhost:8000/users/1/",
      "name": "workout"
    }
  ]
}
