import axios from "axios";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
// ⚙️ Cambia por tu IP local (ya confirmada)
const API_BASE = "http://192.168.1.76:5130/api/calendar";

export async function getRoomEvents(tenant: string, roomEmail: string) {
    try {
        const response = await axios.get<any[]>(`${API_BASE}/${tenant}/${roomEmail}`);
        const data = response.data as any[];

        // 🧩 Normalizamos los datos para el front
        const formatted = data.map((ev: any) => {
            // extraemos las fechas limpias y aseguramos que sean ISO strings válidas
            const startISO = ev.start?.dateTime
                ? ev.start.dateTime.split(".")[0] // quitamos milisegundos
                : ev.start;
            const endISO = ev.end?.dateTime
                ? ev.end.dateTime.split(".")[0]
                : ev.end;

            return {
                id: ev.id || ev.subject || Math.random().toString(),
                title: ev.subject || ev.organizer?.emailAddress?.name || "Sin título",
                start: startISO,
                end: endISO,
                organizer: ev.organizer?.emailAddress?.name || "",
                people: ev.attendees?.length || 0,
            };
        });

        // 🕓 Filtramos solo los eventos del día actual
        const today = dayjs().startOf("day");
        const tomorrow = today.add(1, "day");
        const todayEvents = formatted.filter(
            (e) => {
                const start = dayjs(e.start);
                const end = dayjs(e.end);
                return (
                    // El evento empieza o termina dentro del día actual
                    (start.isSameOrAfter(today) && start.isBefore(tomorrow)) ||
                    (end.isAfter(today) && end.isSameOrBefore(tomorrow))
                );
            }
        );

        console.log("📦 Eventos cargados (hoy):", todayEvents.length);
        console.log(todayEvents);
        console.log("🎯 Eventos totales:", formatted.length);
        console.log("📅 Eventos visibles (hoy):", todayEvents.length);
        formatted.forEach(ev => console.log("🕓", ev.title, ev.start, ev.end));
        return todayEvents;
    } catch (error: any) {
        console.error("❌ Error al obtener eventos:", error.message);
        return [];
    }
}
