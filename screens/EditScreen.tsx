import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as native from 'react-native';
import { mapStateToProps } from '../redux/react_funcs';
import * as actions from '../redux/actions';

function EditScreen(props: any) {
    const [units, setUnits] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [deleteText, setDeleteText] = useState<string>("");
    const [yesText, setYesText] = useState<string>("");

    return (
        <native.View>
            <native.TextInput
                placeholder="Units to use"
                value={units}
                onChangeText={setUnits}
            />
            <native.TextInput
                placeholder="New Name"
                value={name}
                onChangeText={setName}
            />
            <native.Button
                title={"Submit"}
                onPress={() => {
                    if (name != "") {
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
            <native.Text>{deleteText}</native.Text>
            <native.Button
                title={yesText}
                onPress={() => {
                    props.dispatch(actions.deleteActType(props.currActType))
                    props.navigation.goBack();
                }}
            />


        </native.View>
    )
}

export default connect(mapStateToProps, null)(EditScreen);