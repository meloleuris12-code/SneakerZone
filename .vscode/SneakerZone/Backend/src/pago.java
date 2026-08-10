import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class pago {

    private int idPago;
    private int idPedido;
    private String metodoPago;
    private double monto;
    private String estadoPago;

    public pago() {
    }

    public pago(
            int idPedido,
            String metodoPago,
            double monto,
            String estadoPago
    ) {

        this.idPedido = idPedido;
        this.metodoPago = metodoPago;
        this.monto = monto;
        this.estadoPago = estadoPago;
    }

    public int getIdPago() {
        return idPago;
    }

    public void setIdPago(int idPago) {
        this.idPago = idPago;
    }

    public int getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(int idPedido) {
        this.idPedido = idPedido;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public double getMonto() {
        return monto;
    }

    public void setMonto(double monto) {
        this.monto = monto;
    }

    public String getEstadoPago() {
        return estadoPago;
    }

    public void setEstadoPago(String estadoPago) {
        this.estadoPago = estadoPago;
    }

    public boolean registrar() {

        String sql =
                "INSERT INTO Pago " +
                "(id_pedido, metodo_pago, monto, fecha_pago, estado_pago) " +
                "VALUES (?, ?, ?, GETDATE(), ?)";

        try (
                Connection conexion = Conexion.conectar();
                PreparedStatement sentencia =
                        conexion.prepareStatement(sql)
        ) {

            sentencia.setInt(
                    1,
                    idPedido
            );

            sentencia.setString(
                    2,
                    metodoPago
            );

            sentencia.setDouble(
                    3,
                    monto
            );

            sentencia.setString(
                    4,
                    estadoPago
            );

            int filas =
                    sentencia.executeUpdate();

            if (filas > 0) {

                System.out.println(
                        "Pago registrado correctamente."
                );

                return true;
            }

        } catch (SQLException e) {

            System.out.println(
                    "Error al registrar el pago."
            );

            e.printStackTrace();
        }

        return false;
    }
}