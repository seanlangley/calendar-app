'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
    leftAlign: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    textBox: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
    },
});