import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TextInput, Slider, Animated } from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';

export default class PainInput extends Component {

    static propTypes = {
        value: PropTypes.number,
        onValueChanged: PropTypes.func,

        unit: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number,
        increment: PropTypes.number,
        default: PropTypes.number
    }

    static defaultProps = {
        value: null,
        onValueChanged: () => {},

        unit: '',
        min: 0,
        max: 1,
        increment: 0,
        default: 0
    }

    constructor(props) {
        super(props);

        const currentValue = this.props.value != null ? this.props.value : this.props.default;
        this.state = {
            value: currentValue,
            color: new Animated.Value(currentValue)
        }

        // Method bindings
        this.valueChanged = this.valueChanged.bind(this);
    }

    valueChanged(value) {
        Animated.spring(this.state.color, {
            toValue: value
        }).start();
        this.setState((previousState) => {
            return({
                value: value
            });
        });

        this.props.onValueChanged(value);
    }

    render() {

        const painColor = this.state.color.interpolate({
            inputRange: [this.props.min, (this.props.max/2), this.props.max],
            outputRange: ['rgba(0, 255, 0, 1)', 'rgba(255, 255, 0, 1)', 'rgba(255, 0, 0, 1)']
        });

        const emojiName = (() => {
            if(this.state.value <= ((this.props.max/3) * 1)) {
                return 'emoji-happy';
            } else if(this.state.value <= ((this.props.max/3) * 2)) {
                return 'emoji-neutral';
            } else {
                return 'emoji-sad';
            }
        })();

        return (
            <View style={styles.container}>
                <Animated.View style={[styles.iconContainer, {backgroundColor: painColor}]}>
                    <Icon
                        name={emojiName}
                        color='#146BBE'
                        size={30}
                    />
                </Animated.View>
                <Slider
                    style={styles.sliderInput}
                    value={this.state.value}
                    minimumValue={this.props.min}
                    maximumValue={this.props.max}
                    step={this.props.increment}
                    onValueChange={this.valueChanged}
                    minimumTrackTintColor='#ccc'
                    maximumTrackTintColor='#999'
                    thumbTintColor='#f00'
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderInput: {
        flex: 1,
        alignSelf: 'stretch'
    },
    iconContainer: {
        borderRadius: 5,
        padding: 5,
        marginRight: 5
    }
});