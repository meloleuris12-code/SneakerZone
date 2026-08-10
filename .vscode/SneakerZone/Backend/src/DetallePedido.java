import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class DetallePedido {

    private int idDetalle;
    private int idPedido;
    private int idProducto;
    private int cantidad;
    private double precioUnitario;
    private double subtotal;

    // Este campo no se guarda en la tabla DetallePedido.
    // Se llena mediante un JOIN con Producto solo para
    // mostrar el nombre del producto en el historial de pedidos.
    private String nombreProducto;

    public DetallePedido() {
    }

    public DetallePedido(
            int idPedido,
            int idProducto,
            int cantidad,
            double precioUnitario
    ) {

        this.idPedido = idPedido;
        this.idProducto = idProducto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;

        this.subtotal =
                cantidad * precioUnitario;
    }

    public int getIdDetalle() {
        return idDetalle;
    }

    public void setIdDetalle(int idDetalle) {
        this.idDetalle = idDetalle;
    }

    public int getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(int idPedido) {
        this.idPedido = idPedido;
    }

    public int getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(int idProducto) {
        this.idProducto = idProducto;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public double getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public boolean registrar() {

        String sql =
                "INSERT INTO DetallePedido " +
                "(id_pedido, id_producto, cantidad, precio_unitario, subtotal) " +
                "VALUES (?, ?, ?, ?, ?)";

        try (
                Connection conexion =
                        Conexion.conectar();

                PreparedStatement sentencia =
                        conexion.prepareStatement(sql)
        ) {

            sentencia.setInt(
                    1,
                    idPedido
            );

            sentencia.setInt(
                    2,
                    idProducto
            );

            sentencia.setInt(
                    3,
                    cantidad
            );

            sentencia.setDouble(
                    4,
                    precioUnitario
            );

            sentencia.setDouble(
                    5,
                    subtotal
            );

            int filas =
                    sentencia.executeUpdate();

            if (filas > 0) {

                System.out.println(
                        "Detalle del pedido registrado correctamente."
                );

                return true;
            }

        } catch (SQLException e) {

            System.out.println(
                    "Error al registrar el detalle del pedido."
            );

            e.printStackTrace();
        }

        return false;
    }

    // ==========================================
    // OBTENER PRODUCTOS DE UN PEDIDO
    // ==========================================
    //
    // Se une con la tabla Producto para poder mostrar
    // el nombre del producto en el historial de pedidos
    // del cliente (no se guarda ese nombre en DetallePedido).

    public static List<DetallePedido> obtenerPorPedido(int idPedido) {

        List<DetallePedido> detalles = new ArrayList<>();

        String sql = """
            SELECT dp.id_detalle,
                   dp.id_pedido,
                   dp.id_producto,
                   dp.cantidad,
                   dp.precio_unitario,
                   dp.subtotal,
                   p.nombre AS nombre_producto
            FROM DetallePedido dp
            INNER JOIN Producto p
                ON dp.id_producto = p.id_producto
            WHERE dp.id_pedido = ?
            """;

        try (
                Connection conexion =
                        Conexion.conectar();

                PreparedStatement sentencia =
                        conexion.prepareStatement(sql)
        ) {

            sentencia.setInt(1, idPedido);

            ResultSet resultado =
                    sentencia.executeQuery();

            while (resultado.next()) {

                DetallePedido detalle = new DetallePedido();

                detalle.setIdDetalle(
                        resultado.getInt("id_detalle")
                );

                detalle.setIdPedido(
                        resultado.getInt("id_pedido")
                );

                detalle.setIdProducto(
                        resultado.getInt("id_producto")
                );

                detalle.setCantidad(
                        resultado.getInt("cantidad")
                );

                detalle.setPrecioUnitario(
                        resultado.getDouble("precio_unitario")
                );

                detalle.setSubtotal(
                        resultado.getDouble("subtotal")
                );

                detalle.setNombreProducto(
                        resultado.getString("nombre_producto")
                );

                detalles.add(detalle);
            }

        } catch (SQLException e) {

            System.out.println(
                    "Error al obtener los productos del pedido."
            );

            e.printStackTrace();
        }

        return detalles;
    }
}