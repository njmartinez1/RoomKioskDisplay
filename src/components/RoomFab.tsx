import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "@src/config/colors";

interface Props {
    onPress: () => void;
    color?: string;
}

export default function RoomFab({ onPress, color }: Props) {
    return (
        <TouchableOpacity style={[styles.fab, { backgroundColor: color }]} onPress={onPress} >
            <Ionicons name="calendar-outline" size={28} color="white" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        bottom: 30,
        right: 30,
        backgroundColor: colors.secondary,
        borderRadius: 50,
        padding: 16,
        elevation: 5,
    },
});
