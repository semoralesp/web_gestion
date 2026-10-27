import QUnit from "qunit";
import { registrarGastoAlmuerzo } from "../datos/gastos_almuerzo.js";

QUnit.module("Pruebas de Gasto Almuerzo", function () {

  QUnit.test("Registrar gasto correctamente", async function (assert) {
    const gasto = {
      fecha: "27/10/2026",
      nombre: "Pollo con arroz",
      monto: 5000,
      descripcion: "Almuerzo del dia",
    };

    globalThis.fetch = async function (url, opciones) {
      assert.equal(url, "http://localhost:4000/gastos_almuerzo");
      assert.equal(opciones.method, "POST");

      return {
        ok: true,
        json: async function () {
          return { id: "1", ...gasto };
        },
      };
    };

    const resultado = await registrarGastoAlmuerzo(gasto);

    assert.equal(resultado.id, "1");
    assert.equal(resultado.monto, 5000);
  });

  QUnit.test("Error al registrar gasto", async function (assert) {
    globalThis.fetch = async function () {
      return { ok: false };
    };

    await registrarGastoAlmuerzo({ monto: 5000 })
      .then(function () {
        assert.ok(false, "Debió producir un error");
      })
      .catch(function (error) {
        assert.equal(
          error.message,
          "No se pudo registrar el gasto de almuerzo."
        );
      });
  });

});