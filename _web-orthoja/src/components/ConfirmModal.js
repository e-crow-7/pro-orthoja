import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

class ConfirmModal extends Component {

    static propTypes = {
        show: PropTypes.bool,
        title: PropTypes.string,
        cancelText: PropTypes.string,
        confirmText: PropTypes.string,
        confirmType: PropTypes.string,
        onConfirm: PropTypes.func,
        onCancel: PropTypes.func
    }

    static defaultProps = {
        show: false,
        title: 'Confirmation',
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        confirmType: 'primary',
        onConfirm: () => {},
        onCancel: () => {}
    }

    render() {
        return (
            <div>
                <Modal show={this.props.show}>
                    <Modal.Header>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {this.props.children}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.props.onCancel}>
                            {this.props.cancelText}
                        </Button>
                        <Button onClick={this.props.onConfirm} bsStyle={this.props.confirmType}>
                            {this.props.confirmText}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

}

export default ConfirmModal;