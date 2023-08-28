import Swal from 'sweetalert2'
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
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
    padding: "5px 10px",
    color: "black",
    marginBottom: "20px",
    borderRadius: "5px",
    backgroundColor: "#EEEEEE",
    border: "3px solid white",
};

const style3 = {
    fontSize: 25,
    fontWeight: '500',
    color: "black",
    marginBottom: "5px",
    borderBottom: "1px solid #EEEEEE",

};

export default function ComponenteSalida() {
    const cookies = new Cookies();
    const history = useNavigate();
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [fechaFinal, setFechaFinal] = useState(new Date());
    const urlCompra = "https://localhost:44318/api-ferreteria/ordencompra/"
    const [compras, setCompras] = useState([]);
    const [tTotal, setTTotal] = useState(0); 
    const [tSubtotal, setTSubtotal] = useState(0); 
    const [tIGV, setTIGV] = useState(0);
    const [numeroCompra, setNumeroCompra] = useState(0); 
    const [compraSeleccionada, setCompraSeleccionada] = useState({
        listaCompra: [],
        listaDetalleCompra: []
    })


    const [modalComprobante, setModalComprobante] = useState(false);

    const peticionGet = () => {
        axios.get(urlCompra + "personalizado").then(response => {
            // Asignar las ventas obtenidas a la variable de estado
            setCompras(response.data.compras);

            // Asignar los totales a las variables de estado correspondientes
            setTTotal(response.data.totalSum);
            setTSubtotal(response.data.subtotalSum);
            setTIGV(response.data.igvSum);

            console.log(response.data.compras);
        }).catch(error => {
            console.log(error.message);
        });
    };

    const obtenerCompra = (n) => {
        axios.get(`${urlCompra}${n}`).then(response => {
            // Asignar las ventas obtenidas a la variable de estado
            setCompraSeleccionada({
                listaCompra: response.data.listaCompra,
                listaDetalleCompra: response.data.listaDetalleCompra
            });
        }).catch(error => {
            console.log(error.message);
        });
    };

    const peticionBuscar = () => {
        const fechaInicioFormatted = dayjs(fechaInicio).format('YYYY-MM-DD');
        const fechaFinalFormatted = dayjs(fechaFinal).format('YYYY-MM-DD');
        axios.get(`${urlCompra}buscar/${fechaInicioFormatted}/${fechaFinalFormatted}`).then(response => {

            // Asignar las ventas obtenidas a la variable de estado
            setCompras(response.data.compras);
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

    const cerrarModalInsertar = () => {
        setModalComprobante(false);

    };

    const seleccionarCompra = async (num) => {
        abrirModalInsertar();
        setNumeroCompra(num);
        obtenerCompra(num);

    }



    const registrarIngreso = async (num) => {
        try {
            await axios.post(urlCompra + "ingreso/"+num);
            Swal.fire("Ingreso", "De productos exitoso", "success");
            cerrarModalInsertar();
            peticionGet();
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
                <Box sx={style2}>Ordenes de Compra</Box>
            </Typography>



            <div style={{ display: "flex", gap: "20px", flexDirection: "column", overflow: "hidden", width: "100%" }}>
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
                    {/*
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
                    />*/}
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
                        rows={compras}
                        columns={[
                            {
                                field: "numero",
                                headerName: "Numero",
                                width: 80,
                                disableColumnMenu: true,
                            },
                            {
                                field: "fechaCompra",
                                type: "dateTime",
                                valueGetter: ({ value }) => value && new Date(value),
                                headerName: "Fecha",
                                width: 150,
                                disableColumnMenu: true,
                                valueFormatter: ({ value }) =>
                                    new Date(value).toLocaleDateString("es-ES"), // Formateamos la fecha usando toLocaleDateString
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
                                field: "proveedorRazon",
                                headerName: "Proveedor",
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
                                width: 250,
                                renderCell: (params) => (
                                    <Stack spacing={2}>
                                        {params.row.estado ? ( // Si el estado es true (venta no anulada)
                                            <Button
                                                style={{
                                                    fontWeight: 750,
                                                    backgroundColor: "#2ECC71",
                                                    color: "#ffffff",
                                                    border: "#B81414",

                                                }}
                                                variant="outlined"

                                            >
                                                Compra Ingresada
                                                <DeleteForeverIcon style={{ color: "black" }} />
                                            </Button>
                                        ) : (
                                            // Si el estado es false (venta anulada)
                                            <Button
                                                style={{
                                                    fontWeight: 750,
                                                    backgroundColor: "#E74C3C",
                                                    color: "#ffffff",
                                                    border: "#B81414",
                                                }}
                                                variant="outlined"
                                                onClick={() => {
                                                    seleccionarCompra(params.row.numero);
                                                }}
                                            >
                                                Ingresar Compra
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
                            }, "& .MuiPaginationItem-root": {
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
            <Modal isOpen={modalComprobante} style={{minWidth:"40%"}}>
                <ModalHeader
                    style={{
                        background: "#ff8a50",
                        color: "white",
                        borderBottom: "none",
                    }}
                >
                    Registrar Entrada de Productos
                </ModalHeader>
                <ModalBody className="bg-white">
                    <div className="mt-2" style={{ overflow: "hidden" }}>
                        <div style={{ display: "flex", gap: "10px" }}>
                        {compraSeleccionada.listaCompra.map((compra, index) => (
                                <div style={{display:"flex",gap:"15px",margin:"5px"}}>
                                    <TextField
                                        id="outlined-basic"
                                        label="Número"
                                        variant="outlined"
                                        value={compra.numero}
                                    />
                                    <TextField
                                        id="outlined-basic"
                                        label="IGV"
                                        variant="outlined"
                                        value={compra.igv}
                                    />
                                    <TextField
                                        id="outlined-basic"
                                        label="Subtotal"
                                        variant="outlined"
                                        value={compra.subtotal}
                                    />
                                    <TextField
                                        id="outlined-basic"
                                        label="Total"
                                        variant="outlined"
                                        value={compra.total}
                                    />
                                    <TextField
                                    style={{gap:"455px",width:"100%"}}
                                        id="outlined-basic"
                                        label="Proveedor"
                                        variant="outlined"
                                        value={compra.proveedorRazon}
                                    />
                                </div>
                            ))}

                        </div>
                        <table className="table table-sm table-bordered text-white" style={{ marginTop: "15px", width: "100%" }}>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Compra</th>
                                    <th>Importe</th>
                                </tr>
                            </thead>
                            <tbody>
                            {compraSeleccionada.listaDetalleCompra && compraSeleccionada.listaDetalleCompra.map((detalle) => (
                                    <tr key={detalle.id}>
                                        <td>{detalle.nombreProducto}</td>
                                        <td>{detalle.cantidad}</td>
                                        <td>{detalle.precioCompra}</td>
                                        <td>{detalle.importe}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </ModalBody>
                <ModalFooter className="bg-white justify-content-center">
                <Button
                        variant="contained"
                        color="success"
                        className="btn btn-success"
                        onClick={() => {
                            registrarIngreso(numeroCompra);
                        }}
                        style={{ width: "50%" }}
                    >
                        Confirmar Ingreso
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        className="btn btn-danger"
                        onClick={cerrarModalInsertar}
                        style={{ width: "50%" }}
                    >
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
