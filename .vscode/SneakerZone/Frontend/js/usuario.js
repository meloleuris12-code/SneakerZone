console.log("usuario.js cargado correctamente");

const usuarioGuardado = localStorage.getItem("usuario");

console.log("Datos guardados:", usuarioGuardado);

const nombreUsuario = document.getElementById("nombre-usuario");
const correoUsuario = document.getElementById("correo-usuario");
const telefonoUsuario = document.getElementById("telefono-usuario");
const direccionUsuario = document.getElementById("direccion-usuario");
const botonCerrarSesion = document.getElementById("cerrar-sesion");
const listaPedidos = document.getElementById("lista-pedidos");


// ==========================================
// PASOS DEL SEGUIMIENTO DEL PEDIDO
// ==========================================
//
// Estos son los estados posibles de un pedido,
// en el orden en el que normalmente avanzan.
// "Cancelado" se maneja aparte porque no es
// parte del flujo normal de seguimiento.

const PASOS_PEDIDO = [
    "Pendiente",
    "Procesando",
    "Enviado",
    "Entregado"
];


if (usuarioGuardado) {


const usuario = JSON.parse(usuarioGuardado);

console.log("Usuario:", usuario);

nombreUsuario.innerText =
    (usuario.nombre || "") +
    " " +
    (usuario.apellido || "");

correoUsuario.innerText =
    usuario.correo || "No disponible";

telefonoUsuario.innerText =
    usuario.telefono || "No disponible";

direccionUsuario.innerText =
    usuario.direccion || "No disponible";


// ==========================================
// CARGAR PEDIDOS DEL CLIENTE
// ==========================================

cargarPedidos(usuario.id_cliente);


} else {


nombreUsuario.innerText =
    "No has iniciado sesión";

correoUsuario.innerText =
    "No disponible";

telefonoUsuario.innerText =
    "No disponible";

direccionUsuario.innerText =
    "No disponible";


if (listaPedidos) {

    listaPedidos.innerHTML = `
        <p class="pedidos-vacio">
            Inicia sesión para ver tus pedidos.
        </p>
    `;

}


}

botonCerrarSesion.addEventListener(
"click",
function () {


    localStorage.removeItem("usuario");

    alert(
        "Has cerrado sesión correctamente"
    );

    window.location.href =
        "index.html";

}


);


// ==========================================
// CARGAR PEDIDOS DESDE EL SERVIDOR
// ==========================================

async function cargarPedidos(idCliente) {

    if (!listaPedidos) {

        return;

    }

    if (!idCliente) {

        listaPedidos.innerHTML = `
            <p class="pedidos-vacio">
                No se pudo identificar tu cuenta.
                Inicia sesión nuevamente.
            </p>
        `;

        return;

    }

    try {

        const respuesta =
            await fetch(
                "http://localhost:8080/pedidos?id_cliente=" +
                idCliente
            );

        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener los pedidos"
            );

        }

        const pedidos =
            await respuesta.json();

        mostrarPedidos(pedidos);

    } catch (error) {

        console.error(
            "Error al cargar pedidos:",
            error
        );

        listaPedidos.innerHTML = `
            <p class="pedidos-vacio">
                No se pudieron cargar tus pedidos.
                Verifica que el servidor esté encendido.
            </p>
        `;

    }

}


// ==========================================
// MOSTRAR PEDIDOS EN PANTALLA
// ==========================================

function mostrarPedidos(pedidos) {

    listaPedidos.innerHTML = "";

    if (!pedidos || pedidos.length === 0) {

        listaPedidos.innerHTML = `
            <div class="pedidos-vacio">

                <p>
                    Todavía no has realizado ningún pedido.
                </p>

                <a href="productos.html">
                    Ver productos
                </a>

            </div>
        `;

        return;

    }

    pedidos.forEach(function(pedido) {

        listaPedidos.appendChild(
            crearTarjetaPedido(pedido)
        );

    });

}


// ==========================================
// CREAR TARJETA DE UN PEDIDO
// ==========================================

