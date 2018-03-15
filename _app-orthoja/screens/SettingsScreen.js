import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux';
import { getLanguages } from 'react-localize-redux';

import LanguageCombobox from '../components/LanguageCombobox'

@connect(
    (store) => ({
        languages: getLanguages(store.locale)
    })
)
export default class SettingsScreen extends Component {

    render() {

        const data = [
            {label: 'Language', element: (<LanguageCombobox languages={this.props.languages} />)}
        ]

        return (
            <View style={styles.container}>
                <FlatList
                    data={data}
                    renderItem={ ({item}) => (<View><Text>{item.label}</Text>{item.element}</View>) }
                />
            </View>
        )
    }

}

const styles = StyleSheet.create( {
    container: {
        flex: 1
    }
})