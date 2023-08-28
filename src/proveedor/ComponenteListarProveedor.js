import React, { Component, useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
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
import Typography from '@mui/material/Typography';
import Swal from "sweetalert2";
import Cookies from 'universal-cookie';
import { Link, useNavigate } from "react-router-dom";


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
  transform: 'translate(-50%, 25%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, .2)',
  p: 3,
  borderRadius: "5px",
};

const style2 = {
  fontSize: 25,
  fontWeight: '600',
  padding:"5px 10px",
  color:"black",
  marginBottom:"20px",
  borderRadius:"5px",
  backgroundColor:"#EEEEEE",
  border:"3px solid white"
};

const style3 = {
  fontSize: 25,
  fontWeight: '500',
  color:"black",
  marginBottom:"5px",
  borderBottom:"1px solid #EEEEEE",
  
};



export default function ComponenteListarProveedor() {

    const cookies = new Cookies();
    const history = useNavigate();
  

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

    setForm(updatedForm);
    console.log(updatedForm);
  };
  
  

  useEffect(() => {
    if (!cookies.get('id')) {
        history("/login");
    }
  
  peticionGet();
  }, []);




return (

  <div style={{height:"auto", minHeight:"calc(100vh - 65px)", padding:"20px"}}>
    <Typography><Box sx={style2}>Lista de Proveedores</Box></Typography>

    <Stack spacing={2} direction="row">
      <Button
        onClick={() => { setForm({tipoModal: 'insertar' }); abrirModalInsertar() }}
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
                        color: "#FFFFFF",
                        border: "#B81414",
                        gap: "5px",
                      }}
                      variant="outlined"
                      onClick={() => {
                        
                        seleccionarProveedor(params.row.id);
                        
                      }}
                    >
                      Editar
                      <EditIcon style={{color:"white"}} ></EditIcon>
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
                  marginBottom:"0px"
                },
                ".MuiTablePagination-selectLabel": {
                  color: "black",
                  marginBottom:"0px"
                },
                " .MuiTablePagination-toolbar": {
                  color: "black",
                },
                ".MuiTablePagination-actions": {
                  color: "#201a1b",
                  background: "#FBFCFF",
                },"& .MuiSelect-select":{
                  backgroundColor: "#FFFFFF",
                border: "1px solid #ced4da",
                borderRadius: "10px",
                }
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
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <Typography><Box sx={style3}>Proveedor</Box></Typography>

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
                backgroundColor: "#FF5722",
                color: "#ffffff",
                fontWeight: "600",
                marginTop: "10px",
              }}
            >
              Insertar
            </Button> :
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
          }

          <Button
            onClick={cerrarModalInsertar}
            style={{
              width: "110px",
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
