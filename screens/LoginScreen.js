import React, { useState, setState} from 'react';
import {Text, View, Button, TextInput} from 'react-native';
import { connect } from 'react-redux';
import { signIn } from '../redux/actions';
import {check_fetch} from '../utils/utils';

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
            check_fetch('api/login', 'POST', '', {username: 'fredb', password: 'abcd'})
            .then(json => {
                if(json == undefined){
                    setFailed('Could not log in');
                }
                else {
                    dispatch(signIn(authToken=json.token));
                }
            })
            .catch(error => console.error(error));;
            }} />
      </View>
    );
})
