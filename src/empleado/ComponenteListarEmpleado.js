import React, { Component, useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import EditIcon from "@mui/icons-material/Edit";
import {
  gridClasses,
  DataGrid,
  gridPageCountSelector,
  GridPagination,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import MuiPagination from "@mui/material/Pagination";
//import Modal from '@mui/material/Modal';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Button, Checkbox, Switch } from "@mui/material";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";

import Cookies from "universal-cookie";
import { Link, useNavigate } from "react-router-dom";

const url = "https://localhost:44318/api-ferreteria/empleado/";

function Pagination({ page, onPageChange, className }) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event, newPage - 1);
      }}
    />
  );
}

function CustomPagination(props) {
  return <GridPagination ActionsComponent={Pagination} {...props} />;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, 50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, .2)",
  p: 3,
  borderRadius: "5px",
};

const style2 = {
  fontSize: 25,
  fontWeight: "600",
  padding: "5px 10px",
  color: "black",
  marginBottom: "20px",
  borderRadius: "5px",
  backgroundColor: "#EEEEEE",
  border: "3px solid white",
};

const style3 = {
  fontSize: 25,
  fontWeight: "500",
  color: "black",
  marginBottom: "5px",
  borderBottom: "1px solid #EEEEEE",
};

export default function ComponenteListarEmpleado() {
  const cookies = new Cookies();
  const history = useNavigate();

  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    tipoModal: "",
    apellido: "",
    rolId: "",
    estado: null,
  });
  const [roles, setRoles] = useState([]);
  const [tipoModal, setTipoModal] = useState("insertar");

  const peticionPost = async () => {
    const newForm = { ...form };
    delete newForm.id;

    if (newForm.nombre === undefined) {
      Swal.fire("Opps!", "No ingreso el nombre", "error");
    }
    if (newForm.apellido === undefined) {
      Swal.fire("Opps!", "No ingreso el apellido", "error");
    }
    if (newForm.rolId === undefined) {
      Swal.fire("Opps!", "No selecciono un rol", "error");
    }

    try {
      await axios.post(url, newForm);
      Swal.fire("Empleado", "Registrado con éxito", "success");
      cerrarModalInsertar();
      peticionGet();
    } catch (error) {
      console.error(error);
    }
  };

  const peticionGet = () => {
    axios
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const abrirModalInsertar = () => {
    Promise.all([obtenerRoles()])
      .then(([roles]) => {
        setModalInsertar(true);
        setRoles(roles);
        setForm((prevForm) => ({
          ...prevForm,
          estado: prevForm.estado === undefined ? true : prevForm.estado,
        }));
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const obtenerRoles = () => {
    return axios
      .get("https://localhost:44318/api-ferreteria/rol")
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const peticionPut = () => {
    if (form.nombre === undefined || form.nombre === "") {
      Swal.fire("Opps!", "No ingreso el nombre", "error");
    }
    if (form.apellido === undefined || form.apellido === "") {
      Swal.fire("Opps!", "No ingreso el apellido", "error");
    }
    if (form.rolId === undefined) {
      Swal.fire("Opps!", "No selecciono un rol", "error");
    }

    axios
      .put(url + form.id, form)
      .then((response) => {
        Swal.fire("Empleado", "Actualizado con éxito", "success");
        cerrarModalInsertar();
        peticionGet();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  /*const peticionHabilitar = (id) => {
    axios.put(url + "habilitar/" + id)
      .then(response => {
        cerrarModalInsertar();
        peticionGet();
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  const peticionDelete = (idEmpleado) => {
    axios.delete(url + idEmpleado)
      .then(response => {
        peticionGet();
      })
      .catch(error => {
        console.log(error.message);
      });
  };
*/

  const cerrarModalInsertar = () => {
    setModalInsertar(false);
    setForm({
      id: "",
      nombre: "",
      tipoModal: "",
      apellido: "",
      rolId: "",
      estado: true,
    });
    setRoles([]);
  };

  const seleccionarEmpleado = async (idEmpleado) => {
    try {
      const response = await axios.get(`${url}${idEmpleado}`);
      if (response.status === 200) {
        const data = response.data;
        setForm({
          id: data.id,
          nombre: data.nombre,
          apellido: data.apellido,
          rolId: data.rolId,
          estado: data.estado,
        });
        abrirModalInsertar();
        console.log(data);
      } else {
        console.error("Error al obtener los datos del empleado de la API");
      }
    } catch (error) {
      console.error("Error al obtener los datos del empleado:", error);
    }
  };
  const handleChange = (e) => {
    const updatedForm = {
      ...form,
      [e.target.name]:
        e.target.name === "estado" ? !form.estado : e.target.value,
    };

    /*if (e.target.name === 'estado') {
      const newValue = updatedForm[e.target.name] === null ? true : !updatedForm[e.target.name];
      updatedForm[e.target.name] = newValue;
    }*/

    setForm(updatedForm);
    console.log(updatedForm);
  };

  useEffect(() => {
    if (!cookies.get("id")) {
      history("/login");
    }
    peticionGet();
  }, []);

  return (
    <div
      style={{
        height: "auto",
        minHeight: "calc(100vh - 65px)",
        padding: "20px",
      }}
    >
      <Typography>
        <Box sx={style2}>Sistema / Lista de Empleados</Box>
      </Typography>

      <Stack spacing={2} direction="row">
        <Button
          onClick={() => {
            setForm({ tipoModal: "insertar" });
            abrirModalInsertar();
          }}
          variant="contained"
          style={{
            width: "200px",
            backgroundColor: "#FF5722",
            color: "#ffffff",
            fontWeight: "600",
            marginBottom: "10px",
          }}
        >
          Registrar
        </Button>
      </Stack>
      <div
        style={{
          height: "auto",
          width: "100%",
          backgroundColor: "#FBFCFF",
          marginBottom: "200px",
        }}
      >
        <Box>
          <DataGrid
            rows={data}
            columns={[
              {
                field: "id",
                headerName: "ID",
                width: 50,
                disableColumnMenu: true,
              },
              {
                field: "nombre",
                headerName: "Nombre",
                width: 100,
                disableColumnMenu: true,
              },
              {
                field: "apellido",
                headerName: "Apellido",
                width: 100,
                disableColumnMenu: true,
              },
              {
                field: "nombreRol",
                headerName: "Rol",
                width: 130,
                disableColumnMenu: true,
              },
              {
                field: "estado",
                headerName: "Estado",
                width: 150,
                disableColumnMenu: true,
                renderCell: (params) => (
                  <div
                    style={{
                      display: "flex",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      color: "white",
                      fontWeight: "600",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: params.row.estado
                        ? "#2ECC71"
                        : "#E74C3C",
                    }}
                  >
                    {params.row.estado ? "Habilitado" : "Deshabilitado"}
                  </div>
                ),
              },
              {
                field: "Editar",
                headerName: "Editar",
                disableColumnMenu: true,
                width: 130,
                renderCell: (params) => (
                  <Stack spacing={2}>
                    <Button
                      style={{
                        fontWeight: 600,
                        backgroundColor: "#4CAF50",
                        color: "#ffffff",
                        border: "#B81414",
                        gap: "5px",
                      }}
                      variant="outlined"
                      onClick={() => {
                        seleccionarEmpleado(params.row.id);
                      }}
                    >
                      Editar
                      <EditIcon style={{ color: "white" }}></EditIcon>
                    </Button>
                  </Stack>
                ),
              } /*,
              {
                field: "Eliminar",
                headerName: "Eliminar",
                disableColumnMenu: true,
                width: 170,
                renderCell: (params) => (
                  <Stack spacing={2}>
                    {params.row.estado ? (
                      <Button
                        style={{
                          fontWeight: 600,
                          backgroundColor: "#ba1a1a",
                          color: "white",
                          border: "#B81414",
                        }}
                        variant="outlined"
                        onClick={() => {
                          peticionDelete(params.row.id);
                        }}
                      >
                        Desactivar
                        <DeleteRoundedIcon style={{color:"white"}} ></DeleteRoundedIcon>
                      </Button>
                    ) : (
                      <Button
                        style={{
                          fontWeight: 600,
                          backgroundColor: "#1BA83B",
                          color: "white",
                          border: "#1BA83B",
                        }}
                        variant="outlined"
                        onClick={() => {
                          peticionHabilitar(params.row.id);
                        }}
                      >
                        Activar
                        <TaskAltRoundedIcon style={{color:"white"}} ></TaskAltRoundedIcon>
                      </Button>
                    )}
                  </Stack>
                ),
              },*/,
            ]}
            autoHeight
            checkboxSelection={false}
            disableRowSelectionOnClick={true}
            pageSizeOptions={[5, 10, 25, 100]}
            sx={{
              [`& .${gridClasses.row}`]: {
                bgcolor: (theme) =>
                  theme.palette.mode === "light" ? "white" : "black",
              },
              ".MuiTablePagination-displayedRows": {
                color: "black",
                marginBottom: "0px",
              },
              ".MuiTablePagination-selectLabel": {
                color: "black",
                marginBottom: "0px",
              },
              " .MuiTablePagination-toolbar": {
                color: "black",
              },
              ".MuiTablePagination-actions": {
                color: "#201a1b",
                background: "#FBFCFF",
              },
              "& .MuiSelect-select": {
                backgroundColor: "#FFFFFF",
                border: "1px solid #ced4da",
                borderRadius: "10px",
              },
            }}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pagination
            slots={{
              pagination: CustomPagination,
            }}
            componentsProps={{
              pagination: {
                labelRowsPerPage: "Datos por pagina",
              },
            }}
          />
        </Box>
      </div>

      <Modal isOpen={modalInsertar}>
        <Box sx={style}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <Typography>
              <Box sx={style3}>Empleado</Box>
            </Typography>

            <TextField
              size="small"
              variant="outlined"
              type="text"
              label="Nombre"
              name="nombre"
              onChange={handleChange}
              value={form ? form.nombre : ""}
              error={form && form.nombre === ""}
              helperText={form && form.nombre === "" ? "Nombre requerido" : ""}
            />
            <TextField
              size="small"
              variant="outlined"
              type="text"
              label="Apellido"
              name="apellido"
              onChange={handleChange}
              value={form ? form.apellido : ""}
              error={form && form.apellido === ""}
              helperText={
                form && form.apellido === "" ? "Apellido requerido" : ""
              }
            />

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="demo-simple-select-label">Rol</InputLabel>
              <Select
                size="small"
                labelId="demo-simple-select-error-label"
                id="demo-simple-select-error"
                label="Rol"
                value={form?.rolId ?? ""}
                onChange={handleChange}
                name="rolId"
              >
                {roles.map((rol) => (
                  <MenuItem key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <Typography>Estado:</Typography>
              <Switch
                color="primary"
                checked={form.estado}
                onChange={handleChange}
                value={form.estado}
                name="estado"
              />
            </div>
          </div>

          {form.tipoModal === "insertar" ? (
            <Button
              onClick={peticionPost}
              style={{
                width: "110px",
                backgroundColor: "#FF5722",
                color: "#ffffff",
                fontWeight: "600",
                marginTop: "10px",
              }}
            >
              Insertar
            </Button>
          ) : (
            <Button
              onClick={peticionPut}
              style={{
                width: "110px",
                backgroundColor: "#FF5722",
                color: "#ffffff",
                fontWeight: "600",
                marginTop: "10px",
              }}
            >
              Actualizar
            </Button>
          )}

          <Button
            onClick={cerrarModalInsertar}
            style={{
              width: "100px",
              backgroundColor: "#ba1a1a",
              color: "#ffffff",
              fontWeight: "600",
              marginTop: "10px",
              marginLeft: "10px",
            }}
          >
            Cancelar
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
