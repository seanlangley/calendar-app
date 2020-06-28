import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { signOut, setActType } from '../redux/actions';
import { mapStateToProps } from '../redux/react_funcs';
import { check_fetch } from '../utils/utils';

let url = 'http://localhost:8000/analyze_activities'

function NameList(props) {
    var type_buttons = [];
    props.act_data.forEach(act_types_list => {
        var act_name = act_types_list.name;
        type_buttons.push((
            <Button
                title={act_name}
                key={act_name}
                onPress={() => {
                    props.dispatch(setActType(act_name));
                    props.navigation.navigate('TypeDetail', {
                        'act_data': act_types_list
                    });
                }}
            />));
    });
    return (type_buttons);
}

function HomeScreen(props) {
    const [actData, setActData] = useState();
    const [isLoading, setLoading] = useState(true);

    function initialize_data(act_types_list) {
        var view_month_data = [];
        act_types_list.forEach(type_data => {
            var new_type_entry = { 'name': type_data['name'], 'data': [] };
            var month_data = type_data['month_table'];
            month_data.forEach((month, idx) => {
                new_type_entry['data'].push({ 'month': idx, 'ratio': month['Ratio'] });
            });
            view_month_data.push(new_type_entry);
        });

        setActData(view_month_data);
    }

    useEffect(() => {
        if (isLoading) {
            check_fetch('analyze_activities', 'GET', props.authToken)
                .then(json => initialize_data(json))
                .catch(error => console.error(error))
                .finally(() => setLoading(false));
        }
    });


    return (
        <View style={styles.container}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                {isLoading ? <ActivityIndicator /> : (
                    <NameList
                        act_data={actData}
                        navigation={props.navigation}
                        dispatch={props.dispatch}
                    />
                )}
                <Button
                    title={"Refresh"}
                    onPress={() => setLoading(true)}
                />

                <View style={styles.getStartedContainer}>
                    <DevelopmentModeNotice />
                </View>
                <Button
                    title={"Sign out"}
                    onPress={() => {
                        props.dispatch(signOut());
                    }}
                />
            </ScrollView>
        </View>
    );
}


export default connect(mapStateToProps, null)(HomeScreen);

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
