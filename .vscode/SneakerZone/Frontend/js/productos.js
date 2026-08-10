// ==========================================
// VARIABLES
// ==========================================

let productosCargados = [];

const contenedorProductos =
    document.querySelector(".grid-productos");

const filtrosMarca =
    document.querySelectorAll(".filtro-marca");

const buscador =
    document.querySelector("#buscador-productos");

const ordenProductos =
    document.querySelector("#orden-productos");


// ==========================================
// CARGAR PRODUCTOS DESDE LA BASE DE DATOS
// ==========================================

async function cargarProductos() {

    try {

        const respuesta =
            await fetch(
                "http://localhost:8080/productos"
            );


        if (!respuesta.ok) {

            throw new Error(
                "Error al obtener los productos"
            );

        }


        productosCargados =
            await respuesta.json();


        // Mostrar productos

        aplicarFiltros();


    } catch (error) {

        console.error(
            "Error:",
            error
        );


        contenedorProductos.innerHTML = `
            <p>
                No se pudieron cargar los productos.
            </p>
        `;

    }

}


// ==========================================
// MOSTRAR PRODUCTOS
// ==========================================

function mostrarProductos(productos) {

    contenedorProductos.innerHTML = "";


    // Si no hay productos

    if (productos.length === 0) {

        contenedorProductos.innerHTML = `
            <p>
                No se encontraron productos.
            </p>
        `;

        return;

    }


    // Crear tarjeta por cada producto

    productos.forEach(
        function(producto) {


            const tarjeta =
                document.createElement(
                    "article"
                );


            tarjeta.classList.add(
                "card-producto"
            );


            // Convertir marca al formato
            // utilizado por los filtros
            //
            // New Balance
            // ↓
            // new-balance

            tarjeta.dataset.marca =
                obtenerMarca(
                    producto.id_marca
                )
                .toLowerCase()
                .replace(
                    /\s+/g,
                    "-"
                );


            // Guardar el ID real del producto (viene de la base de datos)
            // Se usa después al agregarlo al carrito, para poder
            // registrar el pedido correctamente en el servidor.

            tarjeta.dataset.idProducto =
                producto.id_producto;


            tarjeta.innerHTML = `

                <img
                    src="img/${obtenerImagen(producto.nombre)}"
                    alt="${producto.nombre}"
                >

                <div class="info-producto">

                    <span>
                        ${obtenerMarca(producto.id_marca)}
                    </span>

                    <h3>
                        ${producto.nombre}
                    </h3>

                    <p class="precio">
                        US$ ${producto.precio.toFixed(2)}
                    </p>

                    <button class="btn-carrito">
                        Agregar al carrito
                    </button>

                </div>

            `;


            contenedorProductos.appendChild(
                tarjeta
            );

        }
    );


    // Activar botones

    activarBotonesCarrito();

}


// ==========================================
// OBTENER IMAGEN
// ==========================================

function obtenerImagen(nombre) {

    const imagenes = {

        "Nike Air Force 1":
            "airforce1.jpg",

        "Jordan 4 Retro":
            "jordan4.jpg",

        "Adidas Campus 00s":
            "campus00s.jpg",

        "New Balance 550":
            "newbalance550.jpg"

    };


    return (
        imagenes[nombre]
        ||
        "default.jpg"
    );

}


// ==========================================
// OBTENER NOMBRE DE LA MARCA
// ==========================================

function obtenerMarca(idMarca) {

    const marcas = {

        1: "Nike",

        2: "Jordan",

        3: "Adidas",

        4: "Puma",

        5: "New Balance"

    };


    return (
        marcas[idMarca]
        ||
        "Marca"
    );

}


// ==========================================
// FILTRAR Y ORDENAR PRODUCTOS
// ==========================================

