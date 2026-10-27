const URL_EMPLEADOS = "http://localhost:4000/empleados";
const URL_GASTOS = "http://localhost:4000/gastos_almuerzo";
const URL_ASISTENCIA = "http://localhost:4000/asistencia";

export async function obtenerEmpleados() {
    const respuesta = await fetch(URL_EMPLEADOS);
    if (!respuesta.ok) throw new Error("Error al obtener empleados.");
    return await respuesta.json();
}

export async function obtenerEstadisticas(empleadoId) {
    const resEmpleados = await fetch(URL_EMPLEADOS);
    const resGastos = await fetch(URL_GASTOS);
    const resAsistencia = await fetch(URL_ASISTENCIA);

    const empleados = await resEmpleados.json();
    const gastos = await resGastos.json();
    const asistencia = await resAsistencia.json();

    let gastosFiltrados = gastos;
    let asistenciaFiltrada = asistencia;
    let totalUsuarios = empleados.length;

    if (empleadoId) {
        gastosFiltrados = gastos.filter(gasto => gasto.empleadoId === empleadoId);
        asistenciaFiltrada = asistencia.filter(asis => asis.empleadoId === empleadoId);
        totalUsuarios = 1;
    }

    const totalGastos = gastosFiltrados.reduce((suma, gasto) => suma + Number(gasto.monto), 0);
    const entradas = asistenciaFiltrada.filter(a => a.tipo === "Entrada").length;
    const totalHoras = entradas * 8; 

    return {
        totalUsuarios,
        totalHoras,
        totalGastos
    };
}