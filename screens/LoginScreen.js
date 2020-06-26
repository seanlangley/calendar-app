import React, { useState, setState} from 'react';

export default function LoginScreen( {navigation} ){
    const [uname, setUname] = useState("");
    const [pwd, setPwd] = useState("");
    return (
        <View>
            <TextInput
                value={"Enter username"}
            />
            <TextInput
                value={"Enter password"}
            />
            <Button
                title={"Sign in"}
                onPress={() => navigation.navigate('HomeScreen')}
            />
        </View>
    );
}