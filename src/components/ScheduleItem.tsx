import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../config/colors';
import fonts from '../config/fonts';
import { Ionicons } from '@expo/vector-icons';

interface ScheduleItemProps {
    event: {
        title: string;
        time: string;
        people: number;
    };
    isActive?: boolean;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ event, isActive }) => {
    return (
        <View style={[styles.container, isActive && styles.activeContainer]}>
            <Text style={[styles.title, isActive && styles.activeTitle]}>
                {event.title}
            </Text>
            <Text style={[styles.time, isActive && styles.activeTime]}>
                {event.time}
            </Text>
            <View style={styles.peopleContainer}>
                <Ionicons name="people-outline" size={16} color={isActive? colors.text:colors.text} />
                <Text style={[styles.peopleText, isActive && styles.activePeople]}>x {event.people}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    activeContainer: {
        backgroundColor: "rgba(255,255,255,0.35)", 
        borderWidth: 2,
        borderColor: colors.accent,
    },
    title: {
        fontSize: fonts.text,
        color: colors.text,
    },
    activeTitle: {
        color: colors.accent,
        fontWeight: "bold",
    },
    time: {
        fontSize: fonts.small,
        color: colors.accent,
    },
    activeTime: {
        color: colors.text,
    },
    peopleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    peopleText: {
        color: colors.text,
        marginLeft: 4,
    },
    activePeople: {
        fontWeight: "bold",
    },
});

export default ScheduleItem;
