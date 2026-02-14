// Array para guardar los productos
let productos = [];

// Referencias al DOM
const form = document.getElementById("formAgregar");
const tabla = document.querySelector("#tablaProductos tbody");
const btnVolver = document.getElementById("btnVolver");
const botonSubmit = form.querySelector("button[type='submit']");

// Campos especiales
const tieneBalde = document.getElementById("tieneBalde");
const cantidadBalde = document.getElementById("cantidadBalde");
const precioBalde = document.getElementById("precioBalde");

const tieneOferta = document.getElementById("tieneOferta");
const cantidadOferta = document.getElementById("cantidadOferta");
const precioOferta = document.getElementById("precioOferta");

const selectCategoria = document.getElementById("categoria");

let indexEditar = null; // índice del producto que se está editando

// --- Cargar categorías dinámicas desde Dashboard (si existen) ---
const categorias = JSON.parse(localStorage.getItem("categorias")) || ["cerveza","tragos","sin alcohol","otros"];
selectCategoria.innerHTML = categorias.map(c => `<option value="${c}">${c}</option>`).join("");

// --- Cargar productos desde localStorage al iniciar ---
if(localStorage.getItem("productos")) {
    productos = JSON.parse(localStorage.getItem("productos"));
    actualizarTabla();
}

// --- Función para actualizar tabla ---
function actualizarTabla() {
    tabla.innerHTML = "";
    productos.forEach((prod, index) => {
        let opcionesEspeciales = [];
        if(prod.tieneBalde) opcionesEspeciales.push(`Balde (${prod.cantidadPorBalde})`);
        if(prod.tieneOferta) opcionesEspeciales.push(`Oferta (${prod.cantidadPorOferta})`);
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${prod.nombre}</td>
            <td>${prod.categoria}</td>
            <td>${prod.precios.unidad.toFixed(2)}</td>
            <td>${prod.costoUnidad.toFixed(2)}</td>
            <td>${prod.stock}</td>
            <td>${opcionesEspeciales.join(", ")}</td>
            <td>
                <button onclick="editarProducto(${index})">Editar</button>
                <button onclick="eliminarProducto(${index})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });

    // Guardar siempre en localStorage
    localStorage.setItem("productos", JSON.stringify(productos));
}

// --- Función agregar o actualizar producto ---
form.addEventListener("submit", function(e){
    e.preventDefault();

    // Validaciones para balde/oferta
    if(tieneBalde.checked){
        if(!cantidadBalde.value || cantidadBalde.value < 2) return alert("Ingresa cantidad válida para balde");
        if(!precioBalde.value || precioBalde.value <= 0) return alert("Ingresa precio válido para balde");
    }
    if(tieneOferta.checked){
        if(!cantidadOferta.value || cantidadOferta.value < 1) return alert("Ingresa cantidad válida para oferta");
        if(!precioOferta.value || precioOferta.value <= 0) return alert("Ingresa precio válido para oferta");
    }

    // Crear objeto unificado
    const nuevo = {
        nombre: document.getElementById("nombre").value,
        categoria: selectCategoria.value,
        costoUnidad: parseFloat(document.getElementById("costo").value),
        stock: parseInt(document.getElementById("stock").value),
        precios: {
            unidad: parseFloat(document.getElementById("precioUnidad").value),
            balde: tieneBalde.checked ? parseFloat(precioBalde.value) : null,
            oferta: tieneOferta.checked ? parseFloat(precioOferta.value) : null
        },
        tieneBalde: tieneBalde.checked,
        cantidadPorBalde: tieneBalde.checked ? parseInt(cantidadBalde.value) : 0,
        tieneOferta: tieneOferta.checked,
        cantidadPorOferta: tieneOferta.checked ? parseInt(cantidadOferta.value) : 0
    };

    if(indexEditar !== null){
        // Actualizar producto existente
        productos[indexEditar] = nuevo;
        indexEditar = null;
        botonSubmit.textContent = "Agregar Producto";
    } else {
        // Agregar nuevo producto
        productos.push(nuevo);
    }

    form.reset();
    document.getElementById("configBalde").style.display = "none";
    document.getElementById("configOferta").style.display = "none";

    actualizarTabla();
});

// --- Función eliminar producto ---
function eliminarProducto(index) {
    if(confirm("¿Eliminar este producto?")){
        productos.splice(index,1);
        actualizarTabla();
    }
}

// --- Función editar producto ---
function editarProducto(index) {
    const prod = productos[index];
    document.getElementById("nombre").value = prod.nombre;
    selectCategoria.value = prod.categoria;
    document.getElementById("costo").value = prod.costoUnidad;
    document.getElementById("precioUnidad").value = prod.precios.unidad || 0;
    document.getElementById("stock").value = prod.stock;

    // Configuración de balde
    tieneBalde.checked = prod.tieneBalde;
    if(prod.tieneBalde){
        document.getElementById("configBalde").style.display = "block";
        cantidadBalde.value = prod.cantidadPorBalde;
        precioBalde.value = prod.precios.balde || 0;
    } else {
        document.getElementById("configBalde").style.display = "none";
        cantidadBalde.value = "";
        precioBalde.value = "";
    }

    // Configuración de oferta
    tieneOferta.checked = prod.tieneOferta;
    if(prod.tieneOferta){
        document.getElementById("configOferta").style.display = "block";
        cantidadOferta.value = prod.cantidadPorOferta;
        precioOferta.value = prod.precios.oferta || 0;
    } else {
        document.getElementById("configOferta").style.display = "none";
        cantidadOferta.value = "";
        precioOferta.value = "";
    }

    indexEditar = index;
    botonSubmit.textContent = "Actualizar Producto";
}

// --- Volver al menú principal ---
btnVolver.addEventListener("click", function(){
    window.location.href = "index.html";
});
