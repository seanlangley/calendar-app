import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button } from 'react-native';
import * as native from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import { mapStateToProps } from '../redux/react_funcs';
import { check_fetch } from '../utils/utils';

function HomeScreen(props) {
    const [newType, setNewType] = useState('');

    useEffect(() => {
        if (props.chartData == null) {
            props.dispatch(actions.fetchChartData(props.authToken))
            .then(console.log('got chart data'));
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
            <native.TextInput
                placeholder="New Acvitity Name" 
                value={newType}
                onChangeText={setNewType}
            />
            <Button
                title={"Submit New Activity"} 
                onPress={() => {
                    check_fetch('api/new_act', 'POST', props.authToken, {name: newType});
                    props.dispatch(actions.setChartData(null));
                }}
            />
            <Button
                title={"Sign out"}
                onPress={() => {
                    props.dispatch(actions.signOut());
                }}
            />
            <View style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.getStartedContainer}>
                    <DevelopmentModeNotice />
                </View>
            </View>
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
