import React, { useState, setState} from 'react';
import {Text, View, Button, TextInput} from 'react-native';
import { connect } from 'react-redux';
import { signIn } from '../reducers/recuders';


 function LoginScreen( {dispatch}, {navigation} ){
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
        <Button title="Sign in" onPress={() => dispatch(signIn())} />
    
      </View>
    );
}

export default connect()(LoginScreen);