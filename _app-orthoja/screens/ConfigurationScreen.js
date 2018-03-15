import React, { Component } from "react";
import { StyleSheet, View, Text, FlatList, TouchableHighlight, TouchableOpacity, TextInput, Keyboard } from "react-native";
import { PropTypes } from "prop-types";

import { Configuration } from '../configuration';
import { ModalOverlay, ProgressOverlay } from "../components";

import Icon from 'react-native-vector-icons/FontAwesome';

export default class ConfigurationScreen extends Component {

    constructor(props) {
        super(props);

        // Fetch arguments from the navigational originator.
        this.arguments = this.props.navigation.getParam('arguments', { path: '', data: {} });
        console.log('RECIEVED ARGUMENT PATH', this.arguments.path);

        var configData = null;
        if(this.arguments.path) {
            configData = Configuration.getObjectByString(Configuration.data, this.arguments.path);
        } else {
            configData = Configuration.data;
        }
        console.log('CONFIGURATION DATA:', configData)

        // Component state configuration.
        this.state = {
            // State for the string edit modal.
            stringEditModal: {
                visible: false,
                name: 'unnamed',
                type: null,
                value: null
            },
            saving: false,
            data: configData
        }

        // Method bindings
        this.openStringEditModal = this.openStringEditModal.bind(this);
        this.goToNextConfigurationScreen = this.goToNextConfigurationScreen.bind(this);
        this.renderItemList = this.renderItemList.bind(this);
    }

    /**
     * Opens an editor for string values in the configuration.
     * @param {!string} keyName The name of the object key.
     * @param {string} value The string to manipulate.
     */
    openStringEditModal(keyName, value) {
        this.setState({
            stringEditModal: {
                visible: true,
                name: keyName,
                type: 'string',
                value: value
            }
        });
    }

    /**
     * Opens an editor for string values in the configuration.
     * @param {!string} keyName The name of the object key.
     * @param {string} value The string to manipulate.
     */
    openNumberEditModal(keyName, value) {
        this.setState({
            stringEditModal: {
                visible: true,
                name: keyName,
                type: 'number',
                value: value
            }
        });
    }

    /**
     * Navigates to a new stack of ConfigurationScreen with the nested object data.
     * @param {!string} keyName The name of the object key to use as the new title.
     * @param {!object} data The data to display in to the next ConfigurationScreen.
     */
    goToNextConfigurationScreen(keyName, data) {
        this.props.navigation.navigate(
            'Configuration',
            {
                title: keyName, 
                arguments: {
                    path: this.arguments.path + (this.arguments.path ? '.' : '') + keyName,
                    data: data
                }
            }
        );
    }

    /**
     * Renders the list of configurable data for a FlatList.
     * @param {object} listObject The item object from a React-Native FlitList.
     */
    renderItemList({item}) {

        var tapAction = null;
        var valueElement = false;
        switch(item.type) {
            case 'number':
                tapAction = () => {this.openNumberEditModal(item.name, item.value);};
                valueElement = (
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Text style={[styles.textValue, {paddingRight: 8}]}>{item.value.toString()}</Text>
                        <Icon name="edit" size={22} color='#cfcfcf' />
                    </View>
                );
                break;
            case 'string':
                tapAction = () => {this.openStringEditModal(item.name, item.value);};
                valueElement = (
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Text style={[styles.textValue, {paddingRight: 8}]}>{item.value}</Text>
                        <Icon name="edit" size={22} color='#cfcfcf' />
                    </View>
                );
                break;
            case 'object':
                tapAction = () => {this.goToNextConfigurationScreen(item.name, item.value);};
                valueElement = (<Icon name="angle-right" size={22} color='#cfcfcf' />);
                break;
            case 'null':
                tapAction = null;
                valueElement = (<Text style={[styles.textValue, {fontStyle: 'italic'}]}>{item.type}</Text>);
                break;
            default:
                tapAction = null;
                valueElement = (<Text style={styles.textValue}>{item.type}</Text>);
        }

        return (
            <View style={styles.itemContainer} key={item.key}>
                <View style={styles.itemNameContainer}>
                    <Text style={styles.textName}>{item.name}</Text>
                </View>
                <TouchableHighlight style={styles.itemValueContainer} onPress={tapAction}>
                    {valueElement}
                </TouchableHighlight>
            </View>
        );
    }

