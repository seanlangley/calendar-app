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
    marked_dates = {};
    data.forEach(entry => {
      periods = [];
      if (entry.was_done) {
        periods.push({ color: 'green' });
      }
      else {
        periods.push({color: 'red'});
      }
      marked_dates[entry.day] = { periods: periods };
    });
    setMarkedDates(marked_dates);
  }

if(__TEST__){
  useEffect(() => {
    initialize_data(DATA);
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
          markedDates={markedDates}
          markingType={'multi-period'}
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
