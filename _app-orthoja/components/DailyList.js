import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import { PropTypes } from "prop-types";
import dateFormat from "dateformat";

import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';

const dailyTypeIcons = {
    "adjustment" : "wrench",
    "pain" : "speedometer",
    "exercise" : "walk"
}

export default class DailyList extends Component {

    static propTypes = {
        translator: PropTypes.func.isRequired,
        data: PropTypes.array.isRequired,
        date: PropTypes.string,
        onSelect: PropTypes.func
    }

    static defaultProps = {
        date: Date(),
        onSelect: () => {}
    }

    constructor(props) {
        super(props);

        this.renderListItem = this.renderListItem.bind(this);
    }

    renderListItem(item, key) {

        var itemName = this.props.translator(item.name);
        if(item.position) {
            itemName = itemName + ' (' + this.props.translator(item.position) + ')';
        }

        const color = {
            incomplete: '#222222',
            complete: '#ffffffdd'
        }

        const dateString = dateFormat(new Date(this.props.date), 'yyyy-mm-dd');
        const isComplete = (item.data[dateString] != undefined);

        const useColor = isComplete ? color.complete : color.incomplete;
        const useStyle = isComplete ? styles.listTextComplete : styles.listTextIncomplete;

        return (
            <TouchableHighlight
                key={key}
                onPress={() => {
                    this.props.onSelect(item); // Send back the item object.
                }
            }>
                <View style={{...StyleSheet.flatten(styles.listItem), backgroundColor: isComplete ? "#55dd5588" : "#ffffffbb" }}>
                    <View style={styles.listItemInfo}>
                        <IconMCI name={dailyTypeIcons[item.type]} size={22} color={useColor} />
                        <Text style={useStyle}>{itemName}</Text>
                    </View>
                    <View style={styles.listItemArrow}>
                        <IconFA name="angle-right" size={28} color={useColor} />
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    render() {

        const listItemElements = this.props.data.map((value, index) => {
            return(this.renderListItem(value, index));
        })

        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{this.props.translator('dailies.category_inputs')}</Text>
                </View>
                <View style={styles.listContainer}>
                    { listItemElements }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
    },
    titleContainer: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingTop: 7,
        paddingBottom: 5,
    },
    title: {
        fontSize: 16,
        color: '#d1e0f9',
    },
    titleIncomplete: {
        fontSize: 16,
        color: '#f20000',
    },
    listContainer: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    listItem: {
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        backgroundColor: '#ffffffbb',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    listItemInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    listItemArrow: {
        flexDirection: 'row',
    },
    listTextIncomplete: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginLeft: 8
    },
    listTextComplete: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffffdd',
        marginLeft: 8
    }
})