import React, { Component } from 'react';
import PropTypes from "prop-types";
import { StyleSheet, Dimensions, Animated, View, Text } from 'react-native';

import * as Progress from 'react-native-progress';

export default class ProgressOverlay extends Component {

    static propTypes = {
        visible: PropTypes.bool,
        message: PropTypes.string
    }

    static defaultProps = {
        visible: true,
        message: 'Loading'
    }

    constructor(props) {
        super(props);

        this.state = {
            opacity: props.visible ? 1.0 : 0.0
        }
    }

    render() {
        return (
            <Animated.View style={{...StyleSheet.flatten(styles.container), /*opacity: this.state.opacity, */display: this.props.visible ? 'flex' : 'none'}}>
                <Progress.CircleSnail
                    indeterminate={true}
                    color={['#cfcfcf', '#afafcf', '#8f8fcf']}
                    thickness={8}
                    size={80}
                />
                <Text style={{ color: '#fff' }}>{this.props.message}</Text>
            </Animated.View>
        )
    }

}

const windowdim = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: windowdim.width,
        height: windowdim.height,
        backgroundColor: '#00000088',
        justifyContent: 'center',
        alignItems: 'center'
    }
})