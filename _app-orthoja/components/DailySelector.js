import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Dimensions, Animated, View, Text, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { languages } from "../locale";

export default class DailySelector extends Component {

    static propTypes = {
        translator: PropTypes.func.isRequired,
        activeLanguage: PropTypes.object,
        date: PropTypes.string,
        onDateChange: PropTypes.func
    }

    static defaultProps = {
        activeLanguage: { name: 'English', code: 'en', active: true },
        date: Date(),
        onDateChange: () => {}
    }

    constructor(props) {
        super(props);

        this.state = {
            calendarContainerHeight: new Animated.Value(0),
            calendarOpacity: new Animated.Value(0),
            isCalendarOpen: false,

            markedDates: {}, // Markings on the calendar.
            date: this.props.date // The date of the selected.
        }

        this.animationTime = 250;

        this.toggleCalendar = this.toggleCalendar.bind(this);
        this.openCalendar = this.openCalendar.bind(this);
        this.closeCalendar = this.closeCalendar.bind(this);

        this.printDate = this.printDate.bind(this);

        this.changeDate = this.changeDate.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.forceUpdate();
    }

    toggleCalendar() {
        if(!this.state.isCalendarOpen) {
            this.setState({isCalendarOpen: true})
            this.openCalendar();
        } else {
            this.closeCalendar();
        }
    }

    openCalendar() {
        Animated.timing(
            this.state.calendarContainerHeight,
            {
                toValue: calendarHeightMax,
                duration: this.animationTime,
            }
        ).start(() => {
            Animated.timing(
                this.state.calendarOpacity,
                {
                    toValue: 1,
                    duration: this.animationTime,
                }
            ).start();
        });
    }

    closeCalendar() {
        Animated.timing(
            this.state.calendarOpacity,
            {
                toValue: 0,
                duration: this.animationTime,
            }
        ).start(() => {
            Animated.timing(
                this.state.calendarContainerHeight,
                {
                    toValue: 0,
                    duration: this.animationTime,
                }
            ).start( () => { this.setState({isCalendarOpen: false}) } );
        });
    }

    /**
     * Prints the date within a decent format.
     * @return {string} The date string.
     */
    printDate() {
        // Date formatting options.
        const options = { weekday: undefined, year: 'numeric', month: 'long', day: 'numeric' };
        // Create the date instance.
        const dateInstance = new Date(this.state.date);
        // Todays date.
        const todaysDate = new Date();

        // If the date is set to today, return the Today string.
        if(dateInstance.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)) {
            return( this.props.translator('dailies.today') );
        }

        // Return the formatted date string.
        return( dateInstance.toLocaleDateString(this.props.activeLanguage.code, options) );
    }

    /**
     * When the date is changed.
     */
    changeDate(date) {
        const markedDate = {}
        markedDate[date.dateString] = {
            selected: true,
            selectedColor: '#4585ff'
        }

        this.setState({
            markedDates: { ...markedDate },
            date: date.dateString
        });

        this.props.onDateChange(date);

    }

    render() {
        let { calendarOpacity, calendarContainerHeight } = this.state;
        LocaleConfig.defaultLocale = this.props.activeLanguage.code;

        const dateToday = new Date();

        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.toggleCalendar}>
                    <View style={styles.currentDayButton}>
                        <Text style={styles.currentDayTitle}>{this.props.translator('dailies.current').toLowerCase()}</Text>
                        <Text style={styles.currentDayButtonText}>{this.printDate()}</Text>
                    </View>
                </TouchableOpacity>
                <Animated.View style={{backgroundColor: '#ffffff', height: calendarContainerHeight, display: this.state.isCalendarOpen ? 'flex' : 'none'}}>
                    <Animated.View style={{ height: calendarHeightMax, opacity: calendarOpacity }}>
                        <Calendar
                            style={styles.calendar}
                            theme={calendarTheme}
                            maxDate={dateToday.toISOString().substr(0, 10)}
                            markedDates={this.state.markedDates}
                            onDayPress={this.changeDate}
                        />
                    </Animated.View>
                </Animated.View>
            </View>
        )
    }

}

const windowDimensions = Dimensions.get('window');
const calendarHeightMax = 350;

const calendarTheme = {
    textDayFontSize: 20,
}

// Compile calendar locale
languages.map((value) => {

    //const options = { weekday: undefined, year: 'numeric', month: 'long', day: 'numeric' };

    const months = (() => {
        const options_long = { month: 'long' };
        const options_short = { month: 'short' };
        const date = new Date(Date.UTC(2017, 1, 1, 3, 0, 0));
        var months = { long: [], short: [] };
        for(var i = 0; i < 12; i++) {
            date.setMonth(i);
            months.long.push(date.toLocaleDateString(value.code, options_long));
            months.short.push(date.toLocaleDateString(value.code, options_short));
        }
        return(months);
    })();

    const days = (() => {
        const options_long = { weekday: 'long' };
        const options_short = { weekday: 'short' };
        const date = new Date(Date.UTC(2017, 10, 1, 0, 0, 0));
        var days = { long: [], short: [] };
        for(var i = 5; i <= 11; i++) {
            date.setDate(i);
            days.long.push(date.toLocaleDateString(value.code, options_long));
            days.short.push(date.toLocaleDateString(value.code, options_short));
        }
        return(days);
    })();

    LocaleConfig.locales[value.code] = {
        monthNames: months.long,
        monthNamesShort: months.short,
        dayNames: days.long,
        dayNamesShort: days.short
    }

});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    currentDayButton: {
        height: 70,
        backgroundColor: '#00000088',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentDayTitle: {
        color: '#ffffff',
        fontSize: 14,
    },
    currentDayButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 26,
    },
    calendarContainer: {
        backgroundColor: '#ffffff',
    },
    calendar: {
        height: calendarHeightMax,
        width: windowDimensions.width,
    },
});