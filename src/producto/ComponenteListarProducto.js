
import React, { useState, useEffect } from "react";
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
import { Modal } from 'reactstrap';
import { Button,Switch } from "@mui/material";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from '@mui/material/Typography';
import Swal from "sweetalert2";

import Cookies from 'universal-cookie';
import { Link, useNavigate } from "react-router-dom";

const url = "https://localhost:44318/api-ferreteria/producto/";

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
  transform: 'translate(-50%, 10%)',
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



export default function ComponenteListarProducto() {

  const cookies = new Cookies();
  const history = useNavigate();

  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    tipoModal: '',
    descripcion: '',
    precioVenta: '',
    precioCompra: '',
    stock: '',
    url: '',
    categoriaId: '',
    marcaId: '',
    proveedorId: '',
    estado: true,
  });
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [tipoModal, setTipoModal] = useState('insertar');

  const [imageFile, setImageFile] = useState("");

  const handleImageChange = (event) => {
    const imageName = event.target.files[0].name;

    setForm((prevForm) => ({ ...prevForm, url: imageName }));
    
    console.log(imageName)
  };
  
  const peticionPost = async () => {
    const newForm = { ...form };
    delete newForm.id;

    if (newForm.nombre === undefined){
      Swal.fire(
        'Opps!',
        'No ingreso una nombre',
        'error'
      )
    }
    if (newForm.descripcion === undefined){
      Swal.fire(
        'Opps!',
        'No ingreso una descripcion',
        'error'
      )
    }
    if (newForm.proveedorId === undefined){
      Swal.fire(
        'Opps!',
        'No selecciono un proveedor',
        'error'
      )
    }

    if (newForm.marcaId === undefined){
      Swal.fire(
        'Opps!',
        'No selecciono una marca',
        'error'
      )
    }

    if (newForm.categoriaId === undefined){
      Swal.fire(
        'Opps!',
        'No selecciono una categoria',
        'error'
      )
    }
    try {

      const formData = new FormData();
      formData.append("file", imageFile);
      
      await axios.post(url, newForm);
      Swal.fire("Producto", "Registrado con éxito", "success");
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
    Promise.all([obtenerCategorias(), obtenerMarcas(), obtenerProveedores()])
      .then(([categorias, marcas, proveedores]) => {
        setModalInsertar(true);
        setCategorias(categorias);
        setMarcas(marcas);
        setProveedores(proveedores);
        setForm(prevForm => ({
          ...prevForm,
          estado: prevForm.estado === undefined ? true : prevForm.estado,
        }));
      })
      
      .catch((error) => {
        console.log(error.message);
      });
  };

  const obtenerCategorias = () => {
    return axios.get("https://localhost:44318/api-ferreteria/categoria/custom")
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  const obtenerMarcas = () => {
    return axios.get("https://localhost:44318/api-ferreteria/marca/custom")
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  const obtenerProveedores = () => {
    return axios.get("https://localhost:44318/api-ferreteria/proveedor/custom")
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error.message);
      });
  };




  const peticionPut = () => {
    if (form.nombre === undefined || form.nombre ===""){
      Swal.fire(
        'Opps!',
        'No ingreso una nombre',
        'error'
      )
    }
    if (form.descripcion === undefined || form.descripcion ===""){
      Swal.fire(
        'Opps!',
        'No ingreso una descripcion',
        'error'
      )
    }
    if (form.proveedorId === undefined){
      Swal.fire(
        'Opps!',
        'No selecciono un proveedor',
        'error'
      )
    }

    if (form.marcaId === undefined){
      Swal.fire(
        'Opps!',
        'No selecciono una marca',
        'error'
      )
    }

    if (form.categoriaId === undefined){
      Swal.fire(
        'Opps!',
        'No selecciono una categoria',
        'error'
      )
    }
    axios
      .put(url + form.id, form)
      .then(response => {
        Swal.fire("Producto", "Actualizado con éxito", "success");
        cerrarModalInsertar();
        peticionGet();
      })
      .catch(error => {
        console.error(error);
      });
  };

  const cerrarModalInsertar = () => {
    setModalInsertar(false);
    setForm({
      id: "",
      nombre: "",
      tipoModal: "",
      descripcion: "",
      precioVenta: "",
      precioCompra: "",
      stock: "",
      url: "",
      categoriaId: "",
      marcaId: "",
      proveedorId: "",
      estado: null,
    });
    setCategorias([]);
    setMarcas([]);
    setProveedores([]);
  };

  const seleccionarProducto = async (idProducto) => {
    try {
      const response = await axios.get(`${url}${idProducto}`);
      if (response.status === 200) {
        const data = response.data;
        setForm({
          id: data.id,
          nombre: data.nombre,
          descripcion: data.descripcion,
          precioVenta: data.precioVenta,
          precioCompra: data.precioCompra,
          stock: data.stock,
          url: data.url,
          categoriaId: data.categoriaId,
          marcaId: data.marcaId,
          proveedorId: data.proveedorId,
          estado: data.estado,
        });
        abrirModalInsertar();
        console.log(data);
      } else {
        console.error('Error al obtener los datos del producto de la API');
      }
    } catch (error) {
      console.error('Error al obtener los datos del producto:', error);
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
  <div style={{
    height: "auto",
    minHeight: "calc(100vh - 65px)",
    padding: "20px",
  }}>
    <Typography><Box sx={style2}>Productos / Lista de Productos</Box></Typography>

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
                field: "nombre",
                headerName: "Nombre",
                width: 180,
                disableColumnMenu: true,
              },
              {
                field: "precioVenta",
                headerName: "Venta",
                width: 90,
                disableColumnMenu: true,
              },
              {
                field: "stock",
                headerName: "Stock",
                width: 80,
                disableColumnMenu: true,
              },
              {
                field: "descripcion",
                headerName: "Descripcion",
                width: 400,
                disableColumnMenu: true,
              },
              {
                field: "nombreCategoria",
                headerName: "Categoria",
                width: 130,
                disableColumnMenu: true,
              },
              {
                field: "nombreMarca",
                headerName: "Marca",
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
                        color: "#FFFFFF",
                        border: "#B81414",
                        gap: "5px",
                      }}
                      variant="outlined"
                      onClick={() => {
                        
                        seleccionarProducto(params.row.id);
                        
                      }}
                    >
                      Editar
                      <EditIcon style={{color:"white"}} ></EditIcon>
                    </Button>
                  </Stack>
                ),
              }
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
            <Typography><Box sx={style3}>Producto</Box></Typography>

            <TextField
              size="small"
              variant="outlined"
              type="text"
              label="Nombre"
              name="nombre"
              onChange={handleChange}
              value={form ? form.nombre : ''}
              error={form && form.nombre === ""}
              helperText={form && form.nombre === "" ? "Nombre requerido" : ""}
            />
            <TextField
              size="small"
              variant="outlined"
              type="text"
              label="Descripción"
              name="descripcion"
              onChange={handleChange}
              value={form ? form.descripcion : ''}
              error={form && form.descripcion === ""}
              helperText={form && form.descripcion === "" ? "Descripción requerida" : ""}
            />
            <TextField size="small" variant="outlined" type="number" label="Precio de Venta" name="precioVenta" onChange={handleChange} value={form ? form.precioVenta : ''} />

            

            <TextField size="small" variant="outlined" type="number" label="Stock" name="stock" onChange={handleChange} value={form ? form.stock : ''} />

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="demo-simple-select-label">Marca</InputLabel>
            <Select
              size="small"
              labelId="demo-simple-select-error-label"
              id="demo-simple-select-error"
              label="Marca"
              value={form?.marcaId ?? ''}
              onChange={handleChange}
              name="marcaId"
            >
              {marcas.map(marca => (
                <MenuItem key={marca.id} value={marca.id}>{marca.nombre}</MenuItem>
              ))}
            </Select>
          </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="demo-simple-select-label">Categoria</InputLabel>
                <Select
                  size="small"
                  labelId="demo-simple-select-error-label"
                  id="demo-simple-select-error"
                  label="Categoria"
                  value={form?.categoriaId ?? ''}
                  onChange={handleChange}
                  name="categoriaId"
                >
                  {categorias.map(categoria => (
                    <MenuItem key={categoria.id} value={categoria.id}>{categoria.nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>

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
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginTop: "10px" }}
              />
            <br></br>

          </div>

          {form.tipoModal === 'insertar' ?
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

