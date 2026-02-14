// Productos y ticket
let productos = JSON.parse(localStorage.getItem("productos")) || [];
let ticketActual = [];
let total = 0;
let medioPagoSeleccionado = null;

// DOM
const selectCategoria = document.getElementById("selectCategoria");
const selectProducto = document.getElementById("selectProducto");
const divTipoVenta = document.getElementById("divTipoVenta");
const selectTipoVenta = document.getElementById("selectTipoVenta");
const cantidadProducto = document.getElementById("cantidadProducto");
const btnAgregarProducto = document.getElementById("btnAgregarProducto");
const listaTicket = document.getElementById("listaTicket");
const spanTotal = document.getElementById("total");
const btnImprimirTicket = document.getElementById("btnImprimirTicket");
const btnVolver = document.getElementById("btnVolver");
const btnCancelarVenta = document.getElementById("btnCancelarVenta");
const contenedorMediosPago = document.getElementById("contenedorMediosPago");

// --------------------
// Inicializar dinámicos
// --------------------

// Llenar categorías desde localStorage
function inicializarCategorias() {
    const categorias = JSON.parse(localStorage.getItem("categorias")) || [];
    selectCategoria.innerHTML = '<option value="">--Seleccionar--</option>';
    categorias.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        selectCategoria.appendChild(opt);
    });
}

// Llenar medios de pago desde localStorage
function inicializarMediosPago() {
    const medios = JSON.parse(localStorage.getItem("mediosPago")) || [];
    contenedorMediosPago.innerHTML = "";
    medios.forEach(m => {
        const btn = document.createElement("button");
        btn.textContent = m.charAt(0).toUpperCase() + m.slice(1);
        btn.className = "medioPago";
        btn.dataset.pago = m;
        btn.style.margin = "5px";
        btn.style.padding = "10px";
        btn.style.backgroundColor = "#666";
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.borderRadius = "6px";
        btn.style.cursor = "pointer";
        btn.addEventListener("click", () => seleccionarMedioPago(btn, m));
        contenedorMediosPago.appendChild(btn);
    });
}

// Selección de medio de pago
function seleccionarMedioPago(btn, medio) {
    medioPagoSeleccionado = medio;
    document.querySelectorAll("#contenedorMediosPago button").forEach(b => b.style.backgroundColor = "#666");
    btn.style.backgroundColor = "#ff0000";
}

// --------------------
// Manejo de productos
// --------------------

// Filtrar productos por categoría
selectCategoria.addEventListener("change", function() {
    selectProducto.innerHTML = '<option value="">--Seleccionar--</option>';
    const categoria = selectCategoria.value;
    const filtrados = productos.filter(p => p.categoria === categoria && p.stock > 0);
    filtrados.forEach(p => {
        const indexReal = productos.findIndex(prod => prod.nombre === p.nombre && prod.categoria === p.categoria);
        const opt = document.createElement("option");
        opt.value = indexReal;
        opt.textContent = `${p.nombre} (Stock: ${p.stock})`;
        selectProducto.appendChild(opt);
    });

    divTipoVenta.style.display = "none";
    selectTipoVenta.innerHTML = "";
});

// Mostrar tipo de venta según producto
selectProducto.addEventListener("change", function() {
    const index = parseInt(this.value);
    if(isNaN(index)) {
        divTipoVenta.style.display = "none";
        return;
    }
    const prod = productos[index];
    selectTipoVenta.innerHTML = "";

    // Siempre unidad
    const optUnidad = document.createElement("option");
    optUnidad.value = "unidad";
    optUnidad.textContent = "Unidad";
    selectTipoVenta.appendChild(optUnidad);

    if(prod.tieneBalde) {
        const optBalde = document.createElement("option");
        optBalde.value = "balde";
        optBalde.textContent = `Balde (${prod.cantidadPorBalde})`;
        selectTipoVenta.appendChild(optBalde);
    }
    if(prod.tieneOferta) {
        const optOferta = document.createElement("option");
        optOferta.value = "oferta";
        optOferta.textContent = `Oferta (${prod.cantidadPorOferta})`;
        selectTipoVenta.appendChild(optOferta);
    }
    divTipoVenta.style.display = "block";
});

