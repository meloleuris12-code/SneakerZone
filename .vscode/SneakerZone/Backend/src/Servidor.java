import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class Servidor {

    public static void main(String[] args) throws Exception {

        HttpServer servidor = HttpServer.create(
                new InetSocketAddress(8080),
                0
        );

        // ==========================================
        // ENDPOINT DE PRODUCTOS
        // ==========================================

        servidor.createContext(
                "/productos",
                Servidor::obtenerProductos
        );

        // ==========================================
        // ENDPOINT DE REGISTRO
        // ==========================================

        servidor.createContext(
                "/registro",
                Servidor::registrarCliente
        );

        // ==========================================
        // ENDPOINT DE LOGIN
        // ==========================================

        servidor.createContext(
                "/login",
                Servidor::iniciarSesion
        );

        // ==========================================
        // ENDPOINT DE PEDIDOS
        // ==========================================

        servidor.createContext(
                "/pedido",
                Servidor::registrarPedido
        );

        // ==========================================
        // ENDPOINT DE HISTORIAL DE PEDIDOS
        // ==========================================

        servidor.createContext(
                "/pedidos",
                Servidor::obtenerPedidosCliente
        );

        // ==========================================
        // INICIAR SERVIDOR
        // ==========================================

        servidor.start();

        System.out.println("==========================================");
        System.out.println("Servidor SneakerZone iniciado.");
        System.out.println("==========================================");
        System.out.println("Productos: http://localhost:8080/productos");
        System.out.println("Registro:  http://localhost:8080/registro");
        System.out.println("Login:     http://localhost:8080/login");
        System.out.println("Pedido:    http://localhost:8080/pedido");
        System.out.println("Pedidos:   http://localhost:8080/pedidos?id_cliente=1");
        System.out.println("==========================================");
    }

    // ==========================================
    // OBTENER PRODUCTOS
    // ==========================================

    private static void obtenerProductos(
            HttpExchange exchange) throws IOException {

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {

            agregarCORS(exchange);
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {

            enviarRespuesta(
                    exchange,
                    405,
                    "Método no permitido"
            );

            return;
        }

        ProductoDAO dao = new ProductoDAO();

        List<producto> productos = dao.obtenerProductos();

        StringBuilder json = new StringBuilder();

        json.append("[");

        for (int i = 0; i < productos.size(); i++) {

            producto p = productos.get(i);

            json.append("{");

            json.append("\"id_producto\":")
                    .append(p.getIdProducto())
                    .append(",");

            json.append("\"nombre\":\"")
                    .append(escaparJSON(p.getNombre()))
                    .append("\",");

            json.append("\"descripcion\":\"")
                    .append(escaparJSON(p.getDescripcion()))
                    .append("\",");

            json.append("\"precio\":")
                    .append(p.getPrecio())
                    .append(",");

            json.append("\"stock\":")
                    .append(p.getStock())
                    .append(",");

            json.append("\"id_marca\":")
                    .append(p.getIdMarca());

            json.append("}");

            if (i < productos.size() - 1) {
                json.append(",");
            }
        }

        json.append("]");

        enviarJSON(
                exchange,
                200,
                json.toString()
        );
    }

    // ==========================================
    // OBTENER PEDIDOS DE UN CLIENTE
    // ==========================================
    //
    // GET /pedidos?id_cliente=1
    //
    // Devuelve el historial de pedidos del cliente,
    // cada uno con su lista de productos, para mostrar
    // el seguimiento en la sección "Mi cuenta".

    private static void obtenerPedidosCliente(
            HttpExchange exchange) throws IOException {

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {

            agregarCORS(exchange);
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {

            enviarJSON(
                    exchange,
                    405,
                    "{\"mensaje\":\"Método no permitido\"}"
            );

            return;
        }

        // ==========================================
        // LEER id_cliente DE LA URL
        // ==========================================

        String consulta =
                exchange.getRequestURI().getQuery();

        String idClienteTexto =
                obtenerParametro(consulta, "id_cliente");

        if (idClienteTexto == null || idClienteTexto.isEmpty()) {

            enviarJSON(
                    exchange,
                    400,
                    "{\"mensaje\":\"Falta el parámetro id_cliente\"}"
            );

            return;
        }

        int idCliente;

        try {

            idCliente = Integer.parseInt(idClienteTexto);

        } catch (NumberFormatException e) {

            enviarJSON(
                    exchange,
                    400,
                    "{\"mensaje\":\"id_cliente no es válido\"}"
            );

            return;
        }

        // ==========================================
        // CONSULTAR PEDIDOS
        // ==========================================

        List<Pedido> pedidos =
                Pedido.obtenerPorCliente(idCliente);

        // ==========================================
        // ARMAR JSON DE RESPUESTA
        // ==========================================

        StringBuilder json = new StringBuilder();

        json.append("[");

        for (int i = 0; i < pedidos.size(); i++) {

            Pedido pedido = pedidos.get(i);

            json.append("{");

            json.append("\"id_pedido\":")
                    .append(pedido.getIdPedido())
                    .append(",");

            json.append("\"fecha_pedido\":\"")
                    .append(escaparJSON(pedido.getFechaPedido()))
                    .append("\",");

            json.append("\"total\":")
                    .append(pedido.getTotal())
                    .append(",");

            json.append("\"estado\":\"")
                    .append(escaparJSON(pedido.getEstado()))
                    .append("\",");

            json.append("\"productos\":[");

            List<DetallePedido> detalles =
                    pedido.getDetalles();

            for (int j = 0; j < detalles.size(); j++) {

                DetallePedido detalle = detalles.get(j);

                json.append("{");

                json.append("\"id_producto\":")
                        .append(detalle.getIdProducto())
                        .append(",");

                json.append("\"nombre\":\"")
                        .append(escaparJSON(detalle.getNombreProducto()))
                        .append("\",");

                json.append("\"cantidad\":")
                        .append(detalle.getCantidad())
                        .append(",");

                json.append("\"precio_unitario\":")
                        .append(detalle.getPrecioUnitario())
                        .append(",");

                json.append("\"subtotal\":")
                        .append(detalle.getSubtotal());

                json.append("}");

                if (j < detalles.size() - 1) {
                    json.append(",");
                }
            }

            json.append("]");

            json.append("}");

            if (i < pedidos.size() - 1) {
                json.append(",");
            }
        }

        json.append("]");

        enviarJSON(
                exchange,
                200,
                json.toString()
        );
    }

    // ==========================================
    // OBTENER PARÁMETRO DE QUERY STRING
    // ==========================================
    //
    // Ejemplo: "id_cliente=1&otro=2" -> obtenerParametro(txt, "id_cliente") -> "1"

    private static String obtenerParametro(
            String query,
            String nombre) {

        if (query == null || query.isEmpty()) {
            return null;
        }

        String[] pares = query.split("&");

        for (String par : pares) {

            String[] partes = par.split("=", 2);

            if (
                    partes.length == 2
                    &&
                    partes[0].equals(nombre)
            ) {

                return partes[1];
            }
        }

        return null;
    }

    private static void registrarCliente(
            HttpExchange exchange) throws IOException {

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {

            agregarCORS(exchange);
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {

            enviarRespuesta(
                    exchange,
                    405,
                    "Método no permitido"
            );

            return;
        }

        String datos = new String(
                exchange.getRequestBody().readAllBytes(),
                StandardCharsets.UTF_8
        );

        System.out.println(
                "Datos recibidos en registro: " + datos
        );

        String nombre = obtenerDato(datos, "nombre");
        String apellido = obtenerDato(datos, "apellido");
        String telefono = obtenerDato(datos, "telefono");
        String correo = obtenerDato(datos, "correo");
        String direccion = obtenerDato(datos, "direccion");
        String contraseña = obtenerDato(datos, "contraseña");

        if (
                nombre.isEmpty() ||
                apellido.isEmpty() ||
                telefono.isEmpty() ||
                correo.isEmpty() ||
                direccion.isEmpty() ||
                contraseña.isEmpty()
        ) {

            enviarRespuesta(
                    exchange,
                    400,
                    "Todos los campos son obligatorios"
            );

            return;
        }

        Cliente cliente = Cliente.buscarPorCorreo(correo);

        if (cliente != null) {

            enviarRespuesta(
                    exchange,
                    409,
                    "El correo electrónico ya está registrado"
            );

            return;
        }

        Cliente nuevoCliente = new Cliente(
                nombre,
                apellido,
                telefono,
                correo,
                direccion,
                contraseña
        );

        boolean registrado = nuevoCliente.registrar();

        if (registrado) {

            enviarRespuesta(
                    exchange,
                    200,
                    "Usuario registrado correctamente"
            );

        } else {

            enviarRespuesta(
                    exchange,
                    500,
                    "No se pudo registrar el usuario"
            );
        }
    }

    // ==========================================
    // LOGIN
    // ==========================================

    private static void iniciarSesion(
            HttpExchange exchange) throws IOException {

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {

            agregarCORS(exchange);
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {

            enviarRespuesta(
                    exchange,
                    405,
                    "Método no permitido"
            );

            return;
        }

        String datos = new String(
                exchange.getRequestBody().readAllBytes(),
                StandardCharsets.UTF_8
        );

        System.out.println(
                "Intento de login: " + datos
        );

        String correo = obtenerDato(
                datos,
                "correo"
        );

        String contraseña = obtenerDato(
                datos,
                "contraseña"
        );

        if (
                correo.isEmpty() ||
                contraseña.isEmpty()
        ) {

            enviarJSON(
                    exchange,
                    400,
                    "{\"mensaje\":\"Correo y contraseña son obligatorios\"}"
            );

            return;
        }

        Cliente cliente = Cliente.iniciarSesion(
                correo,
                contraseña
        );

        if (cliente != null) {

            String json =
                    "{"
                    + "\"id_cliente\":"
                    + cliente.getIdCliente()
                    + ","
                    + "\"nombre\":\""
                    + escaparJSON(cliente.getNombre())
                    + "\","
                    + "\"apellido\":\""
                    + escaparJSON(cliente.getApellido())
                    + "\","
                    + "\"telefono\":\""
                    + escaparJSON(cliente.getTelefono())
                    + "\","
                    + "\"correo\":\""
                    + escaparJSON(cliente.getCorreo())
                    + "\","
                    + "\"direccion\":\""
                    + escaparJSON(cliente.getDireccion())
                    + "\""
                    + "}";

            enviarJSON(
                    exchange,
                    200,
                    json
            );

        } else {

            enviarJSON(
                    exchange,
                    401,
                    "{\"mensaje\":\"Correo o contraseña incorrectos\"}"
            );
        }
    }

    // ==========================================
    // REGISTRAR PEDIDO
    // ==========================================

    private static void registrarPedido(
            HttpExchange exchange) throws IOException {

        // ==========================================
        // CORS
        // ==========================================

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {

            agregarCORS(exchange);
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        // ==========================================
        // VERIFICAR POST
        // ==========================================

        if (!exchange.getRequestMethod().equalsIgnoreCase("POST")) {

            enviarJSON(
                    exchange,
                    405,
                    "{\"mensaje\":\"Método no permitido\"}"
            );

            return;
        }

        // ==========================================
        // LEER JSON
        // ==========================================

        String datos = new String(
                exchange.getRequestBody().readAllBytes(),
                StandardCharsets.UTF_8
        );

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "Pedido recibido:"
        );

        System.out.println(datos);

        // ==========================================
        // DATOS DEL PEDIDO
        // ==========================================

        String idClienteTexto =
                obtenerDato(datos, "id_cliente");

        String totalTexto =
                obtenerDato(datos, "total");

        String metodoPago =
                obtenerDato(datos, "metodo_pago");

        // ==========================================
        // VALIDAR DATOS
        // ==========================================

        if (
                idClienteTexto.isEmpty() ||
                totalTexto.isEmpty() ||
                metodoPago.isEmpty()
        ) {

            enviarJSON(
                    exchange,
                    400,
                    "{\"mensaje\":\"Faltan datos del pedido\"}"
            );

            return;
        }

        int idCliente;

        double total;

        try {

            idCliente =
                    Integer.parseInt(idClienteTexto);

            total =
                    Double.parseDouble(totalTexto);

        } catch (NumberFormatException e) {

            enviarJSON(
                    exchange,
                    400,
                    "{\"mensaje\":\"Los datos numéricos del pedido no son válidos\"}"
            );

            return;
        }

        // ==========================================
        // CREAR PEDIDO
        // ==========================================

        Pedido pedido = new Pedido(
                idCliente,
                total,
                "Pendiente"
        );

        boolean pedidoRegistrado =
                pedido.registrar();

        if (!pedidoRegistrado) {

            enviarJSON(
                    exchange,
                    500,
                    "{\"mensaje\":\"No se pudo registrar el pedido\"}"
            );

            return;
        }

        // ==========================================
        // OBTENER ID DEL PEDIDO
        // ==========================================

        int idPedido =
                pedido.getIdPedido();

        System.out.println(
                "Pedido creado. ID: " + idPedido
        );

        // ==========================================
        // OBTENER PRODUCTOS
        // ==========================================

        String productos =
                obtenerArray(datos, "productos");

        if (productos.isEmpty()) {

            enviarJSON(
                    exchange,
                    400,
                    "{\"mensaje\":\"El pedido no contiene productos\"}"
            );

            return;
        }

        // ==========================================
        // REGISTRAR DETALLES
        // ==========================================

        String[] listaProductos =
                separarProductos(productos);

        for (String productoJSON : listaProductos) {

            if (productoJSON.trim().isEmpty()) {
                continue;
            }

            // ==========================================
            // TRY/CATCH DE SEGURIDAD
            // ==========================================
            //
            // Si algún producto llega con datos inválidos
            // o incompletos (por ejemplo id_producto en null),
            // se omite ese producto en lugar de detener
            // todo el procesamiento del pedido y cortar
            // la conexión sin responder al cliente.

            try {

                String idProductoTexto =
                        obtenerDato(
                                productoJSON,
                                "id_producto"
                        );

                String cantidadTexto =
                        obtenerDato(
                                productoJSON,
                                "cantidad"
                        );

                String precioTexto =
                        obtenerDato(
                                productoJSON,
                                "precio"
                        );

                if (
                        idProductoTexto.isEmpty() ||
                        idProductoTexto.equals("null") ||
                        cantidadTexto.isEmpty() ||
                        precioTexto.isEmpty()
                ) {

                    System.out.println(
                            "Producto con datos incompletos, se omite: "
                            + productoJSON
                    );

                    continue;
                }

                int idProducto =
                        Integer.parseInt(idProductoTexto);

                int cantidad =
                        Integer.parseInt(cantidadTexto);

                double precio =
                        Double.parseDouble(precioTexto);

                DetallePedido detalle =
                        new DetallePedido(
                                idPedido,
                                idProducto,
                                cantidad,
                                precio
                        );

                boolean detalleRegistrado =
                        detalle.registrar();

                if (!detalleRegistrado) {

                    System.out.println(
                            "No se pudo registrar el detalle del producto: "
                            + idProducto
                    );
                }

            } catch (NumberFormatException e) {

                System.out.println(
                        "Producto con datos numéricos inválidos, se omite: "
                        + productoJSON
                );
            }
        }

        // ==========================================
        // REGISTRAR PAGO
        // ==========================================

        String estadoPago = "Pendiente";

        pago nuevoPago = new pago(
                idPedido,
                metodoPago,
                total,
                estadoPago
        );

        boolean pagoRegistrado =
                nuevoPago.registrar();

        if (!pagoRegistrado) {

            System.out.println(
                    "Advertencia: el pedido fue registrado, "
                    + "pero el pago no pudo registrarse."
            );
        }

        // ==========================================
        // RESPUESTA
        // ==========================================

        String respuesta =
                "{"
                + "\"mensaje\":\"Pedido registrado correctamente\","
                + "\"id_pedido\":"
                + idPedido
                + "}";

        enviarJSON(
                exchange,
                200,
                respuesta
        );
    }

    // ==========================================
    // OBTENER DATO DEL JSON
    // ==========================================

    private static String obtenerDato(
            String datos,
            String campo) {

        String buscar =
                "\"" + campo + "\"";

        int posicion =
                datos.indexOf(buscar);

        if (posicion == -1) {
            return "";
        }

        int inicio =
                datos.indexOf(
                        ":",
                        posicion
                );

        if (inicio == -1) {
            return "";
        }

        int primerCaracter =
                inicio + 1;

        while (
                primerCaracter < datos.length()
                &&
                Character.isWhitespace(
                        datos.charAt(primerCaracter)
                )
        ) {

            primerCaracter++;
        }

        // ==========================================
        // DATO CON COMILLAS
        // ==========================================

        if (
                primerCaracter < datos.length()
                &&
                datos.charAt(primerCaracter) == '"'
        ) {

            int primeraComilla =
                    primerCaracter;

            int segundaComilla =
                    datos.indexOf(
                            "\"",
                            primeraComilla + 1
                    );

            if (segundaComilla == -1) {
                return "";
            }

            return datos.substring(
                    primeraComilla + 1,
                    segundaComilla
            );
        }

        // ==========================================
        // DATO NUMÉRICO
        // ==========================================

        int fin =
                primerCaracter;

        while (
                fin < datos.length()
                &&
                datos.charAt(fin) != ','
                &&
                datos.charAt(fin) != '}'
                &&
                datos.charAt(fin) != ']'
        ) {

            fin++;
        }

        return datos.substring(
                primerCaracter,
                fin
        ).trim();
    }

    // ==========================================
    // OBTENER ARRAY DEL JSON
    // ==========================================

    private static String obtenerArray(
            String datos,
            String campo) {

        String buscar =
                "\"" + campo + "\"";

        int posicion =
                datos.indexOf(buscar);

        if (posicion == -1) {
            return "";
        }

        int inicio =
                datos.indexOf(
                        "[",
                        posicion
                );

        if (inicio == -1) {
            return "";
        }

        int nivel = 0;

        for (
                int i = inicio;
                i < datos.length();
                i++
        ) {

            char caracter =
                    datos.charAt(i);

            if (caracter == '[') {
                nivel++;
            }

            if (caracter == ']') {

                nivel--;

                if (nivel == 0) {

                    return datos.substring(
                            inicio + 1,
                            i
                    );
                }
            }
        }

        return "";
    }

    // ==========================================
    // SEPARAR PRODUCTOS
    // ==========================================

    private static String[] separarProductos(
            String productos) {

        if (
                productos == null ||
                productos.trim().isEmpty()
        ) {

            return new String[0];
        }

        return productos.split(
                "\\},\\s*\\{"
        );
    }

    // ==========================================
    // ESCAPAR JSON
    // ==========================================

    private static String escaparJSON(
            String texto) {

        if (texto == null) {
            return "";
        }

        return texto
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }

    // ==========================================
    // CORS
    // ==========================================

    private static void agregarCORS(
            HttpExchange exchange) {

        exchange.getResponseHeaders()
                .set(
                        "Access-Control-Allow-Origin",
                        "*"
                );

        exchange.getResponseHeaders()
                .set(
                        "Access-Control-Allow-Methods",
                        "GET, POST, OPTIONS"
                );

        exchange.getResponseHeaders()
                .set(
                        "Access-Control-Allow-Headers",
                        "Content-Type"
                );
    }

    // ==========================================
    // ENVIAR JSON
    // ==========================================

    private static void enviarJSON(
            HttpExchange exchange,
            int codigo,
            String contenido) throws IOException {

        agregarCORS(exchange);

        byte[] respuesta =
                contenido.getBytes(
                        StandardCharsets.UTF_8
                );

        exchange.getResponseHeaders()
                .set(
                        "Content-Type",
                        "application/json; charset=UTF-8"
                );

        exchange.sendResponseHeaders(
                codigo,
                respuesta.length
        );

        try (
                OutputStream salida =
                        exchange.getResponseBody()
        ) {

            salida.write(respuesta);
        }
    }

    // ==========================================
    // ENVIAR TEXTO
    // ==========================================

    private static void enviarRespuesta(
            HttpExchange exchange,
            int codigo,
            String mensaje) throws IOException {

        agregarCORS(exchange);

        byte[] respuesta =
                mensaje.getBytes(
                        StandardCharsets.UTF_8
                );

        exchange.getResponseHeaders()
                .set(
                        "Content-Type",
                        "text/plain; charset=UTF-8"
                );

        exchange.sendResponseHeaders(
                codigo,
                respuesta.length
        );

        try (
                OutputStream salida =
                        exchange.getResponseBody()
        ) {

            salida.write(respuesta);
        }
    }
}