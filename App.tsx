import { NavigationContainer } from '@react-navigation/native';
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { Provider, connect } from 'react-redux';

import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import HomeScreen from './screens/HomeScreen';
import EditScreen from './screens/EditScreen';
import rootReducer, {act_type_t, act_type_dict_t} from './redux/reducers';
import AsyncStorage from '@react-native-community/async-storage';
import * as actions from './redux/actions';


const loggerMiddleware = createLogger()

const Stack = createStackNavigator();
const store = createStore(rootReducer,
    applyMiddleware(
//        loggerMiddleware // neat middleware that logs actions
    )
);

const storeData = async (value: act_type_dict_t) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('@act_tree', jsonValue);
        console.log('data saved to file');
    } catch (e) {
        console.error(e);
    }
}

const getData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@act_tree');
        console.log('data read from file');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error(e);
    }
}

export default function App() {
    const isLoadingComplete = useCachedResources();
    const [currActType, setCurrType] = useState("");
    const [isLoading, setLoading] = useState(true);
    var prevTree: object = store.getState().actTypes;
    store.subscribe(() => setCurrType(store.getState().currActType));
    store.subscribe(() => {
        let nextTree: act_type_dict_t = store.getState().actTypes;
        if (JSON.stringify(nextTree) !== JSON.stringify(prevTree)) {
            storeData(nextTree);
            prevTree = nextTree;
        }
    });

    useEffect(() => {
        if (isLoading) {
            getData()
                .then((actTree) => store.dispatch(actions.setActTree(actTree)))
                .catch((e) => console.error(e))
                .then(() => setLoading(false));
        }
    });

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            <Provider store={store}>
                <View style={styles.container}>
                    {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
                    <NavigationContainer linking={LinkingConfiguration}>
                        <Stack.Navigator>
                            <Stack.Screen name="Home" component={HomeScreen} />
                            <Stack.Screen name="TypeDetail" component={BottomTabNavigator}
                                options={{ title: currActType }}
                            />
                            <Stack.Screen name="EditScreen" component={EditScreen}
                                options={{ title: "Currently editing " + currActType }}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </View>
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
