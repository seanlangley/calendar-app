import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button } from 'react-native';
import * as native from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import { mapStateToProps } from '../redux/react_funcs';
import { check_fetch } from '../utils/utils';
import { SwipeListView } from 'react-native-swipe-list-view';


function HomeScreen(props) {
    const [newType, setNewType] = useState('');
    const [types, setTypes] = useState();

    useEffect(() => {
        var next_types = [];
        Object.keys(props.actTypes).forEach((type_name) => {
            next_types.push(type_name);
        });
        setTypes(next_types);
    }, [props.actTypes]);

    return (
        <View style={styles.container}>
            <native.TextInput
                placeholder="New Acvitity Name"
                value={newType}
                onChangeText={setNewType}
            />
            <Button
                title={"Submit New Activity"}
                onPress={() => {
                    if (types.indexOf(newType) == -1 && newType.length > 0) {
                        props.dispatch(actions.addActType(newType));
                    }
                }}
            />
            <SwipeListView
                data={types}
                keyExtractor={item => item}
                rightOpenValue={-150}
                disableRightSwipe={true}
                renderItem={({ item }) =>
                    <View style={styles.rowFront}>
                        <Button
                            title={item}
                            onPress={() => {
                                props.dispatch(actions.setActType(item));
                                props.navigation.navigate('TypeDetail');
                            }}
                        />
                    </View>
                }
                renderHiddenItem={(data, rowMap) => (
                    <View style={styles.rowBack}>
                        <Button
                            title={'Edit'}
                            onPress={() => {
                            }}
                        />
                        <Button
                            title={'Delete'}
                            onPress={() => {
                            }}
                        />
                    </View>
                )}
            />
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
    rowFront: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: 15,
        paddingRight: 5
    },
});
