import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    FlatList,
    ActivityIndicator,
    Modal,
    TextInput,
    TouchableOpacity,
    Alert,
    Platform,
    Image,
    Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from "dayjs";
import colors from "@config/colors";
import fonts from "@config/fonts";
import images from "@config/images";
import ClockDisplay from "@components/ClockDisplay";
import { getRoomEvents } from "@src/api/calendarService";
import RoomHeader from "@src/components/RoomHeader";
import Timeline from "@src/components/Timeline";
import ReservationModal from "@src/components/ReservationModal";
import RoomFab from "@src/components/RoomFab";
import RoomLayout from "@src/components/RoomLayout";
import { useLocalSearchParams, useRouter } from "expo-router";
import { roomsConfig } from "@src/config/roomsConfig";





type PickerMode = "start" | "end" | null;

export default function RoomScreen() {
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
    const [currentEvent, setCurrentEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [now, setNow] = useState(dayjs());

    // Modal + formulario
    const [showModal, setShowModal] = useState(false);
    const [pickerMode, setPickerMode] = useState<PickerMode>(null);
    const [form, setForm] = useState({
        subject: "",
        start: "",
        end: "",
    });

    const flatListRef = useRef<FlatList>(null);
    const { id } = useLocalSearchParams();   // id que viene desde la URL
    const room = roomsConfig[id as keyof typeof roomsConfig];  // datos según la sala seleccionada

    const roomName = room.name;
    const roomEmail = room.email;
    const theme = room.theme;
    const roomBackground = room.background;
    const tenant = room.tenant; // puedes moverlo a la config si cambia por sala

    const API_BASE = "http://192.168.1.49:5130"; // 🔧 Cambia aquí tu backend si lo necesitas

    console.log("🟦 PARAMS:", id);
    console.log("🟨 room encontrado:", room);

    console.log("🟩 tenant:", tenant);
    console.log("🟧 roomEmail:", roomEmail);


    // 🕒 Actualiza la hora cada minuto
    useEffect(() => {
        const timer = setInterval(() => setNow(dayjs()), 60000);
        return () => clearInterval(timer);
    }, []);

    // 🔄 Cargar eventos desde el backend
    const loadEvents = async (showLoader: boolean = false) => {
        console.log("🔵 loadEvents llamado");
        console.log("🔸 tenant:", tenant);
        console.log("🔸 roomEmail:", roomEmail);
        if (showLoader) setLoading(true);

        try {
            console.log("📡 Llamando a GET:", `${API_BASE}/api/calendar/${tenant}/${roomEmail}`);
            const data = await getRoomEvents(tenant, roomEmail);
            console.log("📦 Eventos cargados:", data);
            setEvents(data);
        } catch (error) {
            console.error("❌ Error cargando eventos:", error);
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    useEffect(() => {
        if (roomEmail && tenant) {
            loadEvents(true);
        }
    }, [roomEmail, tenant]);

    useEffect(() => {
        if (!roomEmail || !tenant) return;

        const interval = setInterval(() => {
            loadEvents(false);
        }, 3000);

        return () => clearInterval(interval);
    }, [roomEmail, tenant]);


    // 🧠 Detecta si hay un evento activo actualmente
    useEffect(() => {
        const active = events.find(
            (ev) => now.isAfter(dayjs(ev.start)) && now.isBefore(dayjs(ev.end))
        );
        setCurrentEvent(active || null);
    }, [now, events]);

    // 🕓 Genera las horas del día (07:00–18:00)
    const hours = Array.from({ length: 12 }, (_, i) => 7 + i);

    // 🧩 Crea los bloques del timeline con múltiples eventos
    const timelineData = hours.map((h) => {
        const hourLabel = `${String(h).padStart(2, "0")}:00`;

        const hourEvents = events.filter((e) => {
            const start = dayjs(e.start);
            const end = dayjs(e.end);
            return (
                (start.hour() <= h && end.hour() > h) ||
                (start.hour() === h && start.minute() < 59)
            );
        });

        const isActive = hourEvents.some(
            (ev) => now.isAfter(dayjs(ev.start)) && now.isBefore(dayjs(ev.end))
        );

        return {
            hour: hourLabel,
            events: hourEvents.map((ev) => ({
                title: ev.title,
                organizer: ev.organizer,
                start: dayjs(ev.start).format("HH:mm"),
                end: dayjs(ev.end).format("HH:mm"),
            })),
            isActive,
        };
    });

    // 🎯 Scroll automático al bloque horario actual (centrado)
    useEffect(() => {
        const currentHour = now.hour();
        const indexToScroll = hours.findIndex((h) => h === currentHour);
        if (indexToScroll >= 0 && flatListRef.current) {
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                    index: indexToScroll,
                    animated: true,
                    viewPosition: 0.5,
                });
            }, 400);
        }
    }, [timelineData]);

    // 📝 Manejo del formulario
    const setField = (key: keyof typeof form, value: string) =>
        setForm((f) => ({ ...f, [key]: value }));

    // 🚀 Crear reserva

    const handleReserve = async () => {
        console.log("🔥 handleReserve llamado");

        if (!form.subject || !form.start || !form.end) {
            Alert.alert("Faltan datos", "Completa nombre, hora de inicio y  hora de finalización.");
            return;
        }
        try {
            const body = {
                subject: form.subject || `Reserva de ${form.subject}`,
                start: dayjs(form.start).format("YYYY-MM-DDTHH:mm:ss"),
                end: dayjs(form.end).format("YYYY-MM-DDTHH:mm:ss")
            };
            console.log("📤 Enviando datos de reserva:", body);

            const resp = await fetch(`${API_BASE}/api/calendar/${tenant}/${roomEmail}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            console.log("📡 Status:", resp.status);
            if (!resp.ok) throw new Error(await resp.text());
            let result = null;
            try {
                const text = await resp.text();
                result = text ? JSON.parse(text) : null;
            } catch {
                result = null; // si no hay json no pasa nada
            }

            console.log("📨 Respuesta del servidor:", result);

            Alert.alert("Éxito", "Reserva creada correctamente ✅");
            setShowModal(false);
            setForm({ subject: "", start: "", end: "" });
            loadEvents();
        } catch (e: any) {
            console.error(e);
            Alert.alert("Error", "No se pudo crear la reserva.");
        }
    };

    if (loading) {
        return (
            <View style={[styles.loader, { backgroundColor: theme.secondary }]}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={{ color: colors.text, marginTop: 10 }}>
                    Cargando calendario...
                </Text>
            </View>
        );
    }

    return (
        <RoomLayout background={roomBackground}>

            {/* IZQUIERDA */}
            <RoomHeader
                roomName={roomName}
                currentEvent={currentEvent}
                now={now}
                theme={theme}
                onLogoPress={() => router.replace("/")}

            />


            {/* DERECHA */}
            <View style={styles.right}>
                <Timeline
                    timelineData={timelineData}
                    flatListRef={flatListRef}
                    now={now}
                    hours={hours}
                    theme={theme}
                />
            </View>


            {/* FAB */}
            <RoomFab onPress={() => setShowModal(true)}
                color={ theme.secondary} />


            {/* MODAL */}
            <ReservationModal
                visible={showModal}
                form={form}
                pickerMode={pickerMode}
                setPickerMode={setPickerMode}
                onClose={() => setShowModal(false)}
                onChange={setField}
                onSubmit={handleReserve}
                theme={theme}
            />

        </RoomLayout >
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, width: "100%", height: "100%" },
    overlay: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 0
    },
    logo: {
        width: 180,
        height: 70,
        resizeMode: "contain",
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
    },
    left: { flex: 2, justifyContent: "center", paddingLeft: 20 },
    right: { flex: 1, justifyContent: "center", paddingLeft: 20 },
    roomName: { fontSize: fonts.title, color: colors.text, fontFamily: fonts.family.bold },
    host: { fontSize: fonts.subtitle, color: colors.text, marginVertical: 5, fontFamily: fonts.family.light },
    time: { fontSize: fonts.text, color: colors.accent},
    date: { position: "absolute", bottom: 110, left: 20, fontSize: fonts.date, color: colors.text },
    fab: { position: "absolute", bottom: 30, right: 30, backgroundColor: colors.secondary, borderRadius: 50, padding: 16, elevation: 5 },
    modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
    modalContainer: { width: "90%", backgroundColor: "#222", padding: 20, borderRadius: 12 },
    modalTitle: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 15 },
    label: { color: "#aaa", marginBottom: 5, marginTop: 10 },
    input: { backgroundColor: "#333", color: "#fff", borderRadius: 8, padding: 12 },
    buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
    button: { flex: 1, marginHorizontal: 5, padding: 12, borderRadius: 8, alignItems: "center" },
    buttonText: { color: "#fff", fontWeight: "bold" }
});
