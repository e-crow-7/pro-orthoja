// ====================================================================================================
// IMPORTS
// --------------------------------------------------------------------------------
import React, { Component } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableHighlight } from 'react-native';
import Flag from 'react-native-flags';
import { getLanguages, setActiveLanguage } from 'react-localize-redux';
import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';

// Associates further data with a language code.
const languageCodeData = require('../locale/locale-code-data.json');

// ====================================================================================================
// COMPONENT
// --------------------------------------------------------------------------------
/** 
 * Properties:
 * 
 *    setLanguageCode: string
 *       The current language code the picker should be set to.
 * 
 *    onLanguageChange: function
 *       Callback for when a language is selected.
 *       Callback: (languageValue) => {}
*/
@connect(
    (store) => ({
        languages: getLanguages(store.locale)
    }),
    (dispatch) => ({
        setLanguage: (code) => (dispatch(setActiveLanguage(code)))
    })
)
export default class LanguageCombobox extends Component {

    constructor(props) {
        super(props);

        this.renderLanguageList = this.renderLanguageList.bind(this);
        this.onLanguageItemPressed = this.onLanguageItemPressed.bind(this);
    }

    /** Renders the language React.Element for a single language data element.
    */
    renderLanguageList({ item }) {

        // index 0 = unselected
        // index 1 = selected
        const toggleStyle = [
            {
                iconType: 'square',
                fontColor: '#cfcfcf',
                viewStyle: styles.comboboxItemUnselected,
                textStyle: styles.comboboxItemUnselectedText
            },
            {
                iconType: 'check-square',
                fontColor: '#3f3f3f',
                viewStyle: styles.comboboxItemSelected,
                textStyle: styles.comboboxItemSelectedText
            }
        ];

        const toggleIndex = item.active ? 1 : 0;

        return (
            <TouchableHighlight onPress={() => {this.onLanguageItemPressed(item.code);}}>
                <View style={toggleStyle[toggleIndex].viewStyle}>
                    <Icon name={toggleStyle[toggleIndex].iconType} size={32} color={toggleStyle[toggleIndex].fontColor} style={{paddingRight: 5}} />
                    <Flag code={languageCodeData[item.code].iso} size={32} type="flat" />
                    <Text style={toggleStyle[toggleIndex].textStyle}>{item.name}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    /** Event function when a language itm is selected.
     */
    onLanguageItemPressed(code) {
        this.props.setLanguage(code);
    }

    /** Primary React.Element render for this component
     */
    render() {

        // Properties setup.
        const languageData = this.props.languages || [{name: 'null', code: 'na', active: true, key: 0}];
        const languageDataWithKey = languageData.map((value, index) => {
            return ({...value, key: index});
        });

        // Return the rendered DOM.
        return (
            <View style={styles.container}>
                <FlatList
                    data={languageDataWithKey}
                    renderItem={this.renderLanguageList}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333'
    },
    comboboxItemUnselected: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 42,
        backgroundColor: '#333',
        paddingLeft: 5,
        paddingRight: 5
    },
    comboboxItemUnselectedText: {
        fontSize: 16,
        paddingLeft: 5,
        color: '#cfcfcf',
    },
    comboboxItemSelected: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 42,
        backgroundColor: '#ccc',
        paddingLeft: 5,
        paddingRight: 5
    },
    comboboxItemSelectedText: {
        fontSize: 16,
        paddingLeft: 5,
        color: '#3f3f3f'
    }
})