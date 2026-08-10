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
// MAPA DE PRODUCTOS REALES (NOMBRE -> ID)
// ==========================================
//
// Los productos destacados de esta página (index.html)
// están escritos directamente en el HTML, sin id_producto.
// Para poder registrar pedidos correctamente en el servidor,
// se consulta la lista real de productos de la base de datos
// y se arma un mapa por nombre para obtener el id_producto
// correspondiente antes de agregar algo al carrito.

let mapaProductos = {};

async function cargarMapaProductos() {

    try {

        const respuesta =
            await fetch(
                "http://localhost:8080/productos"
            );

        if (!respuesta.ok) {

            throw new Error(
                "No se pudo obtener la lista de productos"
            );

        }

        const productos =
            await respuesta.json();

        productos.forEach(
            function(producto) {

                mapaProductos[producto.nombre] =
                    producto.id_producto;

            }
        );

    } catch (error) {

        console.error(
            "No se pudo cargar el mapa de productos:",
            error
        );

    }

}

cargarMapaProductos();


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

                    // Buscar el id_producto real usando el mapa
                    // cargado desde la base de datos

                    const idProducto =
                        mapaProductos[nombre];


                    if (!idProducto) {

                        alert(
                            "Este producto no está disponible todavía. " +
                            "Agrégalo desde la página de Productos."
                        );

                        return;

                    }


                    carrito.push({

                        id: Date.now(),

                        id_producto: idProducto,

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