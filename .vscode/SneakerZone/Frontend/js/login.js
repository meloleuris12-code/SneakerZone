const formulario = document.getElementById("formulario-login");

console.log("login.js cargado correctamente");

formulario.addEventListener("submit", async function(event) {


event.preventDefault();

console.log("Formulario de login enviado");

const correo = document.getElementById("correo").value.trim();

const contraseña = document.getElementById("contraseña").value;

console.log("Correo:", correo);

if (correo === "" || contraseña === "") {

    alert("Completa el correo y la contraseña.");

    return;
}

const datos = {
    correo: correo,
    contraseña: contraseña
};

console.log("Enviando datos al servidor:", datos);

try {

    const respuesta = await fetch(
        "http://localhost:8080/login",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(datos)
        }
    );

    console.log(
        "Estado del servidor:",
        respuesta.status
    );

    const resultado = await respuesta.json();

    console.log(
        "Respuesta del servidor:",
        resultado
    );

    if (respuesta.ok) {

        localStorage.setItem(
            "usuario",
            JSON.stringify(resultado)
        );

        alert(
            "¡Bienvenido a SneakerZone, " +
            resultado.nombre +
            "!"
        );

        window.location.href = "index.html";

    } else {

        alert(
            resultado.mensaje ||
            "Correo o contraseña incorrectos."
        );
    }

} catch (error) {

    console.error(
        "Error completo:",
        error
    );

    alert(
        "No se pudo conectar con el servidor."
    );
}


});
