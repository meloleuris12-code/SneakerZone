// ==========================================
// REGISTRO DE USUARIO
// ==========================================

const formulario = document.getElementById("formulario-registro");


// Verificar que el formulario exista

if (!formulario) {

    console.error(
        "No se encontró el formulario con id 'formulario-registro'."
    );

} else {

    console.log(
        "registro.js cargado correctamente."
    );


    // ==========================================
    // EVENTO ENVIAR FORMULARIO
    // ==========================================

    formulario.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            console.log(
                "Formulario enviado."
            );


            // ==========================================
            // OBTENER CAMPOS
            // ==========================================

            const nombre =
                document.getElementById("nombre")
                    .value
                    .trim();


            const apellido =
                document.getElementById("apellido")
                    .value
                    .trim();


            const telefono =
                document.getElementById("telefono")
                    .value
                    .trim();


            const correo =
                document.getElementById("correo")
                    .value
                    .trim();


            const direccion =
                document.getElementById("direccion")
                    .value
                    .trim();


            const contraseña =
                document.getElementById("contraseña")
                    .value;


            const confirmarContraseña =
                document.getElementById("confirmar-contraseña")
                    .value;


            // ==========================================
            // VALIDAR CONTRASEÑAS
            // ==========================================

            if (
                contraseña !==
                confirmarContraseña
            ) {

                alert(
                    "Las contraseñas no coinciden."
                );

                return;

            }


            // ==========================================
            // CREAR OBJETO DE DATOS
            // ==========================================

            const datos = {

                nombre: nombre,

                apellido: apellido,

                telefono: telefono,

                correo: correo,

                direccion: direccion,

                contraseña: contraseña

            };


            console.log(
                "Datos que se enviarán:",
                datos
            );


            // ==========================================
            // CONECTAR CON EL SERVIDOR JAVA
            // ==========================================

            try {

                console.log(
                    "Conectando con el servidor..."
                );


                const respuesta =
                    await fetch(
                        "http://localhost:8080/registro",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    datos
                                )

                        }
                    );


                console.log(
                    "Respuesta del servidor:",
                    respuesta.status
                );


                // ==========================================
                // LEER RESPUESTA
                // ==========================================

                const mensaje =
                    await respuesta.text();


                console.log(
                    "Mensaje del servidor:",
                    mensaje
                );


                // ==========================================
                // REGISTRO EXITOSO
                // ==========================================

                if (
                    respuesta.ok
                ) {

                    alert(
                        "¡Cuenta creada correctamente!"
                    );


                    // Redirigir al login

                    window.location.href =
                        "login.html";


                } else {


                    // ==========================================
                    // ERROR DEL SERVIDOR
                    // ==========================================

                    alert(
                        "Error: " +
                        mensaje
                    );

                }


            } catch (error) {


                // ==========================================
                // ERROR DE CONEXIÓN
                // ==========================================

                console.error(
                    "Error completo:",
                    error
                );


                alert(
                    "No se pudo conectar con el servidor.\n\n" +
                    "Verifica que el servidor Java esté ejecutándose en el puerto 8080."
                );

            }

        }
    );

}