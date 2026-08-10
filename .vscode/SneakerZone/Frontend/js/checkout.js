// ==========================================
// OBTENER EL CARRITO
// ==========================================

const carrito =
    JSON.parse(localStorage.getItem("carrito")) || [];


// ==========================================
// ELEMENTOS DEL CHECKOUT
// ==========================================

const contenedorProductos =
    document.getElementById("productos-checkout");

const subtotalElemento =
    document.getElementById("subtotal-checkout");

const envioElemento =
    document.getElementById("envio-checkout");

const totalElemento =
    document.getElementById("total-checkout");


// ==========================================
// ELEMENTOS DEL MÉTODO DE PAGO
// ==========================================

const metodosPago =
    document.querySelectorAll('input[name="pago"]');

const datosTarjeta =
    document.getElementById("datos-tarjeta");

const numeroTarjeta =
    document.getElementById("numero-tarjeta");

const titularTarjeta =
    document.getElementById("titular-tarjeta");

const fechaExpiracion =
    document.getElementById("fecha-expiracion");

const cvv =
    document.getElementById("cvv");


// ==========================================
// COSTO DE ENVÍO
// ==========================================

const costoEnvio = 10;


// ==========================================
// MOSTRAR / OCULTAR DATOS DE TARJETA
// ==========================================

metodosPago.forEach(function(metodo) {

    metodo.addEventListener(
        "change",
        function() {

            if (
                metodo.value === "tarjeta" &&
                metodo.checked
            ) {

                datosTarjeta.style.display = "block";

                numeroTarjeta.required = true;
                titularTarjeta.required = true;
                fechaExpiracion.required = true;
                cvv.required = true;

            }

            else if (
                metodo.value === "efectivo" &&
                metodo.checked
            ) {

                datosTarjeta.style.display = "none";

                numeroTarjeta.required = false;
                titularTarjeta.required = false;
                fechaExpiracion.required = false;
                cvv.required = false;

                numeroTarjeta.value = "";
                titularTarjeta.value = "";
                fechaExpiracion.value = "";
                cvv.value = "";
            }
        }
    );

});


// ==========================================
// FORMATEAR NÚMERO DE TARJETA
// ==========================================

numeroTarjeta.addEventListener(
    "input",
    function() {

        let valor =
            numeroTarjeta.value
                .replace(/\D/g, "")
                .substring(0, 16);

        let grupos =
            valor.match(/.{1,4}/g);

        numeroTarjeta.value =
            grupos
                ? grupos.join(" ")
                : "";
    }
);


// ==========================================
// FORMATEAR FECHA
// ==========================================

fechaExpiracion.addEventListener(
    "input",
    function() {

        let valor =
            fechaExpiracion.value
                .replace(/\D/g, "")
                .substring(0, 4);

        if (valor.length >= 3) {

            valor =
                valor.substring(0, 2) +
                "/" +
                valor.substring(2);
        }

        fechaExpiracion.value = valor;
    }
);


// ==========================================
// VALIDAR CVV
// ==========================================

cvv.addEventListener(
    "input",
    function() {

        cvv.value =
            cvv.value
                .replace(/\D/g, "")
                .substring(0, 4);
    }
);


// ==========================================
// MOSTRAR PRODUCTOS
// ==========================================

function mostrarProductos() {

    contenedorProductos.innerHTML = "";

    let subtotal = 0;


    // ==========================================
    // CARRITO VACÍO
    // ==========================================

    if (carrito.length === 0) {

        contenedorProductos.innerHTML = `
            <p>
                No hay productos en tu carrito.
            </p>
        `;

        subtotalElemento.textContent =
            "US$ 0";

        envioElemento.textContent =
            "US$ 0";

        totalElemento.textContent =
            "US$ 0";

        return;
    }


    // ==========================================
    // MOSTRAR PRODUCTOS
    // ==========================================

    carrito.forEach(function(producto) {

        subtotal +=
            Number(producto.precio) *
            Number(producto.cantidad);


        const productoHTML =
            document.createElement("div");

        productoHTML.classList.add(
            "producto-checkout"
        );


        productoHTML.innerHTML = `

            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
            >

            <div class="info-checkout">

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    ${producto.marca}
                </p>

                <p>
                    Cantidad: ${producto.cantidad}
                </p>

            </div>

            <span class="precio-checkout">

                US$ ${
                    (
                        Number(producto.precio) *
                        Number(producto.cantidad)
                    ).toFixed(2)
                }

            </span>
        `;


        contenedorProductos.appendChild(
            productoHTML
        );
    });


    // ==========================================
    // CALCULAR TOTAL
    // ==========================================

    const envio = costoEnvio;

    const total =
        subtotal + envio;


    // ==========================================
    // MOSTRAR TOTALES
    // ==========================================

    subtotalElemento.textContent =
        "US$ " +
        subtotal.toFixed(2);

    envioElemento.textContent =
        "US$ " +
        envio.toFixed(2);

    totalElemento.textContent =
        "US$ " +
        total.toFixed(2);
}


