export const tieneAccesoUsuario = (rolPermitido) => {
    const usuarioRol = localStorage.getItem("rol");
    console.log(usuarioRol);
    // Verifica si el usuario tiene el rol permitido
    return usuarioRol === rolPermitido;
};