// Agregar producto al ticket
btnAgregarProducto.addEventListener("click", function() {
    const index = parseInt(selectProducto.value);
    const tipoVenta = selectTipoVenta.value;
    let cantidad = parseInt(cantidadProducto.value);
    if(isNaN(index) || !tipoVenta || cantidad < 1) return alert("Selecciona producto, tipo de venta y cantidad válida");

    const prod = productos[index];
    let stockNecesario = cantidad;
    let precioVenta = 0;
    let cantidadReal = cantidad;

    if(tipoVenta === "unidad") {
        precioVenta = prod.precios.unidad * cantidad;
        if(cantidad > prod.stock) return alert("No hay suficiente stock");
    } else if(tipoVenta === "balde") {
        stockNecesario = cantidad * prod.cantidadPorBalde;
        precioVenta = prod.precios.balde * cantidad;
        if(stockNecesario > prod.stock) return alert("No hay suficiente stock para balde(s)");
    } else if(tipoVenta === "oferta") {
        stockNecesario = cantidad * prod.cantidadPorOferta;
        precioVenta = prod.precios.oferta * cantidad;
        if(stockNecesario > prod.stock) return alert("No hay suficiente stock para la oferta(s)");
    }

    ticketActual.push({
        index: index,
        nombre: prod.nombre,
        tipoVenta: tipoVenta,
        cantidad: cantidadReal,
        stockUsado: stockNecesario,
        precioVenta: precioVenta
    });

    actualizarTicket();
});

// Actualizar ticket en pantalla
function actualizarTicket() {
    listaTicket.innerHTML = "";
    total = ticketActual.reduce((acc, item) => acc + item.precioVenta, 0);
    ticketActual.forEach(item => {
        let tipo = item.tipoVenta.charAt(0).toUpperCase() + item.tipoVenta.slice(1);
        const li = document.createElement("li");
        li.textContent = `${item.cantidad} ${tipo} ${item.nombre}`;
        listaTicket.appendChild(li);
    });
    spanTotal.textContent = total.toFixed(2);
}

// Imprimir ticket
btnImprimirTicket.addEventListener("click", function() {
    if(ticketActual.length === 0) return alert("No hay productos en el ticket");
    if(!medioPagoSeleccionado) return alert("Selecciona medio de pago");


// ============================
// REGISTRO INTERNO DE VENTAS
// ============================
const registroVentas = JSON.parse(localStorage.getItem("registroVentas")) || [];

ticketActual.forEach(item => {
    const prod = productos[item.index];

    const costoTotal = item.stockUsado * prod.costoUnidad;
    const ingresos = item.precioVenta;
    const ganancia = ingresos - costoTotal;

    registroVentas.push({
        fecha: new Date().toLocaleString(),
        medioPago: medioPagoSeleccionado,
        producto: prod.nombre,
        categoria: prod.categoria,
        unidadesVendidas: item.stockUsado,
        ingresos: ingresos,
        costoTotal: costoTotal,
        ganancia: ganancia
    });
});

localStorage.setItem("registroVentas", JSON.stringify(registroVentas));




    ticketActual.forEach(item => {
        productos[item.index].stock -= item.stockUsado;
    });
    localStorage.setItem("productos", JSON.stringify(productos));

    const historial = JSON.parse(localStorage.getItem("historialVentas")) || [];
    historial.push({
        productos: ticketActual,
        total: total,
        medioPago: medioPagoSeleccionado,
        fecha: new Date().toLocaleString()
    });
    localStorage.setItem("historialVentas", JSON.stringify(historial));

    // Imprimir
    let ventana = window.open("", "PRINT", "width=300,height=600");
    ventana.document.write("<pre style='font-size:24px; font-family:monospace;'>");
    ventana.document.write("***** TICKET *****\n\n");
    ticketActual.forEach(item => {
        let tipo = item.tipoVenta.charAt(0).toUpperCase() + item.tipoVenta.slice(1);
        ventana.document.write(`${item.cantidad} ${tipo} ${item.nombre}\n`);
    });
    ventana.document.write(`\nPago: ${medioPagoSeleccionado} - Total: S/ ${total.toFixed(2)}\n`);
    ventana.document.write("\n***** Gracias! *****");
    ventana.document.write("</pre>");
    ventana.document.close();
    ventana.focus();
    ventana.print();
    ventana.close();

    ticketActual = [];
    medioPagoSeleccionado = null;
    actualizarTicket();
    selectCategoria.value = "";
    selectProducto.innerHTML = '<option value="">--Seleccionar--</option>';
    divTipoVenta.style.display = "none";
});

// Cancelar venta
btnCancelarVenta.addEventListener("click", function() {
    if(confirm("¿Cancelar esta venta?")) {
        ticketActual = [];
        medioPagoSeleccionado = null;
        actualizarTicket();
        selectCategoria.value = "";
        selectProducto.innerHTML = '<option value="">--Seleccionar--</option>';
        divTipoVenta.style.display = "none";
    }
});

// Volver al menú
btnVolver.addEventListener("click", function() {
    window.location.href = "index.html";
});

// Inicializar
inicializarCategorias();
inicializarMediosPago();
actualizarTicket();
