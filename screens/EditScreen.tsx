import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as native from 'react-native';
import { mapStateToProps } from '../redux/react_funcs';
import * as actions from '../redux/actions';

export function EditScreen(props: any) {
    const [units, setUnits] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [deleteText, setDeleteText] = useState<string>("");
    const [yesText, setYesText] = useState<string>("");
    const [hasDefault, setHasDefault] = useState(false);

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
            <native.Text>
                {hasDefault ? "No data will default to not done" :
                    "No data will not be taken into account"}
            </native.Text>
            <native.Switch
                trackColor={{ false: "white", true: "#81b0ff" }}
                thumbColor={hasDefault ? "blue" : "white"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {
                    setHasDefault(!hasDefault);
                }}
                value={hasDefault}
            />
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