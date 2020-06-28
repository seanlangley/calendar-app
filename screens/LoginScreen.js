import React, { useState, setState} from 'react';
import {Text, View, Button, TextInput} from 'react-native';
import { connect } from 'react-redux';
import { signIn } from '../redux/actions';

let url = 'http://localhost:8000/api/login';

export default connect()(function LoginScreen( { dispatch} ){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [failed, setFailed] = useState('');
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
        <Text style={{color: 'red'}}>{failed}</Text>
        <Button title="Sign in" onPress={() => {
            let request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: username, password: password}) 
            }
            var failed = false;
            fetch(url, request)
            .then(response => {
                if(response.status != 200){
                    failed = true;
                    setFailed('failed');
                }
                return response.json();
            })
            .then(json => {
                console.log(json);
                if(!failed){
                    dispatch(signIn(authToken=json.token));
                }
            })
            .catch(error => console.error(error))
            }} />
      </View>
    );
})