    render() {
        const keyDataList = Object.keys(this.state.data).map((key, index) => {
            return ({
                name: key,
                type: this.state.data[key] ? typeof (this.state.data[key]) : 'null',
                value: this.state.data[key],
                key: index
            });
        });

        return (
            <View style={{flex: 1}}>
                <View style={styles.container}>
                    <FlatList
                        data={keyDataList}
                        renderItem={this.renderItemList}
                        ListFooterComponent={
                            this.arguments.path ? false : 
                            (
                                <TouchableHighlight style={styles.resetButton} onPress={
                                    ()=>{
                                        Keyboard.dismiss();
                                        Configuration.reset();
                                        this.setState({saving: true});
                                        Configuration.save(() => {
                                            var configData = null;
                                            if(this.arguments.path) {
                                                configData = Configuration.getObjectByString(Configuration.data, this.arguments.path);
                                            } else {
                                                configData = Configuration.data;
                                            }
                                            this.setState({saving: false, data: configData});
                                        });
                                    }
                                }>
                                    <Text style={{color: '#c7c7c7', fontSize: 20}}>RESET</Text>
                                </TouchableHighlight>
                            )
                        }
                    />
                </View>
                <ModalOverlay
                    title={'Edit: ' + this.state.stringEditModal.name}
                    visible={this.state.stringEditModal.visible}
                >
                    <TextInput
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        style={styles.textInput}
                        value={
                            this.state.stringEditModal.type == 'number' ?
                            this.state.stringEditModal.value.toString() :
                            this.state.stringEditModal.value
                        }
                        onChangeText={(text) => {
                            this.setState((previousState) => {
                                return({
                                    stringEditModal: {
                                        ...previousState.stringEditModal,
                                        value: text
                                    }
                                });
                            })
                        }}
                    />
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            Keyboard.dismiss();
                            var { name, value, type } = this.state.stringEditModal;
                            if(type == 'number') {
                                value = Number(value);
                            }
                            Configuration.edit(this.arguments.path, name, value);

                            this.setState({
                                stringEditModal: {
                                    visible: false,
                                    name: 'unnamed',
                                    type: null,
                                    value: null
                                },
                                saving: true
                            });

                            Configuration.save(() => {
                                var configData = null;
                                if(this.arguments.path) {
                                    configData = Configuration.getObjectByString(Configuration.data, this.arguments.path);
                                } else {
                                    configData = Configuration.data;
                                }
                                this.setState({saving: false, data: configData});
                            })
                        }}>
                                <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => {
                            Keyboard.dismiss();
                            this.setState({
                                stringEditModal: {
                                    visible: false,
                                    name: 'unnamed',
                                    type: null,
                                    value: null
                                }
                            });
                        }}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </ModalOverlay>
                <ProgressOverlay
                    visible={(this.state.saving)}
                    message={'SAVING'}
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
    resetButton: {
        flex: 1,
        backgroundColor: '#222',
        padding: 20,
        alignItems: 'center'
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#bbb'
    },
    itemNameContainer: {
        flex: 1,
        backgroundColor: '#222',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        justifyContent: 'center'
    },
    itemValueContainer: {
        flex: 2,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    textName: {
        color: '#cfcfcf',
        fontSize: 16,
        fontWeight: 'bold'
    },
    textValue: {
        color: '#cfcfcf',
        fontSize: 16
    },
    textInput: {
        height: 36,
        paddingLeft: 10,
        paddingRight: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#c7c7c7',
        backgroundColor: '#ffffffaa',
        color: "#222"
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: '#444',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#cfcfcf',
        fontSize: 16,
        fontWeight: 'bold'
    }
})