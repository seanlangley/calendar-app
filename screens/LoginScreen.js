import React, { useState, setState} from 'react';
import {Text, View, Button, TextInput} from 'react-native';
import { connect } from 'react-redux';
import { signIn } from '../redux/actions';

let url = 'http://localhost:8000/api/login';

export default connect()(function LoginScreen( {store, dispatch} ){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    return (
      <View>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Sign in" onPress={() => {
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: username, password: password})
            })
            .then(response => response.json())
            .then(json => {
                console.log(json);
                dispatch(signIn(token=json.token));
            })
            .catch(error => console.error(error))
            }} />
      </View>
    );
})
