import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Col, Form, FormGroup, FormControl, ControlLabel, Radio, InputGroup, Button, Alert } from 'react-bootstrap';
import ReactLoading from 'react-loading';
import { CSSTransitionGroup } from 'react-transition-group';
import FontAwesome from 'react-fontawesome';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import DatePicker from 'react-datepicker';
import moment from 'moment'

import styles from './NewPatientForm.scss';
import 'react-datepicker/dist/react-datepicker.css';

class NewPatientForm extends Component {

    static propTypes = {
        translator: PropTypes.func.isRequired,
        tag: PropTypes.string,
        onStateChange: PropTypes.func,
    }

    static defaultProps = {
        tag: 'dxz',
        onStateChange: () => {}
    }

    constructor(props) {
        super(props);

        this.state = {
            // Account signin information.
            username: this.generateUniqueUsername(this.props.tag),
            password: this.generateUniquePassword(),

            // optionals
            nickname: '',
            sex: '',
            race: '',
            country: '',
            region: '',
            birthdate: null
        }

        // Method binding.
        this.handleUsernameInputChange = this.handleUsernameInputChange.bind(this);
        this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
        this.refreshUsername = this.refreshUsername.bind(this);
        this.refreshPassword = this.refreshPassword.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.tag != nextProps.tag) {
            this.setState({
                username: this.generateUniqueUsername(nextProps.tag)
            })
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if(this.state !== nextState) {
            // When the state changes, update the callback
            this.props.onStateChange(nextState);
        }
    }

    generateUniqueUsername(tag) {
        return ('patient-' + tag + '-' + Math.random().toString(36).substr(2, 6).toUpperCase());
    }

    generateUniquePassword() {
        var adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        var bone = bones[Math.floor(Math.random() * bones.length)];
        var number = Math.random().toString(10).substr(2, 2);

        var password = adjective + bone + number;

        const vowels = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];
        const leet = ['@', '3', '1', '0', 'U', '@', '3', '1', '0', 'u'];

        for (var i = 0; i < 6; i++) {
            var replaceIndex = Math.floor(Math.random() * vowels.length);
            password = password.replace(vowels[replaceIndex], leet[replaceIndex]);
        }

