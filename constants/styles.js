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
        borderColor: '#000000',
        borderBottomWidth: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
});