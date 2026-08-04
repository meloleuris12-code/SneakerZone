import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class ProductoDAO {

    public List<producto> obtenerProductos() {

        List<producto> productos = new ArrayList<>();

        String sql = """
                SELECT id_producto,
                       nombre,
                       descripcion,
                       precio,
                       stock,
                       id_marca,
                       fecha_registro
                FROM Producto
                """;

        try (Connection conexion = Conexion.conectar();
             PreparedStatement consulta = conexion.prepareStatement(sql);
             ResultSet resultado = consulta.executeQuery()) {

            while (resultado.next()) {

                producto producto = new producto(
                        resultado.getInt("id_producto"),
                        resultado.getString("nombre"),
                        resultado.getString("descripcion"),
                        resultado.getDouble("precio"),
                        resultado.getInt("stock"),
                        resultado.getInt("id_marca"),
                        resultado.getString("fecha_registro")
                );

                productos.add(producto);
            }

        } catch (Exception e) {
            System.out.println("Error al obtener los productos.");
            e.printStackTrace();
        }

        return productos;
    }
}