        return (password);
    }

    FieldElementInputGroup({ id, label, buttonElement, ...props }) {
        return (
            <FormGroup controlId={id}>
                <Col xm={2} sm={2} componentClass={ControlLabel}>
                    <ControlLabel>{label}:</ControlLabel>
                </Col>
                <Col xm={10} sm={10}>
                    <InputGroup style={{ width: '100%' }}>
                        <FormControl {...props} />
                        <InputGroup.Addon>
                            {buttonElement}
                        </InputGroup.Addon>
                    </InputGroup>
                </Col>
            </FormGroup>
        );
    }

    FieldElement({ id, label, ...props }) {
        return (
            <FormGroup controlId={id}>
                <Col xm={2} sm={2} componentClass={ControlLabel}>
                    <ControlLabel>{label}:</ControlLabel>
                </Col>
                <Col xm={10} sm={10}>
                    <FormControl {...props} />
                </Col>
            </FormGroup>
        );
    }

    FieldRadio({ id, label, checked, options, ...props }) {
        return (
            <FormGroup controlId={id}>
                <Col xm={2} sm={2} componentClass={ControlLabel}>
                    <ControlLabel>{label}:</ControlLabel>
                </Col>
                <Col xm={10} sm={10}>
                    <div style={{ textAlign: 'left' }}>
                        {options.map((value, index) => {
                            return (
                                <Radio name={id} value={value.value} key={index} {...props} checked={checked === value.value} inline>
                                    {value.title}
                                </Radio>
                            );
                        })}
                    </div>
                </Col>
            </FormGroup>
        );
    }

    FieldSelect({ id, label, options, ...props }) {
        return (
            <FormGroup controlId={id}>
                <Col xm={2} sm={2} componentClass={ControlLabel}>
                    <ControlLabel>{label}:</ControlLabel>
                </Col>
                <Col xm={10} sm={10}>
                    <FormControl {...props} componentClass="select" placeholder="">
                        {options.map((value, index) => {
                            return (
                                <option value={value.value}>{value.title}</option>
                            );
                        })}
                    </FormControl>
                </Col>
            </FormGroup>
        );
    }

    IconButtonElement({ onClick, ...props }) {
        onClick = onClick ? onClick : () => { };
        return (
            <div onClick={onClick} style={{cursor: 'pointer'}}>
                <FontAwesome {...props} />
            </div>
        )
    }

    handleUsernameInputChange(event) {
        this.setState({
            username: event.target.value
        })
    }

    handlePasswordInputChange(event) {
        this.setState({
            password: event.target.value
        })
    }

    refreshUsername() {
        this.setState({
            username: this.generateUniqueUsername(this.props.tag)
        })
    }

    refreshPassword() {
        this.setState({
            password: this.generateUniquePassword()
        })
    }

    render() {

        const usernameRedoElement = (
            <this.IconButtonElement onClick={this.refreshUsername} name='redo-alt' style={{ color: '#444' }} />
        );

        const passwordRedoElement = (
            <this.IconButtonElement onClick={this.refreshPassword} name='redo-alt' style={{ color: '#444' }} />
        )

        const races = [
            { title: this.props.translator('form.new-patient.none'), value: "" },
            { title: this.props.translator('form.new-patient.races.american-indian'), value: "american-indian" },
            { title: this.props.translator('form.new-patient.races.asian'), value: "asian" },
            { title: this.props.translator('form.new-patient.races.black'), value: "black" },
            { title: this.props.translator('form.new-patient.races.hispanic'), value: "hispanic" },
            { title: this.props.translator('form.new-patient.races.pacific-islander'), value: "pacific-islander" },
            { title: this.props.translator('form.new-patient.races.white'), value: "white" },
        ]

        return (
            <div className={styles.container}>
                <Form horizontal>
                    <this.FieldElementInputGroup
                        id="field-username"
                        label={this.props.translator('form.new-patient.username') + '*'}
                        type="text"
                        value={this.state.username}
                        buttonElement={usernameRedoElement}
                        onChange={this.handleUsernameInputChange}
                        disabled={true}
                    />
                    <this.FieldElementInputGroup
                        id="field-password"
                        label={this.props.translator('form.new-patient.password') + '*'}
                        type="text"
                        value={this.state.password}
                        buttonElement={passwordRedoElement}
                        onChange={this.handlePasswordInputChange}
                    />
                    <div className={styles.optionalCategory}>
                        <h5>{this.props.translator('form.optional')}</h5>
                        <this.FieldElement
                            id="field-nickname"
                            label={this.props.translator('form.new-patient.nickname')}
                            type="text"
                            value={this.state.nickname}
                            onChange={(event) => {
                                this.setState({ nickname: event.target.value });
                            }}
                        />
                        <this.FieldRadio
                            id="field-sex"
                            label={this.props.translator('form.new-patient.sex')}
                            options={[
                                { title: this.props.translator('form.new-patient.male'), value: "m" },
                                { title: this.props.translator('form.new-patient.female'), value: "f" },
                                { title: this.props.translator('form.new-patient.none'), value: "" },
                            ]}
                            checked={this.state.sex}
                            onChange={(event) => {
                                this.setState({ sex: event.target.value });
                            }}
                        />
                        <this.FieldSelect
                            id="field-race"
                            label={this.props.translator('form.new-patient.race')}
                            options={races}
                            onChange={(event) => {
                                this.setState({ race: event.target.value });
                            }}
                        />

                        <FormGroup controlId={'field-country'}>
                            <Col xm={2} sm={2} componentClass={ControlLabel}>
                                <ControlLabel>Country:</ControlLabel>
                            </Col>
                            <Col xm={10} sm={10}>
                                <CountryDropdown
                                    value={this.state.country}
                                    onChange={(value) => {
                                        this.setState({ country: value });
                                    }}
                                    classes="form-control"
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId={'field-region'}>
                            <Col xm={2} sm={2} componentClass={ControlLabel}>
                                <ControlLabel>Region:</ControlLabel>
                            </Col>
                            <Col xm={10} sm={10}>
                                <RegionDropdown
                                    country={this.state.country}
                                    value={this.state.region}
                                    onChange={(value) => {
                                        this.setState({ region: value });
                                    }}
                                    classes="form-control"
                                    disableWhenEmpty
                                />
                            </Col>
                        </FormGroup>

                        <FormGroup controlId={'field-birthdate'}>
                            <Col xm={2} sm={2} componentClass={ControlLabel}>
                                <ControlLabel>Birth:</ControlLabel>
                            </Col>
                            <Col xm={10} sm={10}>
                                <DatePicker
                                    selected={this.state.birthdate}
                                    dateFormat="L"
                                    locale='it'
                                    className="form-control"
                                    onChange={(newMoment) => {
                                        this.setState({ birthdate: newMoment });
                                    }}
                                />
                            </Col>
                        </FormGroup>
                    </div>
                </Form>
            </div>
        )
    }

}

const adjectives = [
    "Strong", "Diligent", "Witty", "Amazing", "Awesome", "Fortunate", "Spectacular", "Angelic",
    "Beautiful", "Brilliant", "Cheerful", "Delightful", "Excellent", "Extraordinary", "Fabulous",
    "Great", "Graceful", "Happy", "Healthy", "Incredible", "Lucky", "Magnificent", "Marvelous",
    "Miraculous", "Perfect", "Powerful", "Radiant", "Remarkable", "Super", "Thriving", "Wonderful"
];

const bones = [
    "Femur", "Patella", "Tibia", "Fibula", "Tarsus", "Calcaneus", "Talus", "Navicular",
    "Cuneiform", "Cuboid", "Metatarsals", "Phalanges", "Humerus", "Scapula", "Clavicles",
    "Ulna", "Radius", "Carpals", "Metacarpals"
]

// ================================================================================
// Exports
// ------------------------------------------------------------
export default NewPatientForm;