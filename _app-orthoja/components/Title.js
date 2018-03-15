/* @description Title for the Dr. Pili Application.
 * @author Eric Crowell
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class Title extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    {this.props.title}
                </Text>
                <Text style={styles.subtitle}>
                    {this.props.subtitle}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    title: {
      fontFamily: 'Qwigley-Regular',
      fontSize: 80,
      color: '#FFFFFF',
      textAlign: 'center'
    },
    subtitle: {
      fontSize: 18,
      color: '#FFFFFF',
      opacity: 0.8,
      textAlign: 'center',
      padding: 10
    }
});