import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button } from 'react-native';
import * as native from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import { mapStateToProps } from '../redux/react_funcs';
import { SwipeListView } from 'react-native-swipe-list-view';

var styles_g = require('../constants/styles');

export function HomeScreen(props: any) {
    const [newType, setNewType] = useState('');
    const [types, setTypes] = useState<string[]>([]);

    useEffect(() => {
        var next_types: string[] = [];
        if (props.actTypes != undefined) {
            Object.keys(props.actTypes).forEach((type_name) => {
                next_types.push(type_name);
            });
            setTypes(next_types);
        }
    }, [props.actTypes]);

    return (
        <View style={styles_g.container}>
            <native.TextInput
                style={styles_g.textBox}
                placeholder="Name"
                value={newType}
                onChangeText={setNewType}
            />
            <View style={styles_g.leftAlign}>
                <Button
                    title={"Submit New Activity"}
                    onPress={() => {
                        if (types.indexOf(newType) == -1 && newType.length > 0) {
                            props.dispatch(actions.addActType(newType));
                        }
                    }}
                />
            </View>
            <View style={styles.listContainer}>
                <SwipeListView
                    data={types}
                    keyExtractor={(item: string) => item}
                    rightOpenValue={-75}
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
                    renderHiddenItem={(data) => (
                        <View style={styles.rowBack}>
                            <Button
                                title={'Edit'}
                                onPress={() => {
                                    props.dispatch(actions.setActType(data.item));
                                    props.navigation.navigate('EditScreen');
                                }}
                            />
                        </View>
                    )}
                />
            </View>
        </View>
    );
}
export default connect(mapStateToProps, null)(HomeScreen);


const styles = StyleSheet.create({
    rowFront: {
        marginVertical: 8,
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        justifyContent: 'center',
        height: 50,
        borderRadius: 50,
    },
    rowBack: {
        borderRadius: 50,
        marginVertical: 8,
        height: 50,
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: 15,
        paddingRight: 5,
    },
    listContainer: {
        paddingTop: 10,
        flex: 1
    }
});
