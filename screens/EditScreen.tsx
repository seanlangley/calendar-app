import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as native from 'react-native';
import { View } from 'react-native';
import { mapStateToProps } from '../redux/react_funcs';
import * as actions from '../redux/actions';

let styles_g = require('../constants/styles');

export function EditScreen(props: any) {
    const [units, setUnits] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [deleteText, setDeleteText] = useState<string>("");
    const [yesText, setYesText] = useState<string>("");

    return (
        <native.View>
            <native.TextInput
                style={styles.textBox}
                placeholder="Units"
                value={units}
                onChangeText={setUnits}
            />
            <native.TextInput
                style={styles.textBox}
                placeholder="New Name"
                value={name}
                onChangeText={setName}
            />
            <View style={styles_g.leftAlign}>
                <native.Button
                    title={"Submit"}
                    onPress={() => {
                        if (name != "" || units != "") {
                            props.dispatch(actions.editActType(name, props.currActType, units));
                            props.dispatch(actions.setActType(name));
                            props.navigation.goBack();
                        }
                    }}
                />
                <native.Button
                    title={"Delete"}
                    onPress={() => {
                        setDeleteText("This action is permament. Are you sure?");
                        setYesText("Yes");

                    }}
                />
                <native.Text style={styles.delete_text}>{deleteText}</native.Text>
                <native.Button
                    title={yesText}
                    color={'red'}
                    onPress={() => {
                        props.dispatch(actions.deleteActType(props.currActType))
                        props.navigation.goBack();
                    }}
                />
            </View>
        </native.View>
    )
}

export default connect(mapStateToProps, null)(EditScreen);

const styles = native.StyleSheet.create({
    delete_text: {
        color: 'red',
        fontWeight: 'bold',
    },
    textBox: {
        marginVertical: 4,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
    },
})