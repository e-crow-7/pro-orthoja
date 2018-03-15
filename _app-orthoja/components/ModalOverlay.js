import React, { Component } from 'react';
import PropTypes from "prop-types";
import { StyleSheet, Dimensions, Animated, View, Text } from 'react-native';

import * as Progress from 'react-native-progress';

export default class ModalOverlay extends Component {

    static propTypes = {
        visible: PropTypes.bool,
        title: PropTypes.string
    }

    static defaultProps = {
        visible: true,
        title: 'untitled'
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Animated.View style={[styles.container, {display: this.props.visible ? 'flex' : 'none'}]}>
                <View style={styles.modalContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>{this.props.title}</Text>
                    </View>
                    <View style={styles.childrenContainer}>
                        {this.props.children}
                    </View>
                </View>
            </Animated.View>
        )
    }

}

const windowdim = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        flex: 1,
        top: 0,
        left: 0,
        width: windowdim.width,
        height: windowdim.height,
        backgroundColor: '#00000088',
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 5,
        margin: 20
    },
    titleContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderColor: '#cfcfcf'
    },
    titleText: {
        color: '#222',
        fontSize: 22,
        fontWeight: 'bold'
    },
    childrenContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10
    }
})