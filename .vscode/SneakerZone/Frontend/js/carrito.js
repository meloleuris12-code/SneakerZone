// ===============================
// OBTENER CARRITO
// ===============================

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


// ===============================
// ELEMENTOS HTML
// ===============================

const listaCarrito = document.getElementById("lista-carrito");

const subtotalElemento = document.getElementById("subtotal");

const envioElemento = document.getElementById("envio");

const totalElemento = document.getElementById("total");

const contadorCarrito = document.getElementById("contador-carrito");

const botonCheckout = document.getElementById("btn-checkout");


// ===============================
// MOSTRAR CARRITO
// ===============================

function mostrarCarrito() {

    listaCarrito.innerHTML = "";


    // Si el carrito está vacío

    if (carrito.length === 0) {

        listaCarrito.innerHTML = `

            <div class="carrito-vacio">

                <h3>
                    Tu carrito está vacío
                </h3>

                <p>
                    Todavía no has agregado ningún tenis.
                </p>

                <a href="productos.html">
                    Ver productos
                </a>

            </div>

        `;


        subtotalElemento.textContent = "RD$ 0";

        envioElemento.textContent = "RD$ 0";

        totalElemento.textContent = "RD$ 0";

        contadorCarrito.textContent = "0";

        return;

    }


    // Mostrar cada producto

    carrito.forEach(function(producto, index) {

        const productoHTML = document.createElement("div");

        productoHTML.classList.add("producto-carrito");


        productoHTML.innerHTML = `

            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
            >


            <div class="info-producto">

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    Marca: ${producto.marca}
                </p>

                <p>
                    Talla: ${producto.talla}
                </p>


                <div class="cantidad">

                    <button
                        onclick="disminuirCantidad(${index})">

                        -

                    </button>


                    <span>
                        ${producto.cantidad}
                    </span>


                    <button
                        onclick="aumentarCantidad(${index})">

                        +

                    </button>

                </div>


                <button
                    class="btn-eliminar"
                    onclick="eliminarProducto(${index})">

                    Eliminar

                </button>

            </div>


            <div class="precio-producto">

                RD$ ${(producto.precio * producto.cantidad).toLocaleString()}

            </div>

        `;


        listaCarrito.appendChild(productoHTML);

    });


    actualizarTotales();

}


// ===============================
// ACTUALIZAR TOTALES
// ===============================

function actualizarTotales() {

    let subtotal = 0;

    let cantidadProductos = 0;


    carrito.forEach(function(producto) {

        subtotal += producto.precio * producto.cantidad;

        cantidadProductos += producto.cantidad;

    });


    // Envío

    let envio = 0;


    if (subtotal > 0) {

        envio = 300;

    }


    const total = subtotal + envio;


    subtotalElemento.textContent =
        "RD$ " + subtotal.toLocaleString();


    envioElemento.textContent =
        "RD$ " + envio.toLocaleString();


    totalElemento.textContent =
        "RD$ " + total.toLocaleString();


    contadorCarrito.textContent =
        cantidadProductos;

}


// ===============================
// AUMENTAR CANTIDAD
// ===============================

function aumentarCantidad(index) {

    carrito[index].cantidad++;


    guardarCarrito();

}


// ===============================
// DISMINUIR CANTIDAD
// ===============================

function disminuirCantidad(index) {

    if (carrito[index].cantidad > 1) {

        carrito[index].cantidad--;

    }


    guardarCarrito();

}


// ===============================
// ELIMINAR PRODUCTO
// ===============================

function eliminarProducto(index) {

    carrito.splice(index, 1);


    guardarCarrito();

}


// ===============================
// GUARDAR CARRITO
// ===============================

function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );


    mostrarCarrito();

}


// ===============================
// FINALIZAR COMPRA
// ===============================

botonCheckout.addEventListener(
    "click",
    function() {

        if (carrito.length === 0) {

            alert(
                "Tu carrito está vacío."
            );

            return;

        }


        window.location.href =
            "checkout.html";

    }
);


// ===============================
// INICIAR
// ===============================

mostrarCarrito();