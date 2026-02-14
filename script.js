// Este archivo manejará la navegación entre ventanas de Lemmy
document.getElementById("btnAgregar").addEventListener("click", function() {
    alert("Ir a ventana de Agregar Productos");
});

document.getElementById("btnVender").addEventListener("click", function() {
    alert("Ir a ventana de Vender");
});

document.getElementById("btnCerrar").addEventListener("click", function() {
    alert("Ir a ventana de Cerrar Turno");
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
