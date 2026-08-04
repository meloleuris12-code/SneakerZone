public class producto {

    private int idProducto;
    private String nombre;
    private String descripcion;
    private double precio;
    private int stock;
    private int idMarca;
    private String fechaRegistro;

    public producto(int idProducto, String nombre, String descripcion,
                    double precio, int stock, int idMarca, String fechaRegistro) {

        this.idProducto = idProducto;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.idMarca = idMarca;
        this.fechaRegistro = fechaRegistro;
    }

    public int getIdProducto() {
        return idProducto;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public double getPrecio() {
        return precio;
    }

    public int getStock() {
        return stock;
    }

    public int getIdMarca() {
        return idMarca;
    }

    public String getFechaRegistro() {
        return fechaRegistro;
    }

    @Override
    public String toString() {
        return "ID: " + idProducto
                + " | Producto: " + nombre
                + " | Descripción: " + descripcion
                + " | Precio: US$ " + precio
                + " | Stock: " + stock
                + " | Marca ID: " + idMarca
                + " | Fecha: " + fechaRegistro;
    }
}