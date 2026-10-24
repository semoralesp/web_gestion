import QUnit from "qunit";
import {
  obtenerEmpleados,
  obtenerEmpleado,
  registrarEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
} from "../datos/empleados.js";

QUnit.module("Pruebas de empleados", function () {
  QUnit.test("Obtener empleados correctamente", async function (assert) {
    const empleados = [
      {
        id: "1",
        rut: "123456785",
        nombre: "Jose",
        apellido: "Gonzalez",
        telefono: "912345678",
        correo: "jose@electromechanic.cl",
      },
    ];

    globalThis.fetch = async function () {
      return {
        ok: true,
        json: async function () {
          return empleados;
        },
      };
    };

    const resultado = await obtenerEmpleados();

    assert.equal(resultado.length, 1);
    assert.equal(resultado[0].nombre, "Jose");
  });

  QUnit.test("Error al obtener empleados", async function (assert) {
    globalThis.fetch = async function () {
      return { ok: false };
    };

    await obtenerEmpleados()
      .then(function () {
        assert.ok(false, "Debió producir un error");
      })
      .catch(function (error) {
        assert.equal(
          error.message,
          "No se pudieron obtener los empleados."
        );
      });
  });

  QUnit.test("Obtener un empleado por ID", async function (assert) {
    globalThis.fetch = async function (url) {
      assert.equal(url, "http://localhost:4000/empleados/1");

      return {
        ok: true,
        json: async function () {
          return { id: "1", nombre: "Jose" };
        },
      };
    };

    const resultado = await obtenerEmpleado("1");

    assert.equal(resultado.id, "1");
    assert.equal(resultado.nombre, "Jose");
  });

  QUnit.test("Registrar empleado correctamente", async function (assert) {
    const empleado = {
      rut: "123456785",
      nombre: "Jose",
      apellido: "Gonzalez",
      telefono: "912345678",
      correo: "jose@electromechanic.cl",
    };

    globalThis.fetch = async function (url, opciones) {
      assert.equal(url, "http://localhost:4000/empleados");
      assert.equal(opciones.method, "POST");

      return {
        ok: true,
        json: async function () {
          return { id: "1", ...empleado };
        },
      };
    };

    const resultado = await registrarEmpleado(empleado);

    assert.equal(resultado.id, "1");
    assert.equal(resultado.nombre, "Jose");
  });

  QUnit.test("Actualizar empleado correctamente", async function (assert) {
    const empleado = {
      rut: "123456785",
      nombre: "Jose",
      apellido: "Gonzalez",
      telefono: "912345678",
      correo: "jose@electromechanic.cl",
    };

    globalThis.fetch = async function (url, opciones) {
      assert.equal(url, "http://localhost:4000/empleados/1");
      assert.equal(opciones.method, "PUT");

      return {
        ok: true,
        json: async function () {
          return { id: "1", ...empleado };
        },
      };
    };

    const resultado = await actualizarEmpleado("1", empleado);

    assert.equal(resultado.id, "1");
    assert.equal(resultado.nombre, "Jose");
  });

  QUnit.test("Eliminar empleado correctamente", async function (assert) {
    globalThis.fetch = async function (url, opciones) {
      assert.equal(url, "http://localhost:4000/empleados/1");
      assert.equal(opciones.method, "DELETE");

      return { ok: true };
    };

    const resultado = await eliminarEmpleado("1");

    assert.strictEqual(resultado, undefined);
  });
});