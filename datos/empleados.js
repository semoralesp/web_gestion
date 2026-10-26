const URL_EMPLEADOS = "http://localhost:4000/empleados";

export async function obtenerEmpleados() {
  const respuesta = await fetch(URL_EMPLEADOS);

  if (!respuesta.ok) {
    throw new Error("No se pudieron obtener los empleados.");
  }

  return await respuesta.json();
}

export async function obtenerEmpleado(id) {
  const respuesta = await fetch(`${URL_EMPLEADOS}/${id}`);

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el empleado.");
  }

  return await respuesta.json();
}

export async function registrarEmpleado(empleado) {
  const respuesta = await fetch(URL_EMPLEADOS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(empleado),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo registrar el empleado.");
  }

  return await respuesta.json();
}

export async function actualizarEmpleado(id, empleado) {
  const respuesta = await fetch(`${URL_EMPLEADOS}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(empleado),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo actualizar el empleado.");
  }

  return await respuesta.json();
}

export async function eliminarEmpleado(id) {
  const respuesta = await fetch(`${URL_EMPLEADOS}/${id}`, {
    method: "DELETE",
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo eliminar el empleado.");
  }
}