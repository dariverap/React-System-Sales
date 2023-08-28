import Swal from 'sweetalert2'
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Modal } from 'reactstrap';
import Cookies from 'universal-cookie';
import { Link, useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { Button, Switch } from "@mui/material";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from '@mui/material/Typography';

function Pagination({ page, onPageChange, className }) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <MuiPagination
      color="secondary"
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
  fontSize: 25,
  fontWeight: '600',
  padding:"5px 10px",
  color:"black",
  marginBottom:"20px",
  borderRadius:"5px",
  backgroundColor:"#EEEEEE",
  border:"3px solid white",
};

const style3 = {
  fontSize: 25,
  fontWeight: '500',
  color:"black",
  marginBottom:"5px",
  borderBottom:"1px solid #EEEEEE",
  
};

export default function ComponenteReporteVenta() {
  const cookies = new Cookies();
  const history = useNavigate();
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFinal, setFechaFinal] = useState(new Date());
  const urlVenta = "https://localhost:44318/api-ferreteria/comprobante/"
  const [ventas, setVentas] = useState([]);

  const [tTotal, setTTotal] = useState(0); // Utilizar setTTotal en lugar de settTotal
  const [tSubtotal, setTSubtotal] = useState(0); // Utilizar setTSubtotal en lugar de setSubtotal
  const [tIGV, setTIGV] = useState(0); // Utilizar setTIGV en lugar de setIGV
  
  const [comprobanteSeleccionado, setComprobanteSeleccionado] = useState({
    numerocomprobante: '',
    comentario: '',})
  const [comentario, setComentario] = useState(''); // Estado para el valor del campo de comentario

  const [modalComprobante, setModalComprobante] = useState(false);

  const peticionGet = () => {
    axios.get(urlVenta+"personalizado").then(response => {
      // Asignar las ventas obtenidas a la variable de estado
      setVentas(response.data.comprobantes);
  
      // Asignar los totales a las variables de estado correspondientes
      setTTotal(response.data.totalSum);
      setTSubtotal(response.data.subtotalSum);
      setTIGV(response.data.igvSum);
  
      
    }).catch(error => {
      console.log(error.message);
    });
  };

  const peticionBuscar = () => {
    const fechaInicioFormatted = dayjs(fechaInicio).format('YYYY-MM-DD');
    const fechaFinalFormatted = dayjs(fechaFinal).format('YYYY-MM-DD');
    axios.get(`${urlVenta}buscar/${fechaInicioFormatted}/${fechaFinalFormatted}`).then(response => {

      // Asignar las ventas obtenidas a la variable de estado
      setVentas(response.data.comprobantes);
      // Asignar los totales a las variables de estado correspondientes
      setTTotal(response.data.totalSum);
      setTSubtotal(response.data.subtotalSum);
      setTIGV(response.data.igvSum);
      
    }).catch(error => {
      console.log(error.message);
    })
  }

  const abrirModalInsertar = () => {
    setModalComprobante(true);
        
  };

  const cerrarModalInsertar= () => {
    setModalComprobante(false);
        
  };

  const seleccionarComprobante = async (idComprobante) => {
    abrirModalInsertar();
    setComprobanteSeleccionado((prevComprobante) => ({
      ...prevComprobante,
      numerocomprobante: idComprobante,
    }));

  }

  const handleChangeComentario = (e) => {
    setComentario(e.target.value);
  };

