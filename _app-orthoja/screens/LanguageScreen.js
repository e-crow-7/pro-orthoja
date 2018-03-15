// ====================================================================================================
// IMPORTS
// --------------------------------------------------------------------------------
import React, {Component} from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';

import Icon from 'react-native-vector-icons/FontAwesome';

import { ActionBar, LanguageCombobox } from '../components'

// ====================================================================================================
// COMPONENT
// --------------------------------------------------------------------------------
@connect(
    (store) => {
        return {
            translate: getTranslate(store.locale),
            activeLanguage: getActiveLanguage(store.locale)
        }
    }
)
export default class LanguageScreen extends Component {

    componentWillMount() {
        this.props.navigation.setParams({
            title: this.props.translate('screens.language')
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.activeLanguage.code != this.props.activeLanguage.code) {
            this.props.navigation.setParams({
                title: nextProps.translate('screens.language')
            });
        }
    }

    render() {

        const translate = this.props.translate;

        return(
            <View style={styles.container}>
                <LanguageCombobox />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333'
    }
});