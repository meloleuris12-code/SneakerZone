const filtros = document.querySelectorAll(".filtro-marca");
const productos = document.querySelectorAll(".card-producto");

filtros.forEach(function(filtro) {

    filtro.addEventListener("change", function() {

        // Empieza vacía
        const marcasSeleccionadas = [];

        // Agrega solamente las marcas seleccionadas
        filtros.forEach(function(casilla) {

            if (casilla.checked) {
                marcasSeleccionadas.push(casilla.value);
            }

        });

        // Revisa cada producto
        productos.forEach(function(producto) {

            const marcaProducto = producto.dataset.marca;

            if (marcasSeleccionadas.length === 0) {
                producto.style.display = "block";
            }
            else if (marcasSeleccionadas.includes(marcaProducto)) {
                producto.style.display = "block";
            }
            else {
                producto.style.display = "none";
            }

        });

    });

});