const cancelarVenta = async () => {
  try {
    const comprobanteConComentario = {
      ...comprobanteSeleccionado,
      comentario: comentario,
    };
    await axios.put(urlVenta + "cancelarVenta", comprobanteConComentario);
    Swal.fire("Venta", "Desactivada con éxito", "success");
    cerrarModalInsertar();
    peticionGet();
    setComentario('');
    setComprobanteSeleccionado({
          numerocomprobante: '',
          comentario: '',
        });
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    if (!cookies.get('id')) {
      history("/login");
    }
    peticionGet();
  }, []);



  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        minHeight: "calc(100vh - 65px)",
        padding: "20px 10px 10px 20px",
      }}
    >
      <Typography>
        <Box sx={style2}>Ventas / Reporte de las Ventas</Box>
      </Typography>



      <div style={{display:"flex",gap:"20px",flexDirection:"column",overflow:"hidden",width:"100%"}}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
            gap: "10px",
            backgroundColor: "#fffbff",
            borderRadius: "5px",
            padding: "5px",
            width: "100%",
            boxShadow: "0px 0px 4px rgba(0,0,0,0.4)",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateField", "DateField"]}>
              <DatePicker
                format="DD-MM-YYYY"
                label="Fecha Inicio"
                color="success"
                sx={{ m: 0.2, width: "25ch" }}
                size="small"
                defaultValue={dayjs(fechaInicio)}
                onChange={(date) => setFechaInicio(date)}
              />
            </DemoContainer>
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateField", "DateField"]}>
              <DatePicker
                format="DD-MM-YYYY"
                label="Fecha Final"
                color="success"
                sx={{ m: 0.2, width: "25ch" }}
                size="small"
                defaultValue={dayjs(fechaFinal)}
                onChange={(date) => setFechaFinal(date)}
              />
            </DemoContainer>
          </LocalizationProvider>
            <Button
              onClick={() => {
                peticionBuscar();
              }}
              variant="contained"
              style={{
                width: "180px",
                backgroundColor: "#FF5722",
                color: "#ffffff",
                fontWeight: "600",
                height: "100%",
              }}
            >
              Buscar
            </Button>
          <TextField
            disabled
            id="outlined-start-adornment"
            sx={{ mt: 0.8, width: "25ch" }}
            value={tIGV}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">IGV: S/. </InputAdornment>
              ),
            }}
          />
          <TextField
            disabled
            id="outlined-start-adornment"
            sx={{ mt: 0.8, width: "25ch" }}
            value={tSubtotal}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Subtotal: S/. </InputAdornment>
              ),
            }}
          />
          <TextField
            disabled
            id="outlined-start-adornment"
            sx={{ mt: 0.8, width: "25ch" }}
            value={tTotal}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Total: S/. </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Tabla de ventas */}
        <div
          style={{
            height: "auto",
            width: "100%",
            backgroundColor: "#FBFCFF",
            marginBottom: "200px"
          }}
        >
            <DataGrid
              getRowId={(row) => row.numero}
              rows={ventas}
              columns={[
                {
                  field: "numero",
                  headerName: "Numero",
                  width: 80,
                  disableColumnMenu: true,
                },
                {
                  field: "fecha",
                  type: "dateTime",
                  valueGetter: ({ value }) => value && new Date(value),
                  headerName: "Fecha",
                  width: 150,
                  disableColumnMenu: true,
                  valueFormatter: ({ value }) =>
                    new Date(value).toLocaleDateString("es-ES"), // Formateamos la fecha usando toLocaleDateString
                },
                {
                  field: "formaPago",
                  headerName: "Forma Pago",
                  width: 150,
                  disableColumnMenu: true,
                },
                {
                  field: "documento",
                  headerName: "Documento",
                  width: 120,
                  disableColumnMenu: true,
                },
                {
                  field: "igv",
                  headerName: "IGV",
                  width: 80,
                  disableColumnMenu: true,
                },
                {
                  field: "subtotal",
                  headerName: "SubTotal",
                  width: 100,
                  disableColumnMenu: true,
                },
                {
                  field: "total",
                  headerName: "Total",
                  width: 130,
                  disableColumnMenu: true,
                },
                {
                  field: "comentario",
                  headerName: "Comentario",
                  width: 350,
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
                  field: "Cancelar Venta",
                  headerName: "Accion",
                  disableColumnMenu: true,
                  width: 200,
                  renderCell: (params) => (
                    <Stack spacing={2}>
                      {params.row.estado ? ( // Si el estado es true (venta no anulada)
                        <Button
                          style={{
                            fontWeight: 600,
                            backgroundColor: "#ba1a1a",
                            color: "#ffffff",
                            border: "#B81414",
                          }}
                          variant="outlined"
                          onClick={() => {
                            seleccionarComprobante(params.row.numero);
                          }}
                        >
                          Anular Venta
                          <DeleteForeverIcon style={{ color: "black" }} />
                        </Button>
                      ) : (
                        // Si el estado es false (venta anulada)
                        <Button
                          style={{
                            fontWeight: 600,
                            backgroundColor: "#808080",
                            color: "#ffffff",
                            border: "#B81414",
                          }}
                          variant="outlined"
                          disabled // Deshabilitamos el botón cuando la venta está anulada
                        >
                          Venta Anulada
                          <DeleteForeverIcon style={{ color: "black" }} />
                        </Button>
                      )}
                    </Stack>
                  ),
                },
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
                ".MuiTablePagination-actions": {
                  color: "#201a1b",
                  background: "#FBFCFF",
                },
                "& .MuiSelect-select": {
                  backgroundColor: "#F5F5F5",
                  borderRadius: "10px",
                },"& .MuiPaginationItem-root":{
                  backgroundColor: "#1976d2",
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

        </div>

      </div>

      {/* Modal comprobante */}
      <Modal isOpen={modalComprobante}>
        <Box sx={style}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Typography>
              <Box sx={style2}>¿Desea Anular esta Venta?</Box>
            </Typography>
            <Typography>
              <Box sx={style3}>
                Numero de comprobante:{" "}
                {comprobanteSeleccionado.numerocomprobante}
              </Box>
            </Typography>
            <TextField
              size="small"
              variant="outlined"
              type="text"
              label="Comentario"
              name="comentario"
              value={comentario}
              onChange={handleChangeComentario}
            />
          </div>

          <Button
            style={{
              backgroundColor: "#ba1a1a",
              color: "#ffffff",
              fontWeight: "600",
              marginTop: "10px",
              marginLeft: "10px",
            }}
            onClick={() => {
              cancelarVenta();
            }}
          >
            Continuar
          </Button>

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
