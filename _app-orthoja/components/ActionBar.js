import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { StyleSheet, View, Text } from 'react-native';

export default class ActionBar extends Component {

    static propTypes = {
        title: PropTypes.string
    }

    static defaultProps = {
        title: 'Unknown Screen'
    }

    render() {

        const title = this.props.title;

        return (
            <View style={styles.container}>
                <Text style={styles.text}>{title}</Text>
                <View style={styles.languageContainer}>
                    {this.props.children}
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#333'
    },
    text: {
        color: "#cfcfcf",
        fontSize: 16,
    },
    languageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});