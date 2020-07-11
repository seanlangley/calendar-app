'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
    leftAlign: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textBox: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
    },
});