
import React, { Component, useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import EditIcon from '@mui/icons-material/Edit';
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
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Button, Checkbox, Switch } from "@mui/material";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from '@mui/material/Typography';
import Swal from "sweetalert2";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
const url = "https://localhost:44318/api-ferreteria/proveedor/";


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
  position: 'absolute',
  top: '50%',
  
  left: '50%',
  transform: 'translate(-50%, 5%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const style2 = {
  fontSize: 30,
  fontWeight: '600',
  color:"black",
  textTransform: 'uppercase',
  marginBottom:"20px"
};




export default function ComponenteListarProveedor() {



  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [form, setForm] = useState({
    id: '',
    ruc: '',
    tipoModal: '',
    razon: '',
    email: '',
    nombreContacto: '',
    telefonoContacto: '',
    estado: true,
  });


  const [tipoModal, setTipoModal] = useState('insertar');


  const peticionPost = async () => {
    const newForm = { ...form };
    delete newForm.id;
    newForm.estado = true;
    if (newForm.ruc === undefined){
      Swal.fire(
        'Opps!',
        'No ingreso un ruc',
        'error'
      )
    }
    if (newForm.razon === undefined){
      Swal.fire(
        'Opps!',
        'No ingreso una razón',
        'error'
      )
    }
    if (newForm.email === undefined){
      Swal.fire(
        'Opps!',
        'No selecciono un email',
        'error'
      )
    }

    if (newForm.nombreContacto === undefined){
      Swal.fire(
        'Opps!',
        'No selecciono un nombre de contacto',
        'error'
      )
    }

    if (newForm.telefonoContacto === undefined){
      Swal.fire(
        'Opps!',
        'No selecciono un telefono de contacto',
        'error'
      )
    }






    try {
      await axios.post(url, newForm);
      Swal.fire("Proveedor", "Registrado con éxito", "success");
      cerrarModalInsertar();
      peticionGet();
    } catch (error) {
      console.error(error);
      
    }
  };




  const peticionGet = () => {
    axios.get(url).then(response => {
      setData(response.data);
    }).catch(error => {
      console.log(error.message);
    })
  }

  const abrirModalInsertar = () => {
    Promise.all([])
      .then(([]) => {
        setModalInsertar(true);
        setForm(prevForm => ({
          ...prevForm,
          estado: prevForm.estado === undefined ? true : prevForm.estado,
          
        }));
      })
      .catch((error) => {
        console.log(error.message);
      });
  };


  const peticionPut = () => {
    if (form.ruc === undefined || form.ruc ===""){
      Swal.fire(
        'Opps!',
        'No ingreso un ruc',
        'error'
      )
    }
    if (form.razon === undefined || form.razon ===""){
      Swal.fire(
        'Opps!',
        'No ingreso una razon',
        'error'
      )
    }
    if (form.email === undefined || form.email ===""){
      Swal.fire(
        'Opps!',
        'No ingreso un email',
        'error'
      )
    }
    if (form.nombreContacto === undefined || form.nombreContacto ===""){
      Swal.fire(
        'Opps!',
        'No ingreso un nombre de contacto',
        'error'
      )
    }
    if (form.telefonoContacto === undefined || form.telefonoContacto ===""){
      Swal.fire(
        'Opps!',
        'No ingreso un telefono de contacto',
        'error'
      )
    }

  
    axios.put(url + form.id, form)
      .then(response => {
        Swal.fire("Proveedor", "Actualizado con éxito", "success");
        cerrarModalInsertar();
        peticionGet();
      })
      .catch(error => {
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
      ruc: "",
      tipoModal: "",
      razon: "",
      email: "",
      nombreContacto: "",
      telefonoContacto: "",
      estado: null,
    });
 
  };

  const seleccionarProveedor = async (idProveedor) => {
    try {
      const response = await axios.get(`${url}${idProveedor}`);
      if (response.status === 200) {
        const data = response.data;
        setForm({
          id: data.id,
          ruc: data.ruc,
          razon: data.razon,
          email: data.email,
          nombreContacto: data.nombreContacto,
          telefonoContacto: data.telefonoContacto,
          estado: data.estado,
        });
        abrirModalInsertar();
        console.log(data);
      } else {
        console.error('Error al obtener los datos del proveedor de la API');
      }
    } catch (error) {
      console.error('Error al obtener los datos del proveedor:', error);
    }
  };
  const handleChange = (e) => {
    const updatedForm = {
      ...form,
      [e.target.name]: e.target.name === 'estado' ? !form.estado : e.target.value
    };
  /*
    if (e.target.name === 'estado') {
      const newValue = updatedForm[e.target.name] === null ? true : !updatedForm[e.target.name];
      updatedForm[e.target.name] = newValue;
    }
  */
    setForm(updatedForm);
    console.log(updatedForm);
  };
  
  

  useEffect(() => {
  peticionGet();
  }, []);




return (

  <div style={{height:"auto", minHeight:"calc(100vh - 65px)", padding:"10px 30px"}}>
    <Typography><Box sx={style2}>Lista de Proveedores</Box></Typography>

    <Stack spacing={2} direction="row">
      <Button
        onClick={() => { setForm({tipoModal: 'insertar' }); abrirModalInsertar() }}
        variant="contained"
        style={{
          width: "200px",
          backgroundColor: "#984061",
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
          backgroundColor: "#fffbff",
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
                field: "ruc",
                headerName: "RUC",
                width: 120,
                disableColumnMenu: true,
              },
              {
                field: "razon",
                headerName: "RAZÓN",
                width: 200,
                disableColumnMenu: true,
              },
              {
                field: "email",
                headerName: "EMAIL",
                width: 230,
                disableColumnMenu: true,
              },
              {
                field: "nombreContacto",
                headerName: "NOMBRE",
                width: 150,
                disableColumnMenu: true,
              },
              {
                field: "telefonoContacto",
                headerName: "TELEFONO",
                width: 100,
                disableColumnMenu: true,
              },
              {
                field: "estado",
                headerName: "Estado",
                width: 80,
                disableColumnMenu: true,
                renderCell: (params) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {params.row.estado ? "" : ""}
                    <div
                      style={{
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        backgroundColor: params.row.estado
                          ? "#2ECC71"
                          : "#E74C3C",
                        marginLeft: "10px",
                      }}
                    ></div>
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
                        backgroundColor: "#ffdcc1",
                        color: "#7c5635",
                        border: "#B81414",
                        gap: "5px",
                      }}
                      variant="outlined"
                      onClick={() => {
                        
                        seleccionarProveedor(params.row.id);
                        
                      }}
                    >
                      Editar
                      <EditIcon style={{color:"black"}} ></EditIcon>
                    </Button>
                  </Stack>
                ),
              }/*,
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
              },*/
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
              },
              ".MuiTablePagination-selectLabel": {
                color: "black",
              },
              " .MuiTablePagination-toolbar": {
                color: "white",
                background: "#FFFBFF",
              },
              ".MuiTablePagination-actions": {
                color: "#201a1b",
                background: "#FFFBFF",
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
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Typography><Box sx={style2}>Proveedor</Box></Typography>

            <TextField
              size="small"
              variant="outlined"
              type="text"
              label="Ruc"
              name="ruc"
              onChange={handleChange}
              value={form ? form.ruc : ''}
              error={form && form.ruc === ""}
              helperText={form && form.ruc === "" ? "Ruc requerido" : ""}
            />
            <TextField
              size="small"
              variant="outlined"
              type="text"
              label="Razon"
              name="razon"
              onChange={handleChange}
              value={form ? form.razon : ''}
              error={form && form.razon === ""}
              helperText={form && form.razon === "" ? "Razón requerido" : ""}
            />
            <TextField
              size="small"
              variant="outlined"
              type="text"
              label="Email"
              name="email"
              onChange={handleChange}
              value={form ? form.email : ''}
              error={form && form.email === ""}
              helperText={form && form.email === "" ? "Email requerido" : ""}
            />
            <TextField
              size="small"
              variant="outlined"
              type="text"
              label="Nombre de contacto"
              name="nombreContacto"
              onChange={handleChange}
              value={form ? form.nombreContacto : ''}
              error={form && form.nombreContacto === ""}
              helperText={form && form.nombreContacto === "" ? "Nombre de Contacto requerido" : ""}
            />
            <TextField
              size="small"
              variant="outlined"
              type="text"
              label="Telefono de contacto"
              name="telefonoContacto"
              onChange={handleChange}
              value={form ? form.telefonoContacto : ''}
              error={form && form.telefonoContacto === ""}
              helperText={form && form.telefonoContacto === "" ? "Telefono de contacto requerido" : ""}
            />

            <div style={{ display: 'flex', alignItems: 'center',marginBottom:"10px" }}>
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
          

          {form.tipoModal === 'insertar' ?
            <Button
              onClick={peticionPost}
              style={{
                width: "100px",
                backgroundColor: "#ffdcc1",
                color: "#7c5635",
                fontWeight: "600",
                marginTop: "10px",
              }}
            >
              Insertar
            </Button> :
            <Button
              onClick={peticionPut}
              style={{
                width: "100px",
                backgroundColor: "#ffdcc1",
                color: "#7c5635",
                fontWeight: "600",
                marginTop: "10px",
              }}
            >
              Actualizar
            </Button>
          }

          <Button
            onClick={cerrarModalInsertar}
            style={{
              width: "100px",
              backgroundColor: "#ba1a1a",
              color: "#ffffff",
              fontWeight: "600",
              marginTop: "10px",
              marginLeft: "10px"
            }}
          >
            Cancelar
          </Button>
          
        </Box>
      </Modal>
    </div>
  );
}