function aplicarFiltros() {


    // Crear una copia de los productos

    let productosFiltrados =
        [...productosCargados];


    // ==========================================
    // FILTRO POR MARCA
    // ==========================================

    const marcasSeleccionadas = [];


    filtrosMarca.forEach(
        function(casilla) {

            if (casilla.checked) {

                marcasSeleccionadas.push(
                    casilla.value.toLowerCase()
                );

            }

        }
    );


    // Aplicar filtro de marca

    if (
        marcasSeleccionadas.length > 0
    ) {

        productosFiltrados =
            productosFiltrados.filter(
                function(producto) {


                    const marca =
                        obtenerMarca(
                            producto.id_marca
                        )
                        .toLowerCase()
                        .replace(
                            /\s+/g,
                            "-"
                        );


                    return marcasSeleccionadas.includes(
                        marca
                    );

                }
            );

    }


    // ==========================================
    // BUSCADOR
    // ==========================================

    const textoBusqueda =
        buscador.value
            .toLowerCase()
            .trim();


    if (textoBusqueda !== "") {

        productosFiltrados =
            productosFiltrados.filter(
                function(producto) {


                    const nombre =
                        producto.nombre
                            .toLowerCase();


                    const descripcion =
                        producto.descripcion
                            .toLowerCase();


                    const marca =
                        obtenerMarca(
                            producto.id_marca
                        )
                        .toLowerCase();


                    return (

                        nombre.includes(
                            textoBusqueda
                        )

                        ||

                        descripcion.includes(
                            textoBusqueda
                        )

                        ||

                        marca.includes(
                            textoBusqueda
                        )

                    );

                }
            );

    }


    // ==========================================
    // ORDENAR PRODUCTOS
    // ==========================================

    const orden =
        ordenProductos.value;


    // Precio menor a mayor

    if (
        orden === "precio-menor"
    ) {

        productosFiltrados.sort(
            function(a, b) {

                return (
                    a.precio -
                    b.precio
                );

            }
        );

    }


    // Precio mayor a menor

    else if (
        orden === "precio-mayor"
    ) {

        productosFiltrados.sort(
            function(a, b) {

                return (
                    b.precio -
                    a.precio
                );

            }
        );

    }


    // Más recientes

    else if (
        orden === "recientes"
    ) {

        productosFiltrados.sort(
            function(a, b) {

                return (
                    new Date(
                        b.fecha_registro
                    )
                    -
                    new Date(
                        a.fecha_registro
                    )
                );

            }
        );

    }


    // Mostrar resultado final

    mostrarProductos(
        productosFiltrados
    );

}


// ==========================================
// EVENTOS DE LOS FILTROS
// ==========================================

filtrosMarca.forEach(
    function(filtro) {

        filtro.addEventListener(
            "change",
            aplicarFiltros
        );

    }
);


// ==========================================
// EVENTO DEL BUSCADOR
// ==========================================

buscador.addEventListener(
    "input",
    aplicarFiltros
);


// ==========================================
// EVENTO DEL ORDEN
// ==========================================

ordenProductos.addEventListener(
    "change",
    aplicarFiltros
);


// ==========================================
// AGREGAR AL CARRITO
// ==========================================

function activarBotonesCarrito() {


    const botonesCarrito =
        document.querySelectorAll(
            ".card-producto button"
        );


    botonesCarrito.forEach(
        function(boton) {


            boton.addEventListener(
                "click",
                function() {


                    // Obtener tarjeta

                    const tarjeta =
                        boton.closest(
                            ".card-producto"
                        );


                    // Obtener nombre

                    const nombre =
                        tarjeta.querySelector(
                            "h3"
                        )
                        .textContent
                        .trim();


                    // Obtener marca

                    const marca =
                        tarjeta.querySelector(
                            "span"
                        )
                        .textContent
                        .trim();


                    // Obtener precio

                    const precioTexto =
                        tarjeta.querySelector(
                            ".precio"
                        )
                        .textContent;


                    // Obtener imagen

                    const imagen =
                        tarjeta.querySelector(
                            "img"
                        )
                        .getAttribute(
                            "src"
                        );


                    // Convertir precio

                    const precio =
                        parseFloat(
                            precioTexto
                                .replace(
                                    "US$",
                                    ""
                                )
                                .trim()
                        );


                    // Obtener ID real del producto
                    // (guardado en el dataset de la tarjeta)

                    const idProducto =
                        tarjeta.dataset.idProducto;


                    // Crear producto

                    const producto = {

                        id_producto:
                            idProducto,

                        nombre:
                            nombre,

                        marca:
                            marca,

                        precio:
                            precio,

                        imagen:
                            imagen,

                        cantidad:
                            1

                    };


                    // Obtener carrito

                    let carrito =
                        JSON.parse(
                            localStorage.getItem(
                                "carrito"
                            )
                        )
                        ||
                        [];


                    // Buscar producto existente

                    const productoExistente =
                        carrito.find(
                            function(item) {

                                return (
                                    item.nombre
                                    ===
                                    producto.nombre
                                );

                            }
                        );


                    // Aumentar cantidad

                    if (
                        productoExistente
                    ) {

                        productoExistente.cantidad++;

                    }


                    // Agregar producto

                    else {

                        carrito.push(
                            producto
                        );

                    }


                    // Guardar carrito

                    localStorage.setItem(
                        "carrito",
                        JSON.stringify(
                            carrito
                        )
                    );


                    // Confirmación

                    alert(
                        producto.nombre
                        +
                        " fue agregado al carrito."
                    );

                }
            );

        }
    );

}


// ==========================================
// INICIAR
// ==========================================

cargarProductos();