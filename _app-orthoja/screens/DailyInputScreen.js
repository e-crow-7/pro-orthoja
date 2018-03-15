import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Text, TextInput } from 'react-native';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import SimpleStepper from "react-native-simple-stepper";
import { StrutInput, PainInput } from '../components';
import Icon from 'react-native-vector-icons/FontAwesome';

import { dailiesActions, batchActions } from "../redux";

import { ProgressOverlay } from "../components";

@connect(
    (store) => ({
        translate: getTranslate(store.locale),
        currentDate: store.dailies.current,
        batch: store.batch
    }),
    (dispatcher) => ({
        updateDaily: (dailyId, dateString, data) => (dispatcher(dailiesActions.updateDailyData(dailyId, dateString, data)))
    })
)
export default class DailyInputScreen extends Component {

    constructor(props) {
        super(props);

        // Fetch arguments from the navigational originator.
        this.arguments = this.props.navigation.getParam('arguments', { title: 'Untitled Daily Input', id: '', data: {}, inputs: [] });
        // The data passed in should be a reference for ALL dailies, not just this one.
        this.arguments.data = this.arguments.data ? this.arguments.data : {};

        // This will refernce the data for the current date set in redux.
        const currentDayData = this.arguments.data[this.props.currentDate] || {};
        // This will check if the data exists for the current day data.
        const isExisting = this.arguments.data[this.props.currentDate] ? true : false;

        // We want to show the values for the daily data if it exists.
        var values = []
        // Set default state data values.
        for (var i = (this.arguments.inputs.length - 1); i >= 0; --i) {
            values[i] = currentDayData.values ? currentDayData.values[i] : 0;
        }

        // Establish this component's state.
        this.state = {
            data: {
                values: values
            },
            error: {
                code: 0
            },
            isExisting: isExisting
        };

        // Method binding.
        this.renderInput = this.renderInput.bind(this);
        this.submitDaily = this.submitDaily.bind(this);
        this.renderErrorMessage = this.renderErrorMessage.bind(this);
    }

    /**
     * Renders the input items for the daily object.
     * @param {object} item An object containing the information about the input item
     * @param {number} key The index id of the item (required by reactjs).
     */
    renderInput(item, key) {

        // Translate the name of the input type.
        var inputName = this.props.translate(item.name);
        if (item.position) {
            inputName = inputName + ' (' + this.props.translate(item.position) + ')';
        }

        // Function execute when the input values change.
        const updateData = (value) => {
            this.setState((previousState) => {
                var values = previousState.data.values;
                values[key] = value;

                return ({
                    data: {
                        values: values
                    }
                })
            })
        }

        // The current value of the inputs.
        const currentValue = this.state.data.values[key];

        // Lastly generate the appropriate input.
        let isInputElementFound = true;
        let inputElement = null;
        switch (item.type) {
            case 'strut':
                inputElement = this.renderStrutInput(item, currentValue, updateData);
                break;
            case 'pain':
                inputElement = this.renderPainInput(item, currentValue, updateData);
                break;
            default:
                isInputElementFound = false;
                inputElement = (<View></View>);
        }

        return (
            <View style={styles.inputContainer} key={key}>
                <View style={styles.inputTitleContainer}>
                    <View style={styles.inputTitleDecorator}>
                        <Text style={styles.inputTitleText}>
                            {isInputElementFound ? inputName : 'Unknown type: ' + item.type}
                        </Text>
                    </View>
                </View>
                <View style={styles.inputValuesContainer}>
                    {inputElement}
                </View>
            </View>
        );
    }

    /**
     * returns the React.Element for a strut input type.
     * @param {!object} data Required object data.
     * @param {!*} value The value to set the render to. Usually the state.
     * @param {!function} onChange Function to invoke when the value of the input changes.
     */
    renderStrutInput(data, value, onChange) {
        console.log('STRUT INPUT DATA:', data);
        return (
            <StrutInput
                value={value}
                min={data.min != null ? data.min : -10}
                max={data.max != null ? data.max : 10}
                increment={data.increment || 0.25}
                unit={data.unit || 'mm'}
                default={data.default || 0}
                onValueChanged={onChange}
            />
        )
    }

