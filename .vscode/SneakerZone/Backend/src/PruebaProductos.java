import java.util.List;

public class PruebaProductos {

    public static void main(String[] args) {

        ProductoDAO dao = new ProductoDAO();

        List<producto> productos = dao.obtenerProductos();

        System.out.println("Productos encontrados: " + productos.size());

        for (producto p : productos) {
            System.out.println(p);
        }
    }
}