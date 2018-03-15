// ====================================================================================================
// IMPORTS
// --------------------------------------------------------------------------------
import { StackNavigator, NavigationActions } from 'react-navigation';
import { AsyncStorage } from 'react-native';

import { LoginScreen, HomeScreen, LanguageScreen, DailyInputScreen, ConfigurationScreen } from '../screens';
import { userActions } from '../redux'

// ====================================================================================================
// NAVIGATORS
// --------------------------------------------------------------------------------
const SignedOutNavigator = StackNavigator(
    {
        Login: {
            screen: LoginScreen,
        },
        Language: {
            screen: LanguageScreen,
        },
        Configuration: {
            screen: ConfigurationScreen,
        }
    },
    {
        navigationOptions: ({ navigation }) => {
            const params = navigation.state.params || {};

            return ({
                title: params.title,
                headerStyle: { backgroundColor: '#333' },
                headerTintColor: '#cfcfcf',
                headerRight: params.navigationRightElement,
                headerLeft: params.navigationLeftElement
            });
        }
    }
);

const SignedInNavigator = StackNavigator(
    {
        Home: {
            screen: HomeScreen
        },
        Language: {
            screen: LanguageScreen
        },
        DailyInput: {
            screen: DailyInputScreen
        }
    },
    {
        navigationOptions: ({ navigation }) => {
            const params = navigation.state.params || {};

            return ({
                title: params.title,
                headerStyle: { backgroundColor: '#333' },
                headerTintColor: '#cfcfcf',
                headerRight: params.navigationRightElement,
                headerLeft: params.navigationLeftElement
            });
        }
    }
);

// ====================================================================================================
// NAVITATION CREATION FUNTION
// --------------------------------------------------------------------------------
const createRootNavigator = function () {
    return (StackNavigator(
        {
            SignedOut: {
                screen: SignedOutNavigator
            },
            SignedIn: {
                screen: SignedInNavigator,
            },
        },
        {
            index: 0,
            initialRouteName: 'SignedOut',
            headerMode: 'none',
            mode: 'modal',
            navigationOptions: {
                gesturesEnabled: false
            }
        }
    ));
}

export default class Navigator {

    static rootNavigator = null;
    static rootReducer = null;

    static createRootNavigation() {
        if (Navigator.rootNavigator) {
            return;
        }

        Navigator.rootNavigator = createRootNavigator();

        // Generate reducer
        const initialState = Navigator.rootNavigator.router.getStateForAction(NavigationActions.init());
        Navigator.rootReducer = (state = initialState, action) => {
            const nextState = Navigator.rootNavigator.router.getStateForAction(action, state);
            return nextState || state;
        }
    }

    static getRootNavigator() {
        if (Navigator.rootNavigator == null) {
            Navigator.createRootNavigation();
        }
        return Navigator.rootNavigator;
    }

    static getRootReducer() {
        if (Navigator.rootNavigator == null) {
            Navigator.createRootNavigation();
        }
        return Navigator.rootReducer;
    }

}