    /**
     * returns the React.Element for a scale input type.
     * @param {!object} data Required object data.
     * @param {!*} value The value to set the render to. Usually the state.
     * @param {!function} onChange Function to invoke when the value of the input changes.
     */
    renderPainInput(data, value, onChange) {
        return (
            <PainInput
                value={value}
                min={data.min || 0}
                max={data.max || 1}
                increment={data.increment || 1}
                default={data.default || 0}
                onValueChanged={onChange}
            />
        )
    }

    /**
     * Submits the current state of the daily data to the server.
     * Displaces the redux actions to do so.
     */
    submitDaily() {
        this.props.updateDaily(this.arguments.id, this.props.currentDate, this.state.data)
            .then((response) => {
                if (response.action.type === 'Batch/REQUEST_FULFILLED') {
                    this.props.navigation.goBack(null);
                }
            })
            .catch((error) => {
                this.setState({
                    error: {
                        code: 1002
                    }
                })
                console.log('AXIOS ERROR: ', error.message)
            });
    }

    /**
     * Renders a React.Element for displaying an error.
     */
    renderErrorMessage() {
        var errorMessage = '';
        var isError = false;
        if (isError = this.state.error.code != 0) {
            errorMessage = this.props.translate('error.' + this.state.error.code);
        }

        return (
            <View>
                {isError ?
                    (<View style={styles.errorMessageContainer}>
                        <Icon name="exclamation-circle" size={24} color="#ff2222" />
                        <Text style={{ color: '#ff4444', fontSize: 16, flex: 1, marginLeft: 5 }}>
                            {errorMessage}
                        </Text>
                    </View>)
                    : false}
            </View>
        )
    }

    /**
     * Required render method for a React Component.
     */
    render() {
        // Convenient naming for the arguments.
        const arg = this.arguments;

        const inputElements = this.arguments.inputs.map((value, index) => {
            return this.renderInput(value, index);
        })

        return (
            <View style={styles.container}>
                <View style={
                    {
                        ...StyleSheet.flatten(styles.titleContainer),
                        backgroundColor: this.state.isExisting ? "#55dd5588" : "#00000088"
                    }
                }>
                    <Text style={styles.titleText}>
                        {arg.title}
                    </Text>
                </View>
                <ScrollView alwaysBounceVertical={false} style={{ flex: 1 }}>
                    <View style={styles.inputListContainer}>
                        {inputElements}
                    </View>
                </ScrollView>
                {this.renderErrorMessage()}
                <TouchableOpacity onPress={this.submitDaily}>
                    <View style={styles.saveButton} >
                        <Text style={styles.saveButtonText}>
                            {this.props.translate('form.submit')}
                        </Text>
                    </View>
                </TouchableOpacity>
                <ProgressOverlay
                    visible={(this.props.batch.status === batchActions.ENUM_STATUS.PENDING)}
                    message={this.props.translate('form.submitting').toUpperCase()}
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
        alignItems: 'stretch',
    },
    titleContainer: {
        backgroundColor: '#00000088',
        justifyContent: 'center',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
    },
    titleText: {
        color: '#ffffff',
        fontSize: 26,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    inputListContainer: {
        alignItems: 'stretch',
    },
    inputContainer: {
        alignItems: 'stretch',
        backgroundColor: "#ffffff00",
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10
    },
    inputTitleContainer: {
        alignItems: 'center',
    },
    inputTitleDecorator: {
        backgroundColor: '#146BBE',
        paddingLeft: 5,
        paddingRight: 5,
    },
    inputTitleText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    inputValuesContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 2,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
        paddingTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
    },
    saveButton: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#00000088',
        margin: 5,
        padding: 10,
    },
    saveButtonText: {
        color: '#cfcfcf',
        fontSize: 22,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    errorMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00000088',
        padding: 3
    }
});