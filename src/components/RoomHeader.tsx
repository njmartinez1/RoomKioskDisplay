import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import dayjs from "dayjs";
import ClockDisplay from "@components/ClockDisplay";
import colors from "@src/config/colors";
import fonts from "@src/config/fonts";


interface Props {
    roomName: string;
    campus?: string;
    currentEvent: any;
    now: any;
    theme: {
        logo: any;
        primary: string;
        secondary: string;
        third: string;
        text: string;
    }
    onLogoPress?: () => void;
}

export default function RoomHeader({
    roomName,
    currentEvent,
    now,
    theme,
    onLogoPress,
}: Props) {
    return (
        <View style={styles.container}>

            {/* LOGO */}
            <TouchableOpacity onPress={onLogoPress} style={styles.logoContainer}>
                <Image source={theme.logo} style={styles.logo} />
            </TouchableOpacity>

            {/* INFORMACIÓN */}
            <View style={styles.info}>
                <Text style={[styles.roomName, { color: theme.text}]}>{roomName}</Text>

                {currentEvent ? (
                    <>
                        <Text style={[styles.host, { color: theme.third ||  theme.primary}]}>{currentEvent.title}</Text>
                        <Text style={[styles.host, { color: theme.third || theme.primary }]}>
                            {dayjs(currentEvent.start).format("HH:mm")} -{" "}
                            {dayjs(currentEvent.end).format("HH:mm")}
                        </Text>
                    </>
                ) : (
                    <Text style={styles.host}>Disponible</Text>
                )}
                </View>

                <View style={styles.bottomInfo}> 
                <Text style={styles.date}>{dayjs().format("DD MMM")}</Text>
                    <ClockDisplay />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        justifyContent: "center",
        paddingLeft: 20,
    },
    logoContainer: {
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 999,
    },
    logo: {
        width: 180,
        height: 70,
        resizeMode: "contain",
    },
    info: {
        marginTop: 50,
        justifyContent: "space-between",
        alignContent: "flex-start",
    },
    roomName: {
        fontSize: fonts.title,
        color: colors.text,
        fontFamily: fonts.family.bold,
    },
    host: {
        fontSize: fonts.subtitle,
        color: colors.text,
        marginVertical: 5,
        fontFamily: fonts.family.light,
    },
    reserve: {
        fontSize: fonts.subtitle,
        color: colors.primary,
        marginVertical: 5,
        fontFamily: fonts.family.light,
    },
    time: {
        fontSize: fonts.clock,
        color: colors.accent,
    },
    bottomInfo: {
        position: "absolute",
        bottom: 20,
        left: 15,
    },
    date: {
        fontSize: fonts.text,
        color: colors.text,
        marginTop: 0,
        paddingBottom: 120
    },
});
