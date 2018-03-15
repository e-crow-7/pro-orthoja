// ====================================================================================================
// IMPORTS
// --------------------------------------------------------------------------------
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { StyleSheet, View, Button, Text, TouchableHighlight } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

// Associates further data with a language code.
const languageCodeData = require('../locale/locale-code-data.json');

// ====================================================================================================
// COMPONENT
// --------------------------------------------------------------------------------
/** 
 * Properties:
 * 
 *    activeLanguage: object
 *       Object containing information about the active language.
 */
export default class LogoutButton extends Component {

    static propTypes = {
        onPress: PropTypes.func,
        disabled: PropTypes.bool
    }

    static defaultProps = {
        onPress: () => {},
        disabled: false
    }

    constructor() {
        super();
    }

    render() {

        const activeLanguage = this.props.activeLanguage;
        const disabled = this.props.disabled;

        return(
            <TouchableHighlight onPress={() => {this.props.onPress()}} disabled={disabled}>
                <View style={disabled ? styles.containerDisabled : styles.container}>
                    <Icon name="sign-out" size={30} color="#cfcfcf" />
                </View>
            </TouchableHighlight>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{scaleX: -1}],
        paddingLeft: 5,
        paddingRight: 5
    },
    containerDisabled: {
        flexDirection: 'row',
        alignItems: 'center',
        opacity: 0.5,
        transform: [{scaleX: -1}],
        paddingLeft: 5,
        paddingRight: 5,
    },
});