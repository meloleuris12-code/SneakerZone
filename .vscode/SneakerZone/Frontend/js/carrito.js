// ==========================================
// CARRITO - SNEAKERZONE
// ==========================================


// ==========================================
// OBTENER CARRITO
// ==========================================

let carrito =
    JSON.parse(
        localStorage.getItem("carrito")
    ) || [];


// ==========================================
// ELEMENTOS HTML
// ==========================================

const listaCarrito =
    document.getElementById(
        "lista-carrito"
    );

const subtotalElemento =
    document.getElementById(
        "subtotal"
    );

const envioElemento =
    document.getElementById(
        "envio"
    );

const totalElemento =
    document.getElementById(
        "total"
    );

const contadorCarrito =
    document.getElementById(
        "contador-carrito"
    );

const botonCheckout =
    document.getElementById(
        "btn-checkout"
    );


// ==========================================
// MOSTRAR CARRITO
// ==========================================

function mostrarCarrito() {

    if (!listaCarrito) {

        return;

    }


    listaCarrito.innerHTML = "";


    // ==========================================
    // CARRITO VACÍO
    // ==========================================

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


        actualizarTotales();

        return;

    }


    // ==========================================
    // MOSTRAR PRODUCTOS
    // ==========================================

    carrito.forEach(
        function(producto, index) {


            const productoHTML =
                document.createElement(
                    "div"
                );


            productoHTML.classList.add(
                "producto-carrito"
            );


            const precio =
                Number(
                    producto.precio
                ) || 0;


            const cantidad =
                Number(
                    producto.cantidad
                ) || 1;


            productoHTML.innerHTML = `

                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                >


                <div class="info-producto">

                    <h3>
                        ${producto.nombre}
                    </h3>


                    ${
                        producto.marca
                        ?
                        `<p>Marca: ${producto.marca}</p>`
                        :
                        ""
                    }


                    ${
                        producto.talla
                        ?
                        `<p>Talla: ${producto.talla}</p>`
                        :
                        ""
                    }


                    <div class="cantidad">

                        <button
                            onclick="disminuirCantidad(${index})">

                            -

                        </button>


                        <span>
                            ${cantidad}
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

                    US$ ${
                        (precio * cantidad)
                            .toLocaleString(
                                "en-US",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            )
                    }

                </div>

            `;


            listaCarrito.appendChild(
                productoHTML
            );

        }
    );


    // ==========================================
    // ACTUALIZAR TOTALES
    // ==========================================

    actualizarTotales();

}


// ==========================================
// ACTUALIZAR TOTALES
// ==========================================

function actualizarTotales() {

    let subtotal = 0;

    let cantidadProductos = 0;


    carrito.forEach(
        function(producto) {

            const precio =
                Number(
                    producto.precio
                ) || 0;


            const cantidad =
                Number(
                    producto.cantidad
                ) || 0;


            subtotal +=
                precio * cantidad;


            cantidadProductos +=
                cantidad;

        }
    );


    // ==========================================
    // ENVÍO
    // ==========================================

    let envio = 0;


    if (subtotal > 0) {

        envio = 25;

    }


    const total =
        subtotal + envio;


    // ==========================================
    // MOSTRAR SUBTOTAL
    // ==========================================

    if (subtotalElemento) {

        subtotalElemento.textContent =
            "US$ " +
            subtotal.toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }


    // ==========================================
    // MOSTRAR ENVÍO
    // ==========================================

    if (envioElemento) {

        envioElemento.textContent =
            "US$ " +
            envio.toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }


    // ==========================================
    // MOSTRAR TOTAL
    // ==========================================

    if (totalElemento) {

        totalElemento.textContent =
            "US$ " +
            total.toLocaleString(
                "en-US",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }


    // ==========================================
    // ACTUALIZAR CONTADOR
    // ==========================================

    if (contadorCarrito) {

        contadorCarrito.textContent =
            cantidadProductos;

    }

}


// ==========================================
// AUMENTAR CANTIDAD
// ==========================================

function aumentarCantidad(index) {

    if (!carrito[index]) {

        return;

    }


    carrito[index].cantidad =
        Number(
            carrito[index].cantidad
        ) + 1;


    guardarCarrito();

}


// ==========================================
// DISMINUIR CANTIDAD
// ==========================================

function disminuirCantidad(index) {

    if (!carrito[index]) {

        return;

    }


    const cantidadActual =
        Number(
            carrito[index].cantidad
        );


    if (cantidadActual > 1) {

        carrito[index].cantidad =
            cantidadActual - 1;

    }


    guardarCarrito();

}


// ==========================================
// ELIMINAR PRODUCTO
// ==========================================

function eliminarProducto(index) {

    if (!carrito[index]) {

        return;

    }


    carrito.splice(
        index,
        1
    );


    guardarCarrito();

}


// ==========================================
// GUARDAR CARRITO
// ==========================================

function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(
            carrito
        )
    );


    mostrarCarrito();

}


// ==========================================
// FINALIZAR COMPRA
// ==========================================

if (botonCheckout) {

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

}


// ==========================================
// INICIAR CARRITO
// ==========================================

mostrarCarrito();