// ==========================================
// CONFIRMAR PEDIDO
// ==========================================

const formulario =
    document.getElementById(
        "formulario-checkout"
    );


formulario.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        // ==========================================
        // VERIFICAR CARRITO
        // ==========================================

        if (carrito.length === 0) {

            alert(
                "No puedes realizar un pedido con el carrito vacío."
            );

            return;
        }


        // ==========================================
        // OBTENER MÉTODO DE PAGO
        // ==========================================

        const metodoSeleccionado =
            document.querySelector(
                'input[name="pago"]:checked'
            );


        if (!metodoSeleccionado) {

            alert(
                "Selecciona un método de pago."
            );

            return;
        }


        // ==========================================
        // VALIDAR TARJETA
        // ==========================================

        if (
            metodoSeleccionado.value ===
            "tarjeta"
        ) {

            const numero =
                numeroTarjeta.value
                    .replace(/\s/g, "");


            if (numero.length !== 16) {

                alert(
                    "Introduce un número de tarjeta válido."
                );

                numeroTarjeta.focus();

                return;
            }


            if (
                titularTarjeta.value.trim() === ""
            ) {

                alert(
                    "Introduce el nombre del titular de la tarjeta."
                );

                titularTarjeta.focus();

                return;
            }


            if (
                fechaExpiracion.value.length !== 5
            ) {

                alert(
                    "Introduce una fecha de vencimiento válida. Ejemplo: 12/28"
                );

                fechaExpiracion.focus();

                return;
            }


            if (
                cvv.value.length < 3
            ) {

                alert(
                    "Introduce un CVV válido."
                );

                cvv.focus();

                return;
            }
        }


        // ==========================================
        // OBTENER USUARIO
        // ==========================================

        const usuarioGuardado =
            localStorage.getItem("usuario");


        if (!usuarioGuardado) {

            alert(
                "Debes iniciar sesión antes de realizar un pedido."
            );

            window.location.href =
                "login.html";

            return;
        }


        // ==========================================
        // CONVERTIR USUARIO
        // ==========================================

        let usuario;

        try {

            usuario =
                JSON.parse(usuarioGuardado);

        } catch (error) {

            console.error(
                "Error al obtener usuario:",
                error
            );

            alert(
                "No se pudo obtener la información del usuario."
            );

            return;
        }


        // ==========================================
        // VERIFICAR ID DEL CLIENTE
        // ==========================================

        if (!usuario.id_cliente) {

            alert(
                "No se encontró el ID del cliente. Inicia sesión nuevamente."
            );

            return;
        }


        // ==========================================
        // CALCULAR SUBTOTAL
        // ==========================================

        let subtotal = 0;

        carrito.forEach(function(producto) {

            subtotal +=
                Number(producto.precio) *
                Number(producto.cantidad);

        });


        // ==========================================
        // CALCULAR TOTAL
        // ==========================================

        const total =
            subtotal + costoEnvio;


        // ==========================================
        // PREPARAR PRODUCTOS
        // ==========================================

        const productosPedido =
            carrito.map(function(producto) {

                return {

                    id_producto:
                        Number(producto.id_producto),

                    cantidad:
                        Number(producto.cantidad),

                    precio:
                        Number(producto.precio)

                };

            });


        // ==========================================
        // CREAR PEDIDO
        // ==========================================

        const pedido = {

            id_cliente:
                Number(usuario.id_cliente),

            total:
                total,

            metodo_pago:
                metodoSeleccionado.value,

            productos:
                productosPedido
        };


        console.log(
            "Enviando pedido:",
            pedido
        );


        // ==========================================
        // ENVIAR AL SERVIDOR JAVA
        // ==========================================

        try {

            const respuesta =
                await fetch(
                    "http://localhost:8080/pedido",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(pedido)
                    }
                );


            const resultado =
                await respuesta.json();


            console.log(
                "Respuesta del servidor:",
                resultado
            );


            // ==========================================
            // PEDIDO REGISTRADO
            // ==========================================

            if (respuesta.ok) {

                alert(
                    "¡Gracias por tu compra, " +
                    usuario.nombre +
                    "! Pedido #" +
                    resultado.id_pedido +
                    " registrado correctamente."
                );


                // ==========================================
                // LIMPIAR CARRITO
                // ==========================================

                localStorage.removeItem(
                    "carrito"
                );


                // ==========================================
                // IR A CONFIRMACIÓN
                // ==========================================

                window.location.href =
                    "confirmacion.html";

            }

            else {

                alert(
                    resultado.mensaje ||
                    "No se pudo registrar el pedido."
                );
            }


        } catch (error) {

            console.error(
                "Error al enviar el pedido:",
                error
            );

            alert(
                "No se pudo conectar con el servidor. Verifica que el servidor Java esté encendido."
            );
        }

    }
);


// ==========================================
// EJECUTAR AL CARGAR
// ==========================================

mostrarProductos();