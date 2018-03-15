/**
 * Orthoja Application.
 * @description Personal Orthopedic Journaling Application
 *
 * @author Eric Crowell
 * @version 0.0.0
 */

// ====================================================================================================
// IMPORTS
// --------------------------------------------------------------------------------
import React, { Component } from 'react';
import { Platform, StyleSheet, View, StatusBar, Modal } from 'react-native';

// store
import { store } from './redux';
// React/Redux provider
import { Provider, connect } from 'react-redux'
// Locale
import { initializeLocale } from "./locale";

// Navigational Objects
import { addNavigationHelpers } from 'react-navigation'
import Navigator from './navigation/Navigation';

// Application configuration.
import { Configuration } from "./configuration";

// Initialize locale settings
initializeLocale();

// ====================================================================================================
// MAIN APPLICATION COMPONENT
// --------------------------------------------------------------------------------
@connect((store) => ({
  navigation: store.navigation
}))
class AppWithNavigation extends Component {
  render() {
    const dispatch = this.props.dispatch;
    const navigation = this.props.navigation;
    const addListener = () => { };
    const navigationHelper = addNavigationHelpers({ dispatch: dispatch, state: navigation, addListener });

    const NavigatorObject = Navigator.getRootNavigator();

    return (
      <NavigatorObject navigation={navigationHelper} />
    );
  }
}

export default class App extends Component {

  constructor(props) {
    super(props);

    this.NavigationElement = (<AppWithNavigation />);

    this.state = {
      isConfigurationLoaded: false
    }

  }

  componentWillMount() {
    // Initialize the app configuration.
    Configuration.initialize(() => {
      this.setState({
        isConfigurationLoaded: true
      })
    });
  }

  render() {

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <StatusBar hidden={false} barStyle="light-content" />
          {this.state.isConfigurationLoaded ? this.NavigationElement : false}
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#146BBE'
  }
});
