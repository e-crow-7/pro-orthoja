import React, { Component } from 'react';
import { StyleSheet, Keyboard, View, Text, ScrollView, Dimensions } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import { DailySelector, SetLocaleButton, LogoutButton, ProgressOverlay, DailyList, ConfirmModalOverlay } from '../components';
import { dailiesActions, batchActions, userActions } from "../redux";

@connect(
    (store) => ({
        translate: getTranslate(store.locale),
        activeLanguage: getActiveLanguage(store.locale),
        batch: store.batch,
        user: { username, id } = store.user,
        dailies: store.dailies,
        navigationIndex: store.navigation.index
    }),
    (dispatcher) => ({
        fetchDailies: (userId) => (dispatcher(dailiesActions.fetchDailies(userId))),
        changeDate: (dateString) => (dispatcher(dailiesActions.changeDate(dateString))),
        userLogout: () => (dispatcher(userActions.userLogout()))
    })
)
export default class HomeScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showLogoutConfirmModal: false
        }

        this.getNavigationRightElement = this.getNavigationRightElement.bind(this);
        this.getNavigationLeftElement = this.getNavigationLeftElement.bind(this);
        this.navigateToDailyInput = this.navigateToDailyInput.bind(this);
    }

    componentWillMount() {
        this.props.navigation.setParams({
            title: this.props.translate('screens.home'),
            navigationRightElement: this.getNavigationRightElement(this.props),
            navigationLeftElement: this.getNavigationLeftElement(this.props)
        });
    }

    componentDidMount() {
        // Fetch the user's dailies if they haven't already been received.
        //if (this.props.dailies.data == null) {
        this.props.fetchDailies(this.props.user.id);
        //}
    }

    componentWillReceiveProps(nextProps) {
        // Navigate back to the login page is the userid changes.
        if (nextProps.user.id !== this.props.user.id) {
            if (this.props.navigationIndex > 0) {
                this.props.navigation.goBack(null);
            } else {
                this.props.navigation.navigate('SignedOut');
            }
        }

        // Ensure the language code has changed before updating the navigation properties.
        if (
            (nextProps.activeLanguage.code != this.props.activeLanguage.code)
        ) {
            this.props.navigation.setParams({
                title: nextProps.translate('screens.home'),
                navigationRightElement: this.getNavigationRightElement(nextProps),
                navigationLeftElement: this.getNavigationLeftElement(nextProps)
            });
        }
    }

    getNavigationLeftElement(properties) {

        return (
            <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                <LogoutButton
                    disabled={false}
                    onPress={() => {
                        this.setState({
                            showLogoutConfirmModal: true
                        });
                    }}
                />
            </View>
        )
    }

    getNavigationRightElement(properties) {

        return (
            <View style={{ paddingLeft: 5, paddingRight: 5 }}>
                <SetLocaleButton
                    disabled={false}
                    activeLanguage={properties.activeLanguage}
                    onPress={() => {
                        Keyboard.dismiss();
                        this.props.navigation.navigate('Language', { title: properties.translate('screens.language') })
                    }}
                />
            </View>
        )
    }

    navigateToDailyInput(item) {
        var itemName = this.props.translate(item.name);
        if (item.position) {
            itemName = itemName + ' (' + this.props.translate(item.position) + ')';
        }

        this.props.navigation.navigate(
            'DailyInput',
            {
                title: this.props.translate('screens.' + item.type),
                arguments: {
                    title: itemName,
                    id: item._id,
                    data: item.data,
                    inputs: item.inputs
                }
            }
        );
    }

    render() {
        const dailies = this.props.dailies;

        return (
            <View style={styles.container}>
                <ScrollView alwaysBounceVertical={false}>
                    <View style={styles.scrollable}>
                        <DailySelector
                            translator={this.props.translate}
                            activeLanguage={this.props.activeLanguage}
                            date={this.props.dailies.current}
                            onDateChange={(date) => { this.props.changeDate(date.dateString) }}
                        />
                        <DailyList
                            translator={this.props.translate}
                            data={dailies.data || []}
                            date={dailies.current || Date()}
                            onSelect={this.navigateToDailyInput}
                        />
                    </View>
                </ScrollView>
                <ConfirmModalOverlay
                    visible={this.state.showLogoutConfirmModal}
                    text={this.props.translate('logout.confirm')}
                    confirmText={this.props.translate('modal.yes')}
                    onConfirm={() => {
                        Keyboard.dismiss();
                        this.props.userLogout();
                    }}
                    onCancel={() => {
                        this.setState({
                            showLogoutConfirmModal: false
                        });
                    }}
                />
                <ProgressOverlay
                    visible={(this.props.batch.status === batchActions.ENUM_STATUS.PENDING)}
                    message={'Fetching dailies'.toUpperCase()}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#146BBE',
    },
    scrollable: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    daliesContainer: {
        backgroundColor: '#55f',
    },
    dailyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: 30,
        backgroundColor: '#f55',
    }
});