function crearTarjetaPedido(pedido) {

    const tarjeta =
        document.createElement("article");

    tarjeta.classList.add("tarjeta-pedido");


    // ==========================================
    // ENCABEZADO DEL PEDIDO
    // ==========================================

    const encabezado =
        document.createElement("div");

    encabezado.classList.add("encabezado-pedido");

    encabezado.innerHTML = `

        <div>

            <h3>
                Pedido #${pedido.id_pedido}
            </h3>

            <span class="fecha-pedido">
                ${formatearFecha(pedido.fecha_pedido)}
            </span>

        </div>

        <div class="badge-estado ${claseEstado(pedido.estado)}">
            ${pedido.estado}
        </div>

    `;

    tarjeta.appendChild(encabezado);


    // ==========================================
    // SEGUIMIENTO (TRACKER DE PASOS)
    // ==========================================

    tarjeta.appendChild(
        crearTracker(pedido.estado)
    );


    // ==========================================
    // PRODUCTOS DEL PEDIDO
    // ==========================================

    const listaProductos =
        document.createElement("div");

    listaProductos.classList.add("productos-pedido");

    (pedido.productos || []).forEach(function(producto) {

        const item =
            document.createElement("div");

        item.classList.add("item-pedido");

        item.innerHTML = `

            <span class="nombre-item">
                ${producto.cantidad} x ${producto.nombre}
            </span>

            <span class="precio-item">
                US$ ${Number(producto.subtotal).toFixed(2)}
            </span>

        `;

        listaProductos.appendChild(item);

    });

    tarjeta.appendChild(listaProductos);


    // ==========================================
    // TOTAL DEL PEDIDO
    // ==========================================

    const totalPedido =
        document.createElement("div");

    totalPedido.classList.add("total-pedido");

    totalPedido.innerHTML = `
        <span>Total</span>
        <strong>US$ ${Number(pedido.total).toFixed(2)}</strong>
    `;

    tarjeta.appendChild(totalPedido);


    return tarjeta;

}


// ==========================================
// CREAR TRACKER DE SEGUIMIENTO
// ==========================================

function crearTracker(estado) {

    const tracker =
        document.createElement("div");

    tracker.classList.add("tracker-pedido");


    // ==========================================
    // PEDIDO CANCELADO
    // ==========================================
    //
    // Si el pedido fue cancelado, no tiene sentido
    // mostrar el avance de los pasos normales.

    if (estado === "Cancelado") {

        tracker.innerHTML = `
            <div class="tracker-cancelado">
                <i class="fa-solid fa-circle-xmark"></i>
                Este pedido fue cancelado
            </div>
        `;

        return tracker;

    }


    // ==========================================
    // PASOS NORMALES
    // ==========================================

    const pasoActual =
        PASOS_PEDIDO.indexOf(estado);

    PASOS_PEDIDO.forEach(function(paso, index) {

        const paso_html =
            document.createElement("div");

        paso_html.classList.add("paso-tracker");

        if (index <= pasoActual) {

            paso_html.classList.add("paso-completado");

        }

        if (index === pasoActual) {

            paso_html.classList.add("paso-actual");

        }

        paso_html.innerHTML = `
            <span class="punto-tracker"></span>
            <span class="texto-tracker">${paso}</span>
        `;

        tracker.appendChild(paso_html);

    });

    return tracker;

}


// ==========================================
// CLASE CSS SEGÚN EL ESTADO
// ==========================================

function claseEstado(estado) {

    const estados = {

        "Pendiente": "estado-pendiente",
        "Procesando": "estado-procesando",
        "Enviado": "estado-enviado",
        "Entregado": "estado-entregado",
        "Cancelado": "estado-cancelado"

    };

    return estados[estado] || "estado-pendiente";

}


// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatearFecha(fechaTexto) {

    if (!fechaTexto) {

        return "";

    }

    const fecha = new Date(fechaTexto);

    if (isNaN(fecha.getTime())) {

        return fechaTexto;

    }

    return fecha.toLocaleDateString(
        "es-DO",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}