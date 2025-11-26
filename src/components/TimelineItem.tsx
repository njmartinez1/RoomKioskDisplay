import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "@config/colors";



// Definimos el tipo de un evento dentro del timeline
type TimelineEvent = {
    title: string;
    organizer?: string;
    start: string;
    end: string;
};

// Definimos las props del componente
type TimelineItemProps = {
    hour: string;
    events: TimelineEvent[];
    isActive: boolean;
    theme: {
        primary: string;
        secondary: string;
        text: string;
    };
};

export default function TimelineItem({ hour, events = [], isActive, theme }: TimelineItemProps) {
    return (
        <View style={[styles.container, isActive && styles.active]}>
            <Text style={styles.hour}>{hour}</Text>

            {events.length > 0 ? (
                events.map((ev, idx) => (
                    <View key={idx} style={[styles.eventBox, { backgroundColor: theme.primary }]}>
                        <Text style={[styles.eventTitle, { color: theme.text }]}>{ev.title}</Text>
                        <Text style={[styles.eventTime, { color: theme.text }]}>
                            {ev.start} - {ev.end}
                        </Text>
                    </View>
                ))
            ) : (
                <Text style={styles.available}>Disponible</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 80,
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#555",
        paddingHorizontal: 10,
    },
    active: {
        backgroundColor: "rgba(255,255,255,0.05)",
    },
    hour: {
        color: "#ccc",
        fontSize: 14,
        marginBottom: 4,
    },
    eventBox: {
        backgroundColor: colors.accent,
        borderRadius: 8,
        padding: 6,
        marginVertical: 2,
    },
    eventTitle: {
        color: "#fff",
        fontWeight: "bold",
    },
    eventTime: {
        color: "#eee",
        fontSize: 12,
    },
    available: {
        color: "#888",
        fontStyle: "italic",
    },
});
