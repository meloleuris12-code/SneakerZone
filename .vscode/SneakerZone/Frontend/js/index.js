// ==========================================
// USUARIO
// ==========================================

const enlaceUsuario =
    document.getElementById("enlace-usuario");


if (enlaceUsuario) {

    enlaceUsuario.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            const usuario =
                localStorage.getItem("usuario");


            if (usuario) {

                window.location.href =
                    "usuario.html";

            } else {

                window.location.href =
                    "login.html";

            }

        }
    );

}


// ==========================================
// OBTENER CARRITO
// ==========================================

let carrito =
    JSON.parse(
        localStorage.getItem("carrito")
    ) || [];


// ==========================================
// BOTONES AGREGAR AL CARRITO
// ==========================================

const botonesAgregar =
    document.querySelectorAll(
        ".card button"
    );


botonesAgregar.forEach(
    function(boton) {

        boton.addEventListener(
            "click",
            function() {


                const tarjeta =
                    boton.closest(".card");


                if (!tarjeta) {

                    return;

                }


                const nombreElemento =
                    tarjeta.querySelector("h3");


                const precioElemento =
                    tarjeta.querySelector("p");


                const imagenElemento =
                    tarjeta.querySelector("img");


                if (
                    !nombreElemento ||
                    !precioElemento ||
                    !imagenElemento
                ) {

                    alert(
                        "No se pudieron obtener los datos del producto."
                    );

                    return;

                }


                const nombre =
                    nombreElemento.textContent.trim();


                const precioTexto =
                    precioElemento.textContent
                        .replace("US$", "")
                        .replace("$", "")
                        .trim();


                const precio =
                    parseFloat(precioTexto);


                const imagen =
                    imagenElemento.getAttribute("src");


                if (isNaN(precio)) {

                    alert(
                        "El precio del producto no es válido."
                    );

                    return;

                }


                // ==========================================
                // BUSCAR PRODUCTO EXISTENTE
                // ==========================================

                const productoExistente =
                    carrito.find(
                        function(producto) {

                            return producto.nombre ===
                                nombre;

                        }
                    );


                if (productoExistente) {

                    productoExistente.cantidad++;

                } else {

                    carrito.push({

                        id: Date.now(),

                        nombre: nombre,

                        imagen: imagen,

                        precio: precio,

                        marca: "",

                        talla: "",

                        cantidad: 1

                    });

                }


                // ==========================================
                // GUARDAR CARRITO
                // ==========================================

                localStorage.setItem(
                    "carrito",
                    JSON.stringify(carrito)
                );


                // ==========================================
                // ACTUALIZAR CONTADOR
                // ==========================================

                actualizarContador();


                alert(
                    nombre +
                    " fue agregado al carrito."
                );

            }
        );

    }
);


// ==========================================
// ACTUALIZAR CONTADOR
// ==========================================

function actualizarContador() {

    const contador =
        document.getElementById(
            "contador-carrito"
        );


    if (!contador) {

        return;

    }


    let cantidadTotal = 0;


    carrito.forEach(
        function(producto) {

            cantidadTotal +=
                Number(
                    producto.cantidad
                ) || 0;

        }
    );


    contador.textContent =
        cantidadTotal;

}


// ==========================================
// ACTUALIZAR CONTADOR AL CARGAR
// ==========================================

actualizarContador();