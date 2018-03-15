import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View, TextInput, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';

const keyboardAvoidingViewProps = Platform.select({
    ios: {behavior: 'padding', keyboardVerticalOffset: 65},
    android: {}
})

export default class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        }

        this.submitForm = this.submitForm.bind(this);
    }

    static propTypes = {
        translator: PropTypes.func.isRequired,
        onSubmit: PropTypes.func,
        infoContent: PropTypes.element,
        infoContentStyle: PropTypes.object,
        disabled: PropTypes.bool
    }

    static defaultProps = {
        onSubmit: () => {},
        infoContent: false,
        infoContentStyle: {},
        disabled: false
    }

    submitForm() {
        // the onsubmit property will pass in the state containing the username and password
        this.props.onSubmit({...this.state});
    }

    /** Main rendering method.
    */
    render() {

        const translate = this.props.translator;
        const infoContent = this.props.infoContent;
        const infoContentStyle = Object.assign( {}, StyleSheet.flatten(styles.title), this.props.infoContentStyle);
        const disabled = this.props.disabled;

        return (
            <KeyboardAvoidingView {...keyboardAvoidingViewProps}>
                <View style={styles.container}>
                    <View style={ infoContentStyle } >{infoContent}</View>

                    {/* Username */}
                    <TextInput
                        style={disabled ? styles.textInputDisabled : styles.textInput}
                        placeholder={translate('login.username')}
                        placeholderTextColor={"#777"}
                        returnKeyType="next"
                        keyboardType="email-address"
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        editable={!disabled}
                        onChangeText={(text) => {this.setState({username: text})}}
                        onSubmitEditing={() => {this.refs.PasswordTextInput.focus()}}
                        value={this.state.username}
                    />

                    {/* Password */}
                    <TextInput
                        ref='PasswordTextInput'
                        style={disabled ? styles.textInputDisabled : styles.textInput}
                        placeholder={translate('login.password')}
                        placeholderTextColor={"#777"}
                        returnKeyType="go"
                        keyboardType="default"
                        autoCorrect={false}
                        editable={!disabled}
                        onChangeText={(text) => {this.setState({password: text})}}
                        onSubmitEditing={this.submitForm}
                        secureTextEntry
                        value={this.state.password}
                    />
                    <TouchableOpacity style={disabled ? styles.buttonContainerDisabled : styles.buttonContainer} onPress={this.submitForm} disabled={disabled}>
                        <Text style={disabled ? styles.buttonTextDisabled : styles.buttonText}>{translate('login.login')}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        paddingRight: 10
    },
    title: {
        margin: 5,
    },
    textInput: {
        height: 36,
        margin: 5,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#ffffffaa',
        color: "#222"
    },
    textInputDisabled: {
        height: 36,
        margin: 5,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#aaaaaa88',
        color: "#000"
    },
    buttonContainer: {
        margin: 5,
        padding: 10,
        backgroundColor: "#00000088"
    },
    buttonContainerDisabled: {
        margin: 5,
        padding: 10,
        backgroundColor: "#00000044"
    },
    buttonText: {
        textAlign: "center",
        color: "#cfcfcf",
        fontSize: 18,
        fontWeight: "bold"
    },
    buttonTextDisabled: {
        textAlign: "center",
        color: "#cfcfcf88",
        fontSize: 18,
        fontWeight: "bold"
    }
});
