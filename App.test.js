import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { cleanup, fireEvent, render } from 'react-native-testing-library';
import EditScreen from './screens/EditScreen';
import HomeScreen from './screens/HomeScreen';
import LinksScreen from './screens/LinksScreen'
import rootReducer from './redux/reducers';
import { createStore } from 'redux';
import * as actions from './redux/actions';

const store = createStore(rootReducer);
beforeEach(() => {
    store.dispatch(actions.setActTree(test_state.actTypes));
    store.dispatch(actions.setActType(test_state.currActType));
});

function make_component(component){
    return (
        <Provider store={store}>
            {component}
        </Provider>
    )
}

test('EditScreen renders correctly',  () => {
    const component = make_component(<EditScreen/>);
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
});

test('HomeScreen renders correctly',  () => {
    const component = make_component(<HomeScreen/>)
    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
});

test('CalendarScreen renders correctly',  () => {
    const component = make_component(<LinksScreen/>)
    const tree = renderer.create(component) .toJSON();
    expect(tree).toMatchSnapshot();
});

let test_state = {
    "currActType": "Running",
    "actTypes": {
        "Running": {
            "name": "Running",
            "acts": {
                "2020-07-10": {
                    "was_done": false
                },
                "2020-07-26": {
                    "was_done": true
                },
                "2020-07-24": {
                    "was_done": false
                },
                "2020-07-18": {
                    "was_done": true
                },
                "2020-07-04": {
                    "was_done": true
                },
                "2020-06-09": {
                    "was_done": true
                },
                "2020-06-02": {
                    "was_done": true
                },
                "2020-06-03": {
                    "was_done": true
                },
                "2020-06-10": {
                    "was_done": true
                },
                "2020-06-24": {
                    "was_done": true
                },
                "2020-06-23": {
                    "was_done": true
                },
                "2020-06-16": {
                    "was_done": true
                },
                "2020-06-17": {
                    "was_done": true
                },
                "2020-06-18": {
                    "was_done": true
                },
                "2020-06-25": {
                    "was_done": true
                },
                "2020-07-31": {
                    "was_done": true
                },
                "2020-07-07": {
                    "was_done": false
                },
                "2020-07-30": {
                    "was_done": true
                },
                "2020-07-05": {
                    "was_done": true
                },
                "2020-07-19": {
                    "was_done": true
                },
                "2020-07-12": {
                    "was_done": true
                },
                "2020-07-27": {
                    "was_done": true
                },
                "2020-07-13": {
                    "was_done": true
                },
                "2020-08-01": {
                    "was_done": true
                },
                "2020-08-07": {
                    "was_done": false
                },
                "2020-08-02": {
                    "was_done": false
                },
                "2020-07-28": {
                    "was_done": true
                },
                "2020-07-29": {
                    "was_done": true
                },
                "2020-07-20": {
                    "was_done": true
                },
                "2020-07-08": {
                    "was_done": false
                },
                "2020-07-01": {
                    "was_done": true
                },
                "2020-07-06": {
                    "was_done": true
                }
            }
        },
        "Reading": {
            "name": "Reading",
            "units": "Pages",
            "acts": {
                "2020-07-08": {
                    "was_done": true
                },
                "2020-07-09": {
                    "was_done": true
                },
                "2020-07-07": {
                    "was_done": false
                },
                "2020-07-10": {
                    "was_done": true
                },
                "2020-07-11": {
                    "was_done": true
                },
                "2020-07-06": {
                    "was_done": false
                },
                "2020-06-10": {
                    "was_done": true
                },
                "2020-07-05": {
                    "was_done": true
                },
                "2020-07-13": {
                    "was_done": true
                },
                "2020-07-14": {
                    "was_done": true
                },
                "2020-07-01": {
                    "was_done": true
                },
                "2020-07-02": {
                    "was_done": true
                },
                "2020-07-17": {
                    "was_done": true
                },
                "2020-07-18": {
                    "was_done": true
                },
                "2020-07-16": {
                    "was_done": true
                }
            }
        },
        "hiking": {
            "name": "hiking",
            "acts": {
                "2020-07-07": {
                    "was_done": true,
                    "number_done": 0
                }
            }
        },
        "hunting": {
            "name": "hunting",
            "acts": {
                "2020-07-07": {
                    "was_done": true,
                    "number_done": 0
                }
            }
        },
        "biking": {
            "name": "biking",
            "acts": {
                "2020-07-07": {
                    "was_done": true,
                    "number_done": 0
                }
            }
        },
        "swimming": {
            "name": "swimming",
            "acts": {
                "2020-07-08": {
                    "was_done": true,
                    "number_done": 0
                },
                "2020-07-09": {
                    "was_done": false,
                    "number_done": 0
                },
                "2020-07-06": {
                    "was_done": false,
                    "number_done": 0
                },
                "2020-07-05": {
                    "was_done": false,
                    "number_done": 0
                }
            }
        },
        "jogging": {
            "name": "jogging",
            "acts": {
                "2020-07-07": {
                    "was_done": true,
                    "number_done": 3
                },
                "2020-07-08": {
                    "was_done": false,
                    "number_done": 0
                }
            }
        }
    }
}