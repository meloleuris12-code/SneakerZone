import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Conexion {

    private static final String URL =
            "jdbc:sqlserver://LEURYPC:1433;"
            + "databaseName=Tienda;"
            + "integratedSecurity=true;"
            + "encrypt=true;"
            + "trustServerCertificate=true";

    public static Connection conectar() {

        try {

            Class.forName(
                "com.microsoft.sqlserver.jdbc.SQLServerDriver"
            );

            Connection conexion =
                DriverManager.getConnection(URL);

            System.out.println(
                "Conexión exitosa a la base de datos Tienda."
            );

            return conexion;

        } catch (ClassNotFoundException e) {

            System.out.println(
                "No se encontró el driver JDBC."
            );

            e.printStackTrace();

            return null;

        } catch (SQLException e) {

            System.out.println(
                "Error al conectar con la base de datos."
            );

            e.printStackTrace();

            return null;

        }

    }

    public static void main(String[] args) {

        Connection conexion = conectar();

        if (conexion != null) {

            System.out.println(
                "SneakerZone está conectado a SQL Server."
            );

        }

    }

}