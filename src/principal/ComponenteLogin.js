import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "universal-cookie";
import axios from "axios";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import herramientas from "../assets/img/herramientas-login.jpg";

export default function ComponenteLogin(props) {
  const baseUrl = "https://localhost:44318/api-ferreteria/usuario";
  const cookies = new Cookies();
  const history = useNavigate();
  const [form, setForm] = useState({
    id: 90,
    nombre: "",
    contraseña: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    console.log(form);
  };

  const iniciarSesion = async () => {
    await axios
      .get(baseUrl + `/${form.nombre}/${form.contraseña}`)
      .then((response) => {
        return response.data;
      })
      .then((response) => {
        if (response.length > 0) {
          var respuesta = response[0];
          cookies.set("id", respuesta.id, { path: "/" });
          cookies.set("nombre", respuesta.nombre, { path: "/" });
          cookies.set("rol", respuesta.rol, { path: "/" });
          localStorage.setItem("id", respuesta.id);
          localStorage.setItem("nombre", respuesta.nombre);
          localStorage.setItem("rol", respuesta.rol);

          Swal.fire("Bievenido!", "Ingreso Con Exito", "success");
          //history('/venta');
          window.location.reload();
        } else {
          Swal.fire("Ups", "Contraseña/Usuario Incorrectos", "error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log(cookies.get("id"));
    if (cookies.get("id")) {
      history("/ventas");
    }
  }, []);

  


  

  //eliminar el usuario del local storage al cerrar sesion
  useEffect(() => {
    if (!cookies.get("id") && !cookies.get("nombre") && !cookies.get("rol")) {
      localStorage.removeItem("id");
      localStorage.removeItem("nombre");
      localStorage.removeItem("rol");
    }
  },[]);
  





  return (
    <div className="containerPrincipal">
      <Card
        className="containerLogin"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <img src={herramientas} style={{ width: "300px", height: "auto" }} />
        <div
          style={{
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            style={{
              fontSize: "30px",
              textAlign: "center",
              fontWeight: 800,
              marginBottom: "20px",
            }}
          >
            BIENVENIDO
          </Typography>
          <div
            style={{
              width: "100%",
              marginBottom: "20px",
              alignItems: "center",
            }}
          >
            <TextField
              type="text"
              required
              name="nombre"
              value={form.nombre}
              label="Nombre de Usuario"
              onChange={handleChange}
              style={{ width: "100%" }}
            />
            <TextField
              required
              type="password"
              name="contraseña"
              label="Contraseña"
              value={form.contraseña}
              onChange={handleChange}
              style={{ marginTop: "10px", width: "100%" }}
            />
          </div>
          <Button
            variant="contained"
            className="btn btn-primary"
            style={{ padding: "10px" }}
            onClick={() => iniciarSesion()}
          >
            Iniciar Sesión
          </Button>
        </div>
      </Card>
    </div>
  );
}
