import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class Cliente {

    private int idCliente;
    private String nombre;
    private String apellido;
    private String telefono;
    private String correo;
    private String direccion;
    private String contraseña;

    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public Cliente(
            String nombre,
            String apellido,
            String telefono,
            String correo,
            String direccion,
            String contraseña) {

        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.correo = correo;
        this.direccion = direccion;
        this.contraseña = contraseña;
    }

    // ==========================================
    // REGISTRAR CLIENTE
    // ==========================================

    public boolean registrar() {

        String sql = """
                INSERT INTO Cliente
                (nombre, apellido, telefono, correo, direccion, contraseña)
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        try (
                Connection conexion = Conexion.conectar();
                PreparedStatement sentencia =
                        conexion.prepareStatement(sql)
        ) {

            sentencia.setString(1, nombre);
            sentencia.setString(2, apellido);
            sentencia.setString(3, telefono);
            sentencia.setString(4, correo);
            sentencia.setString(5, direccion);
            sentencia.setString(6, contraseña);

            int resultado =
                    sentencia.executeUpdate();

            return resultado > 0;

        } catch (SQLException e) {

            System.out.println(
                    "Error al registrar el cliente."
            );

            e.printStackTrace();

            return false;
        }
    }

    // ==========================================
    // BUSCAR CLIENTE POR CORREO
    // ==========================================

    public static Cliente buscarPorCorreo(
            String correo) {

        String sql = """
                SELECT id_cliente,
                       nombre,
                       apellido,
                       telefono,
                       correo,
                       direccion,
                       contraseña
                FROM Cliente
                WHERE correo = ?
                """;

        try (
                Connection conexion = Conexion.conectar();
                PreparedStatement sentencia =
                        conexion.prepareStatement(sql)
        ) {

            sentencia.setString(
                    1,
                    correo
            );

            ResultSet resultado =
                    sentencia.executeQuery();

            if (resultado.next()) {

                Cliente cliente =
                        new Cliente(
                                resultado.getString("nombre"),
                                resultado.getString("apellido"),
                                resultado.getString("telefono"),
                                resultado.getString("correo"),
                                resultado.getString("direccion"),
                                resultado.getString("contraseña")
                        );

                cliente.idCliente =
                        resultado.getInt("id_cliente");

                return cliente;
            }

        } catch (SQLException e) {

            System.out.println(
                    "Error al buscar el cliente por correo."
            );

            e.printStackTrace();
        }

        return null;
    }

    // ==========================================
    // INICIAR SESIÓN
    // ==========================================

    public static Cliente iniciarSesion(
            String correo,
            String contraseña) {

        String sql = """
                SELECT id_cliente,
                       nombre,
                       apellido,
                       telefono,
                       correo,
                       direccion,
                       contraseña
                FROM Cliente
                WHERE correo = ?
                AND contraseña = ?
                """;

        try (
                Connection conexion = Conexion.conectar();
                PreparedStatement sentencia =
                        conexion.prepareStatement(sql)
        ) {

            sentencia.setString(
                    1,
                    correo
            );

            sentencia.setString(
                    2,
                    contraseña
            );

            ResultSet resultado =
                    sentencia.executeQuery();

            if (resultado.next()) {

                Cliente cliente =
                        new Cliente(
                                resultado.getString("nombre"),
                                resultado.getString("apellido"),
                                resultado.getString("telefono"),
                                resultado.getString("correo"),
                                resultado.getString("direccion"),
                                resultado.getString("contraseña")
                        );

                cliente.idCliente =
                        resultado.getInt("id_cliente");

                return cliente;
            }

        } catch (SQLException e) {

            System.out.println(
                    "Error al iniciar sesión."
            );

            e.printStackTrace();
        }

        return null;
    }

    // ==========================================
    // GETTERS
    // ==========================================

    public int getIdCliente() {

        return idCliente;
    }

    public String getNombre() {

        return nombre;
    }

    public String getApellido() {

        return apellido;
    }

    public String getTelefono() {

        return telefono;
    }

    public String getCorreo() {

        return correo;
    }

    public String getDireccion() {

        return direccion;
    }

    public String getContraseña() {

        return contraseña;
    }
}