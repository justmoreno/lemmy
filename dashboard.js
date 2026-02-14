// Cargar datos
let categorias = JSON.parse(localStorage.getItem("categorias")) || [];
let mediosPago = JSON.parse(localStorage.getItem("mediosPago")) || [];

const listaCategorias = document.getElementById("listaCategorias");
const listaMediosPago = document.getElementById("listaMediosPago");

function actualizarListas() {
    listaCategorias.innerHTML = "";
    categorias.forEach((cat, idx) => {
        const li = document.createElement("li");
        li.textContent = cat;
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.onclick = () => {
            categorias.splice(idx,1);
            localStorage.setItem("categorias", JSON.stringify(categorias));
            actualizarListas();
        };
        li.appendChild(btnEliminar);
        listaCategorias.appendChild(li);
    });

    listaMediosPago.innerHTML = "";
    mediosPago.forEach((med, idx) => {
        const li = document.createElement("li");
        li.textContent = med;
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.onclick = () => {
            mediosPago.splice(idx,1);
            localStorage.setItem("mediosPago", JSON.stringify(mediosPago));
            actualizarListas();
        };
        li.appendChild(btnEliminar);
        listaMediosPago.appendChild(li);
    });
}

// Agregar nueva categoría
document.getElementById("btnAgregarCategoria").addEventListener("click", () => {
    const cat = document.getElementById("nuevaCategoria").value.trim();
    if(cat && !categorias.includes(cat)) {
        categorias.push(cat);
        localStorage.setItem("categorias", JSON.stringify(categorias));
        document.getElementById("nuevaCategoria").value = "";
        actualizarListas();
    }
});

// Agregar nuevo medio de pago
document.getElementById("btnAgregarMedio").addEventListener("click", () => {
    const med = document.getElementById("nuevoMedioPago").value.trim();
    if(med && !mediosPago.includes(med)) {
        mediosPago.push(med);
        localStorage.setItem("mediosPago", JSON.stringify(mediosPago));
        document.getElementById("nuevoMedioPago").value = "";
        actualizarListas();
    }
});

// Botón volver
document.getElementById("btnVolver").addEventListener("click", ()=>{
    window.location.href="index.html";
});

// Inicializar listas
actualizarListas();
