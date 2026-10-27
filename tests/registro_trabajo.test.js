import QUnit from "qunit";
import { registrarTrabajoDatos } from "../datos/registro_trabajo.js";

QUnit.module("Pruebas de Registro de Trabajo", function () {

  QUnit.test("Registrar trabajo correctamente", async function (assert) {
    const trabajo = {
      fecha: "27/10/2026",
      nombre: "Reparacion de motor",
      descripcion: "Cambio de piezas",
      estado: "Completado",
    };
    globalThis.fetch = async function (url, opciones) {
      assert.equal(url, "http://localhost:4000/trabajos");
      assert.equal(opciones.method, "POST");

      return {
        ok: true,
        json: async function () {
          return { id: "1", ...trabajo };
        },
      };
    };

    const resultado = await registrarTrabajoDatos(trabajo);
    assert.equal(resultado.id, "1");
    assert.equal(resultado.estado, "Completado");
  });
  QUnit.test("Error al registrar trabajo", async function (assert) {
    globalThis.fetch = async function () {
      return { ok: false };
    };
    await registrarTrabajoDatos({ estado: "Pendiente" })
      .then(function () {
        assert.ok(false, "Debió producir un error");
      })
      .catch(function (error) {
        assert.equal(
          error.message,
          "No se pudo registrar el trabajo"
        );
      });
  });

});