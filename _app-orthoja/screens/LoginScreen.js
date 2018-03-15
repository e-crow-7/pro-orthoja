// ====================================================================================================
// IMPORTS
// --------------------------------------------------------------------------------
import React, { Component } from 'react';
import { Dimensions, StyleSheet, Keyboard, View, Text, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as Progress from 'react-native-progress';

import { Configuration } from "../configuration";

import { ActionBar, LoginForm, SetLocaleButton, Title } from '../components';

import { userActions, batchActions } from '../redux'

// ====================================================================================================
// COMPONENT
// --------------------------------------------------------------------------------
@connect(
    (store) => ({
        translate: getTranslate(store.locale),
        activeLanguage: getActiveLanguage(store.locale),
        batchStatus: store.batch.status,
        batchError: store.batch.error,
        userId: store.user.id,
        userUsername: store.user.username,
        userError: store.user.error,
        navigationIndex: store.navigation.index
    }),
    (dispatcher) => ({
        loginUser: (username, password) => (dispatcher(userActions.userLogin(username, password)))
        //saveUser: (sessionId, username) => (dispatcher(userActions.userSaveSessionInformation(sessionId, username)))
    })
)
export default class LoginScreen extends Component {

    constructor() {
        super();

        this.state = {
            error: {
                code: 0
            }
        }

        this.getNavigationRightElement = this.getNavigationRightElement.bind(this);
        this.getProgressOverlayElement = this.getProgressOverlayElement.bind(this);
        this.getInfoContentElement = this.getInfoContentElement.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    componentWillMount() {
        this.props.navigation.setParams({
            title: this.props.translate('screens.login'),
            navigationRightElement: this.getNavigationRightElement(this.props)
        });
    }

    /** REACT.JS Lifecycle: When the components properties update. 
    */
    componentWillReceiveProps(nextProps) {

        // Navigate once a change in the user Id has been found
        if (!this.props.userId && nextProps.userId !== this.props.userId) {
            if(this.props.navigationIndex > 0){
                this.props.navigation.goBack(null);
            } else {
                this.props.navigation.navigate('SignedIn');
            }
            return;
        }

        if (nextProps.batchStatus === batchActions.ENUM_STATUS.PENDING) {
            this.setState({ isProgressDisplayed: true })
        }

        // Ensure the language code has changed before updating the navigation properties.
        if (
            (nextProps.activeLanguage.code != this.props.activeLanguage.code) ||
            (nextProps.batchStatus != this.props.batchStatus)
        ) {
            this.props.navigation.setParams({
                title: nextProps.translate('screens.login'),
                navigationRightElement: this.getNavigationRightElement(nextProps),
            });
        }
    }

    submitForm({ username, password }) {
        // Special login cases.
        if(username === 'app:settings' && !password) {
            this.props.navigation.navigate(
                'Configuration',
                {
                    title: 'Configuration',
                    arguments: {
                        path: '',
                        data: Configuration.data
                    }
                }
            );
            return;
        }

        // Normal login case.
        this.props.loginUser(username, password)
        .then(response => {
            console.log('AXIOS RESPONSE: ', response)
        })
        .catch((error) => {
            this.setState({
                error: {
                    code: 1002
                }
            });
            console.log('AXIOS ERROR: ', error.message)
        });
    }

    getNavigationRightElement(properties) {
        return (
            <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                <SetLocaleButton
                    disabled={(properties.batchStatus === batchActions.ENUM_STATUS.PENDING)}
                    activeLanguage={properties.activeLanguage}
                    onPress={() => {
                        Keyboard.dismiss();
                        properties.navigation.navigate('Language', { title: properties.translate('screens.language') })
                    }}
                />
            </View>
        )
    }

    getProgressOverlayElement() {
        const loginProcessingText = this.props.translate('login.processing');

        return (
            <View style={styles.progressOverlay}>
                <Progress.CircleSnail
                    indeterminate={true}
                    color={['#cfcfcf', '#afafcf', '#8f8fcf']}
                    thickness={8}
                    size={80}
                />
                <Text style={{ color: '#fff' }}>{loginProcessingText.toUpperCase()}</Text>
            </View>
        )
    }

    getInfoContentElement() {
        const infoContent = this.props.translate('login.instruction');
        var isError = false;
        var errorMessage = '\uFFFD';
        if (isError = this.props.batchError.code != 0) {
            errorMessage = this.props.translate('error.' + this.props.batchError.code);
        }
        if (isError = this.props.userError.code != 0) {
            errorMessage = this.props.translate('error.' + this.props.userError.code);
        }
        if (isError = this.state.error.code != 0) {
            errorMessage = this.props.translate('error.' + this.state.error.code);
        }

        isError = errorMessage != '\uFFFD';

        return (
            <View>
                <Text style={{ color: '#cfcfcf', fontSize: 14, marginBottom: 5 }}>
                    {infoContent}
                </Text>
                {isError ?
                    (<View style={styles.errorMessageContainer}>
                        <Icon name="exclamation-circle" size={24} color="#ff2222" />
                        <Text style={{ color: '#ff4444', fontSize: 16, flex: 1, marginLeft: 5 }}>
                            {errorMessage}
                        </Text>
                    </View>)
                    : false
                }
            </View>
        );
    }

    render() {
        const translate = this.props.translate;
        const activeLanguage = this.props.activeLanguage;
        const userDataFetching = (this.props.batchStatus === batchActions.ENUM_STATUS.PENDING);

        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <Title title={translate('title.title')} subtitle={translate('title.subtitle')} />
                        <LoginForm translator={translate} onSubmit={this.submitForm} infoContent={this.getInfoContentElement()} disabled={false} />
                    </View>
                    {userDataFetching ? this.getProgressOverlayElement() : false}
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

const windowdim = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#146BBE'
    },
    progressOverlay: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: windowdim.width,
        height: windowdim.height,
        backgroundColor: '#00000088',
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00000088',
        padding: 3
    }
})