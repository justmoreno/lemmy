// ============================
// REPORTE.JS - LEMMY BAR (PRO)
// ============================

// Registro interno de ventas (NO tickets)
let registroVentas = JSON.parse(localStorage.getItem("registroVentas")) || [];

// DOM
const btnActualizarReportes = document.getElementById("btnActualizarReportes");
const btnCerrarTurno = document.getElementById("btnCerrarTurno");
const ingresosMedioPago = document.getElementById("ingresosMedioPago");
const tablaProductos = document.querySelector("#tablaProductos tbody");
const tablaProductoMedioPago = document.querySelector("#tablaProductoMedioPago tbody");
const gananciaTotalSpan = document.getElementById("gananciaTotal");
const btnVolver = document.getElementById("btnVolver");

// ============================
// Generar reportes
// ============================
function generarReportes() {

    ingresosMedioPago.innerHTML = "";
    tablaProductos.innerHTML = "";
    tablaProductoMedioPago.innerHTML = "";
    gananciaTotalSpan.textContent = "0.00";

    let gananciaTotal = 0;

    // ============================
    // 1️⃣ Ingresos totales por medio de pago
    // ============================
    const ingresosPorPago = {};

    registroVentas.forEach(v => {
        ingresosPorPago[v.medioPago] =
            (ingresosPorPago[v.medioPago] || 0) + v.ingresos;
    });

    Object.entries(ingresosPorPago).forEach(([medio, total]) => {
        const li = document.createElement("li");
        li.textContent = `${medio}: S/ ${total.toFixed(2)}`;
        ingresosMedioPago.appendChild(li);
    });

    // ============================
    // 2️⃣ Reporte general por producto
    // ============================
    const resumenProductos = {};

    registroVentas.forEach(v => {
        if (!resumenProductos[v.producto]) {
            resumenProductos[v.producto] = {
                unidades: 0,
                ingresos: 0,
                costos: 0,
                ganancia: 0
            };
        }

        resumenProductos[v.producto].unidades += v.unidadesVendidas;
        resumenProductos[v.producto].ingresos += v.ingresos;
        resumenProductos[v.producto].costos += v.costoTotal;
        resumenProductos[v.producto].ganancia += v.ganancia;
    });

    Object.entries(resumenProductos).forEach(([producto, p]) => {
        gananciaTotal += p.ganancia;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${producto}</td>
            <td>${p.unidades}</td>
            <td>S/ ${p.ingresos.toFixed(2)}</td>
            <td>S/ ${p.costos.toFixed(2)}</td>
            <td>S/ ${p.ganancia.toFixed(2)}</td>
        `;
        tablaProductos.appendChild(fila);
    });

    // ============================
    // 3️⃣ Ingresos por producto y medio de pago
    // ============================
    const productoMedioPago = {};

    registroVentas.forEach(v => {
        if (!productoMedioPago[v.producto]) {
            productoMedioPago[v.producto] = {};
        }

        productoMedioPago[v.producto][v.medioPago] =
            (productoMedioPago[v.producto][v.medioPago] || 0) + v.ingresos;
    });

    Object.entries(productoMedioPago).forEach(([producto, medios]) => {
        Object.entries(medios).forEach(([medio, total]) => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${producto}</td>
                <td>${medio}</td>
                <td>S/ ${total.toFixed(2)}</td>
            `;
            tablaProductoMedioPago.appendChild(fila);
        });
    });

    // ============================
    // Ganancia neta total
    // ============================
    gananciaTotalSpan.textContent = gananciaTotal.toFixed(2);
}

// ============================
// Cerrar turno (LIMPIEZA TOTAL)
// ============================
function limpiarVentas() {
    if (!confirm("¿Cerrar turno y borrar todas las ventas del día?")) return;

    // Vaciar registros
    registroVentas = [];
    localStorage.setItem("registroVentas", JSON.stringify([]));
    localStorage.setItem("historialVentas", JSON.stringify([]));

    // Refrescar reportes
    generarReportes();

    alert("Turno cerrado. Sistema listo para un nuevo día.");
}

// ============================
// Eventos
// ============================
btnActualizarReportes.addEventListener("click", generarReportes);
btnCerrarTurno.addEventListener("click", limpiarVentas);
btnVolver.addEventListener("click", () => window.location.href = "index.html");

// ============================
// Inicializar
// ============================
generarReportes();
