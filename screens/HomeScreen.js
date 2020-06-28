import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button } from 'react-native';
import * as native from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import { mapStateToProps } from '../redux/react_funcs';
import { check_fetch } from '../utils/utils';

function HomeScreen(props) {

    function initialize_data(act_types_list) {
        var chart_data = {};
        act_types_list.forEach(type_data => {
            chart_data[type_data.name] = {};
            var month_entry = [];
            var week_entry = [];
            var month_data = type_data['month_table'];
            var week_data = type_data['week_table'];
            month_data.forEach((month, idx) => {
                month_entry.push({ 'month': idx, 'ratio': month['Ratio'] });
            });
            week_data.forEach((weekday, idx) => {
                week_entry.push({'weekday': idx, 'ratio': weekday['Ratio']});
            });
            chart_data[type_data.name]['month'] = month_entry;
            chart_data[type_data.name]['week'] = week_entry;
        });
        props.dispatch(actions.setChartData(chart_data));
    }

    useEffect(() => {
        if (props.chartData == null) {
            check_fetch('analyze_activities', 'GET', props.authToken)
                .then(json => initialize_data(json))
                .catch(error => console.error(error))
        }
    });


    return (
        <View style={styles.container}>
                {props.chartData == null ? <ActivityIndicator/> : (
                    <native.FlatList
                    data={Object.keys(props.chartData)}
                    keyExtractor={item => item}
                    renderItem={({ item }) =>
                        <Button
                            title={item}
                            onPress={() => {
                                props.dispatch(actions.setActType(item));
                                props.navigation.navigate('TypeDetail');
                            }}
                        />}
                />
                )}
            <View style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.getStartedContainer}>
                    <DevelopmentModeNotice />
                </View>
                <Button
                    title={"Sign out"}
                    onPress={() => {
                        props.dispatch(actions.signOut());
                    }}
                />
            </View>
        </View>
    );
}


export default connect(mapStateToProps, null)(HomeScreen);

function NameList(props) {
    var type_buttons = [];
    Object.keys(props.act_data).forEach(act_name => {
        type_buttons.push((
            <Button
                title={act_name}
                key={act_name}
                onPress={() => {
                    props.dispatch(actions.setActType(act_name));
                    props.navigation.navigate('TypeDetail');
                }}
            />));
    });
    return (type_buttons);
}

function DevelopmentModeNotice() {
    if (__DEV__) {
        return (
            <Text style={styles.developmentModeText}>
                Development mode is enabled: your app will be slower but you can use useful development
                tools.
            </Text>
        );
    } else {
        return (
            <Text style={styles.developmentModeText}>
                You are not in development mode: your app will run at full speed.
            </Text>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    developmentModeText: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
    },
    contentContainer: {
        paddingTop: 30,
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
});
