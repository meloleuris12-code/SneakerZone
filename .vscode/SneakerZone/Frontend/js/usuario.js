console.log("usuario.js cargado correctamente");

const usuarioGuardado = localStorage.getItem("usuario");

console.log("Datos guardados:", usuarioGuardado);

const nombreUsuario = document.getElementById("nombre-usuario");
const correoUsuario = document.getElementById("correo-usuario");
const telefonoUsuario = document.getElementById("telefono-usuario");
const direccionUsuario = document.getElementById("direccion-usuario");
const botonCerrarSesion = document.getElementById("cerrar-sesion");

if (usuarioGuardado) {


const usuario = JSON.parse(usuarioGuardado);

console.log("Usuario:", usuario);

nombreUsuario.innerText =
    (usuario.nombre || "") +
    " " +
    (usuario.apellido || "");

correoUsuario.innerText =
    usuario.correo || "No disponible";

telefonoUsuario.innerText =
    usuario.telefono || "No disponible";

direccionUsuario.innerText =
    usuario.direccion || "No disponible";


} else {


nombreUsuario.innerText =
    "No has iniciado sesión";

correoUsuario.innerText =
    "No disponible";

telefonoUsuario.innerText =
    "No disponible";

direccionUsuario.innerText =
    "No disponible";


}

botonCerrarSesion.addEventListener(
"click",
function () {


    localStorage.removeItem("usuario");

    alert(
        "Has cerrado sesión correctamente"
    );

    window.location.href =
        "index.html";

}


);
