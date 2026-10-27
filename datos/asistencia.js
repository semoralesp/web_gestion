const URL_ASISTENCIA = "http://localhost:4000/asistencia";

export async function registrarAsistencia(marcaje) {
    const respuesta = await fetch(URL_ASISTENCIA, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(marcaje),
    });
    
    if (!respuesta.ok) throw new Error("No se pudo registrar la asistencia.");
    return await respuesta.json();
}

export async function obtenerAsistencia() {
    const respuesta = await fetch(URL_ASISTENCIA);
    if (!respuesta.ok) throw new Error("No se pudo obtener el historial.");
    return await respuesta.json();
}