import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ModalOverlay from './ModalOverlay';

export default class ConfirmModalOverlay extends Component {

    static propTypes = {
        text: PropTypes.string,
        confirmText: PropTypes.string,
        cancelText: PropTypes.string,
        visible: PropTypes.bool,
        title: PropTypes.string,

        onConfirm: PropTypes.func,
        onCancel: PropTypes.func,
    }

    static defaultProps = {
        text: '',
        confirmText: 'Okay',
        cancelText: 'Cancel',
        title: 'Confirm',
        visible: true,

        onConfirm: () => {},
        onCancel: () => {}
    }

    render() {
        return(
            <ModalOverlay visible={this.props.visible} title={this.props.title}>
                <View style={styles.contentContainer}>
                    <Text style={styles.text}>{this.props.text}</Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={()=>{this.props.onConfirm()}}>
                        <Text style={styles.buttonText}>{this.props.confirmText}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={()=>{this.props.onCancel()}}>
                        <Text style={styles.buttonText}>{this.props.cancelText}</Text>
                    </TouchableOpacity>
                </View>
            </ModalOverlay>
        )
    }

}

const styles = StyleSheet.create({
    contentContainer: {
        marginBottom: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    button: {
        flex: 1,
        padding: 10,
        margin: 5,
        alignItems: 'center',
        backgroundColor: '#222'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff'
    },
    text: {
        fontSize: 16,
        color: '#222'
    }
})