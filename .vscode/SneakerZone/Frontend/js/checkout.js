// ==========================================
// OBTENER EL CARRITO
// ==========================================

const carrito = JSON.parse(
    localStorage.getItem("carrito")
) || [];


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

    metodo.addEventListener("change", function() {

        if (metodo.value === "tarjeta" && metodo.checked) {

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

    });

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
// FORMATEAR FECHA DE EXPIRACIÓN
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
// PERMITIR SOLO NÚMEROS EN CVV
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


    // Verificar si el carrito está vacío

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


    // Recorrer productos

    carrito.forEach(function(producto) {


        // Calcular subtotal

        subtotal +=
            producto.precio *
            producto.cantidad;


        // Crear elemento

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

                US$ ${(producto.precio * producto.cantidad).toFixed(2)}

            </span>

        `;


        // Agregar producto

        contenedorProductos.appendChild(
            productoHTML
        );

    });


    // ==========================================
    // CALCULAR TOTAL
    // ==========================================

    let envio = costoEnvio;

    let total =
        subtotal +
        envio;


    // ==========================================
    // MOSTRAR VALORES
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
    function(event) {

        // Evitar recargar la página

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
        // VALIDAR DATOS DE TARJETA
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
        // OBTENER DATOS DEL CLIENTE
        // ==========================================

        const nombre =
            document.getElementById(
                "nombre"
            ).value;

        const correo =
            document.getElementById(
                "correo"
            ).value;


        // ==========================================
        // MENSAJE DE CONFIRMACIÓN
        // ==========================================

        alert(
            "¡Gracias por tu compra, " +
            nombre +
            "!"
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
);


// ==========================================
// EJECUTAR AL CARGAR LA PÁGINA
// ==========================================

mostrarProductos();