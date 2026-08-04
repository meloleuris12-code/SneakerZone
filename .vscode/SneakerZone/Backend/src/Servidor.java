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
        // INICIAR SERVIDOR
        // ==========================================

        servidor.start();

        System.out.println("Servidor SneakerZone iniciado.");
        System.out.println("Productos: http://localhost:8080/productos");
        System.out.println("Registro: http://localhost:8080/registro");
        System.out.println("Login: http://localhost:8080/login");
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
    // REGISTRAR CLIENTE
    // ==========================================

    private static void registrarCliente(
            HttpExchange exchange) throws IOException {

        // ==========================================
        // CORS - PRE-FLIGHT
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

            enviarRespuesta(
                    exchange,
                    405,
                    "Método no permitido"
            );

            return;
        }

        // ==========================================
        // LEER DATOS
        // ==========================================

        String datos = new String(
                exchange.getRequestBody().readAllBytes(),
                StandardCharsets.UTF_8
        );

        System.out.println(
                "Datos recibidos en registro: " + datos
        );

        // ==========================================
        // OBTENER DATOS
        // ==========================================

        String nombre = obtenerDato(
                datos,
                "nombre"
        );

        String apellido = obtenerDato(
                datos,
                "apellido"
        );

        String telefono = obtenerDato(
                datos,
                "telefono"
        );

        String correo = obtenerDato(
                datos,
                "correo"
        );

        String direccion = obtenerDato(
                datos,
                "direccion"
        );

        String contraseña = obtenerDato(
                datos,
                "contraseña"
        );

        // ==========================================
        // VALIDAR DATOS
        // ==========================================

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

        // ==========================================
        // VERIFICAR SI EL CORREO YA EXISTE
        // ==========================================

        Cliente cliente = Cliente.buscarPorCorreo(correo);

        if (cliente != null) {

            enviarRespuesta(
                    exchange,
                    409,
                    "El correo electrónico ya está registrado"
            );

            return;
        }

        // ==========================================
        // CREAR CLIENTE
        // ==========================================

        Cliente nuevoCliente = new Cliente(
                nombre,
                apellido,
                telefono,
                correo,
                direccion,
                contraseña
        );

        // ==========================================
        // GUARDAR CLIENTE
        // ==========================================

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
    // INICIAR SESIÓN
    // ==========================================

    private static void iniciarSesion(
            HttpExchange exchange) throws IOException {

        // ==========================================
        // CORS - PRE-FLIGHT
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

            enviarRespuesta(
                    exchange,
                    405,
                    "Método no permitido"
            );

            return;
        }

        // ==========================================
        // LEER DATOS
        // ==========================================

        String datos = new String(
                exchange.getRequestBody().readAllBytes(),
                StandardCharsets.UTF_8
        );

        System.out.println(
                "Intento de login: " + datos
        );

        // ==========================================
        // OBTENER CORREO Y CONTRASEÑA
        // ==========================================

        String correo = obtenerDato(
                datos,
                "correo"
        );

        String contraseña = obtenerDato(
                datos,
                "contraseña"
        );

        // ==========================================
        // VALIDAR
        // ==========================================

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

        // ==========================================
        // BUSCAR CLIENTE
        // ==========================================

        Cliente cliente = Cliente.iniciarSesion(
                correo,
                contraseña
        );

        // ==========================================
        // LOGIN CORRECTO
        // ==========================================

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

            // ==========================================
            // LOGIN INCORRECTO
            // ==========================================

            enviarJSON(
                    exchange,
                    401,
                    "{\"mensaje\":\"Correo o contraseña incorrectos\"}"
            );
        }
    }

    // ==========================================
    // OBTENER DATO DEL JSON
    // ==========================================

    private static String obtenerDato(
            String datos,
            String campo) {

        String buscar = "\"" + campo + "\"";

        int posicion = datos.indexOf(buscar);

        if (posicion == -1) {
            return "";
        }

        int inicio = datos.indexOf(
                ":",
                posicion
        );

        if (inicio == -1) {
            return "";
        }

        int primerComilla = datos.indexOf(
                "\"",
                inicio
        );

        if (primerComilla == -1) {
            return "";
        }

        int segundaComilla = datos.indexOf(
                "\"",
                primerComilla + 1
        );

        if (segundaComilla == -1) {
            return "";
        }

        return datos.substring(
                primerComilla + 1,
                segundaComilla
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
    // AGREGAR CORS
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

        byte[] respuesta = contenido.getBytes(
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
    // ENVIAR RESPUESTA DE TEXTO
    // ==========================================

    private static void enviarRespuesta(
            HttpExchange exchange,
            int codigo,
            String mensaje) throws IOException {

        agregarCORS(exchange);

        byte[] respuesta = mensaje.getBytes(
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