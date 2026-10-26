const URL_TRABAJOS = "http://localhost:4000/trabajos";

export async function registrarTrabajoDatos(trabajo) {
    const respuesta = await fetch(URL_TRABAJOS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(trabajo)
    });

    if (!respuesta.ok) {
        throw new Error("No se pudo registrar el trabajo");
    }

    return await respuesta.json();
}