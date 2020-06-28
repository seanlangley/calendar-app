import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import { mapStateToProps } from '../redux/react_funcs';
import { check_fetch } from '../utils/utils';

function HomeScreen(props) {

    function initialize_data(act_types_list) {
        var month_chart_data = {};
        act_types_list.forEach(type_data => {
            var new_type_entry = [];
            var month_data = type_data['month_table'];
            month_data.forEach((month, idx) => {
                new_type_entry.push({ 'month': idx, 'ratio': month['Ratio'] });
            });
            month_chart_data[type_data.name] = new_type_entry;
        });
        props.dispatch(actions.setMonthChartData(month_chart_data));
    }

    useEffect(() => {
        if (props.loading) {
            check_fetch('analyze_activities', 'GET', props.authToken)
                .then(json => initialize_data(json))
                .catch(error => console.error(error))
        }
    });


    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                {props.loading == true ? <ActivityIndicator /> : (
                    <NameList
                        act_data={props.monthChartData}
                        navigation={props.navigation}
                        dispatch={props.dispatch}
                    />
                )}
                <View style={styles.getStartedContainer}>
                    <DevelopmentModeNotice />
                </View>
                <Button
                    title={"Sign out"}
                    onPress={() => {
                        props.dispatch(actions.signOut());
                    }}
                />
            </ScrollView>
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
