const URL_GASTOS = "http://localhost:4000/gastos_almuerzo";

export async function registrarGastoAlmuerzo(gasto) {
    const respuesta = await fetch(URL_GASTOS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(gasto),
    });
    if (!respuesta.ok) {
        throw new Error("No se pudo registrar el gasto de almuerzo.");
    }
    return await respuesta.json();
}