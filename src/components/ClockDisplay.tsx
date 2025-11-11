import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import colors from '../config/colors';
import fonts from '../config/fonts';
import dayjs from 'dayjs';

const ClockDisplay = () => {
    const [time, setTime] = useState(dayjs());

    useEffect(() => {
        const timer = setInterval(() => setTime(dayjs()), 1000);
        return () => clearInterval(timer);
    }, []);

    return <Text style={styles.clock}>{time.format('HH:mm')}</Text>;
};

const styles = StyleSheet.create({
    clock: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        fontSize: fonts.subtitle,
        color: colors.text,
    },
});

export default ClockDisplay;
