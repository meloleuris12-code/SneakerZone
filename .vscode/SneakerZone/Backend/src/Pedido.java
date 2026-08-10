import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Pedido {

    private int idPedido;
    private int idCliente;
    private double total;
    private String estado;
    private String fechaPedido;
    private List<DetallePedido> detalles = new ArrayList<>();

    public Pedido() {
    }

    public Pedido(int idCliente, double total, String estado) {

        this.idCliente = idCliente;
        this.total = total;
        this.estado = estado;

    }

    public int getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(int idPedido) {
        this.idPedido = idPedido;
    }

    public int getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(int idCliente) {
        this.idCliente = idCliente;
    }

    public String getFechaPedido() {
        return fechaPedido;
    }

    public void setFechaPedido(String fechaPedido) {
        this.fechaPedido = fechaPedido;
    }

    public List<DetallePedido> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetallePedido> detalles) {
        this.detalles = detalles;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public boolean registrar() {

        String sql = """
            INSERT INTO Pedido
            (id_cliente, fecha_pedido, total, estado)
            VALUES
            (?, GETDATE(), ?, ?)
            """;

        try (
            Connection conexion = Conexion.conectar();
            PreparedStatement sentencia =
                    conexion.prepareStatement(
                            sql,
                            PreparedStatement.RETURN_GENERATED_KEYS
                    )
        ) {

            sentencia.setInt(1, idCliente);
            sentencia.setDouble(2, total);
            sentencia.setString(3, estado);

            int filas =
                    sentencia.executeUpdate();

            if (filas > 0) {

                ResultSet claves =
                        sentencia.getGeneratedKeys();

                if (claves.next()) {

                    idPedido =
                            claves.getInt(1);

                }

                claves.close();

                System.out.println(
                    "Pedido registrado correctamente. ID: "
                    + idPedido
                );

                return true;
            }

        } catch (SQLException e) {

            System.out.println(
                "Error al registrar el pedido."
            );

            e.printStackTrace();

        }

        return false;
    }

    // ==========================================
    // OBTENER PEDIDOS DE UN CLIENTE (CON DETALLES)
    // ==========================================
    //
    // Se usa para mostrar el historial y seguimiento
    // de pedidos en la sección "Mi cuenta".

    public static List<Pedido> obtenerPorCliente(int idCliente) {

        List<Pedido> pedidos = new ArrayList<>();

        String sql = """
            SELECT id_pedido, id_cliente, fecha_pedido, total, estado
            FROM Pedido
            WHERE id_cliente = ?
            ORDER BY fecha_pedido DESC
            """;

        try (
            Connection conexion = Conexion.conectar();
            PreparedStatement sentencia =
                    conexion.prepareStatement(sql)
        ) {

            sentencia.setInt(1, idCliente);

            ResultSet resultado =
                    sentencia.executeQuery();

            while (resultado.next()) {

                Pedido pedido = new Pedido();

                pedido.setIdPedido(
                        resultado.getInt("id_pedido")
                );

                pedido.setIdCliente(
                        resultado.getInt("id_cliente")
                );

                pedido.setTotal(
                        resultado.getDouble("total")
                );

                pedido.setEstado(
                        resultado.getString("estado")
                );

                pedido.setFechaPedido(
                        resultado.getString("fecha_pedido")
                );

                // ==========================================
                // CARGAR LOS PRODUCTOS DE ESTE PEDIDO
                // ==========================================

                pedido.setDetalles(
                        DetallePedido.obtenerPorPedido(
                                pedido.getIdPedido()
                        )
                );

                pedidos.add(pedido);
            }

        } catch (SQLException e) {

            System.out.println(
                    "Error al obtener los pedidos del cliente."
            );

            e.printStackTrace();
        }

        return pedidos;
    }
}