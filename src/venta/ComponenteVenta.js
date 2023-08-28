import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import * as Yup from "yup";
///
import { PDFDocument, PDFImage, rgb, StandardFonts } from "pdf-lib";
//import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
//import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { DateField } from "@mui/x-date-pickers/DateField";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Button from "@mui/material/Button";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Cookies from "universal-cookie";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/logoYS2.png";

export default function ComponenteVenta() {

  const LETTERS_WITH_SPACES_REGEX = /^[a-zA-Z\s]+$/;

  const [fecha, setFecha] = useState(new Date());
  //función para traer los datos de la API
  const URLC = "https://localhost:44318/api-ferreteria/cliente/custom";
  const URLComprobantes = "https://localhost:44318/api-ferreteria/comprobante";
  const URLp = "https://localhost:44318/api-ferreteria/producto/custom";

  const URLventa = "https://localhost:44318/api-ferreteria/comprobante";
  const [comprobantes, setComprobantes] = useState();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [numComprobante, setNumComprobante] = useState([]);
  const [modalBuscarProductos, setBuscarProductos] = useState(false);
  const [modalBuscarClientes, setBuscarClientes] = useState(false);
  const [productos, setProductos] = useState([]);
  const [cantidad, setCantidad] = useState("");
  //
  const [usersClientes, setUsersClientes] = useState([]);
  const [searchClientes, setSearchClientes] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState({});
  //
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [igv, setIgv] = useState(0);
  //
  const [seleccionarFormaPago, setSeleccionarFormaPago] = useState([]);
  const [seleccionarDocumento, setSeleccionarDocumento] = useState([]);
  const cookies = new Cookies();
  //
  const history = useNavigate();
  //fecha en español
  function obtenerFechaEnEspañol(fecha) {
    const opcionesFecha = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    var fechaObjeto = new Date(fecha);
    return fechaObjeto.toLocaleDateString('es-ES', opcionesFecha);
  }

  //resetear datos

  const resetearDatos= () => {
    setUsers([]);
    setSearch("");
    setProductos([]);
    setCantidad("");
    setUsersClientes([]);
    setSearchClientes("");
    setClienteSeleccionado({});
    setTotal(0);
    setSubTotal(0);
    setIgv(0);

    setInfoPedido(null);
  };
  //pdf

  const generarComprobantePDF = async ({ comprobante, detalles }) => {

    // Crea un nuevo documento PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
  
    // Define la posición de inicio de escritura
    let x = 50;
    let y = page.getHeight() - 70;
  
    // Agrega la información del cliente, DNI y fecha
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontbold = await pdfDoc.embedFont(StandardFonts.HelveticaBold); // Utilizamos la fuente Helvetica en negrita
    const fontSize = 12;
    const fontSizeTitle = 25;

    

    page.drawText(`FERRETERIA YERIAS SAC`, {
      x: x+100,
      y: y+12,
      size: fontSizeTitle,
      color: rgb(1, 0.341, 0.133),
      font: fontbold,
    });
    y -= fontSize + 5;
    page.drawText(`R.U.C : 203548678645`, {
      x: x+190,
      y: y+5,
      size: fontSize,
    });
    y -= fontSize + 5;
    page.drawText(`AV. Los ecologos 123`, {
      x: x+ 190,
      y: y+5,
      size: fontSize,
    });
    y -= fontSize + 5;
    page.drawText(`Telefono: 796513152`, {
      x: x+ 190,
      y: y+5,
      size: fontSize,
    });
    y -= fontSizeTitle + 6;
    page.drawText(`Cliente: ${clienteSeleccionado.nombre} `, {
      x: x,
      y: y,
      size: fontSize,
      font: fontbold,
    });
    y -= fontSize + 6;
    page.drawText(`Numero de Documento: ${clienteSeleccionado.numdocumento}`, {
      x: x,
      y: y,
      size: fontSize,
      font: fontbold,
    });
    y -= fontSize + 6;
    page.drawText(`Fecha: ${obtenerFechaEnEspañol(comprobante.fecha)}`, {
      x: x,
      y: y,
      size: fontSize,
      font: fontbold,
    });
    y -= fontSize + 6;
    page.drawText(`Tipo de pago: ${seleccionarFormaPago.value}`, {
      x: x,
      y: y,
      size: fontSize,
      font: fontbold,
    });
    y -= fontSize + 6;
    page.drawText(`Tipo de Comprobante: ${seleccionarDocumento.value}`, {
      x: x,
      y: y,
      size: fontSize,
      font: fontbold,
    });
    // Agrega el cuadro de detalles de productos
    const tableWidth = 500;
    const tableHeight = detalles.length * (fontSize + 5) + 40;
    const tableX = x;
    const tableY = y - tableHeight - 30;
  
    page.drawRectangle({
      x: tableX,
      y: tableY,
      width: tableWidth,
      height: tableHeight,
      color: rgb(0.961, 0.961, 0.961),
      borderWidth: 1,
      borderColor: rgb(1, 0.341, 0.133),
      borderDashArray: [5, 3],
    });
  
    // Encabezado de la tabla
    page.drawText("Nombre", { x: tableX + 20, y: tableY + tableHeight - 20, size: fontSize,font: fontbold });
    page.drawText("Cantidad", { x: tableX + 290, y: tableY + tableHeight - 20, size: fontSize, font: fontbold });
    page.drawText("Precio", { x: tableX + 390, y: tableY + tableHeight - 20, size: fontSize, font: fontbold });
    page.drawText("Importe", { x: tableX + 450, y: tableY + tableHeight - 20, size: fontSize, font: fontbold });
  
    // Agrega los detalles de cada producto en la tabla
    productos.forEach((detalle, index) => {
      page.drawText(detalle.nombre, {
        x: tableX + 20,
        y: tableY + tableHeight - 40 - (index * (fontSize + 2)),
        size: fontSize, 
      });
      page.drawText(detalle.cantidad.toString(), {
        x: tableX + 300,
        y: tableY + tableHeight - 40 - (index * (fontSize + 2)),
        size: fontSize, 
      });
      page.drawText(detalle.precioVenta.toString(), {
        x: tableX + 400,
        y: tableY + tableHeight - 40 - (index * (fontSize + 2)),
        size: fontSize, 
      });
      page.drawText(detalle.importe.toString(), {
        x: tableX + 475,
        y: tableY + tableHeight - 40 - (index * (fontSize + 2)),
        size: fontSize, 
      });
    });
  
    

    //dibujar un rectangulo para el colocar el total
    page.drawRectangle({
      x: tableX + 350,
      y: tableY - 60,
      width: 150,
      height: 50,
      color: rgb(0.961, 0.961, 0.961),
      borderWidth: 1,
      borderColor: rgb(1, 0.341, 0.133),
      borderDashArray: [5, 3],
    });

    // Agrega el total al final de la tabla
    page.drawText(`Total: S/.${comprobante.total} `, {
      x: tableX + 365,
      y: tableY - 40,
      size: fontSize + 6,
      color: rgb(0, 0, 0),
      font: fontbold,
    });
  
    // Guarda el contenido del PDF en un archivo
    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);
  
    // Abre el PDF en una nueva ventana o pestaña
    window.open(pdfUrl, "_blank");
  };
  const [infoPedido, setInfoPedido] = useState();


  //METODO PARA REGISTRAR CLIENTES
  async function RegistrarCliente(cliente) {
    if (cliente.nombre == "" || cliente.nombre == undefined) {
      Swal.fire("Error", "Ingrese un cliente", "error");
    }
    try {
      const response = await axios.post(
        "https://localhost:44318/api-ferreteria/cliente",
        cliente
      );
      Swal.fire("Cliente", "Registrado con éxito", "success");
      // Guardar la respuesta en la variable clienteSeleccionado
      setClienteSeleccionado(response.data);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Si la respuesta contiene un mensaje de error desde el backend, lo mostramos en un alert o en cualquier otro componente de tu aplicación
        Swal.fire("Error1", error.response.data.message, "error");
      } else if (error.message) {
        // Si hay un mensaje de error en el objeto 'error', lo mostramos en un alert
        Swal.fire("Error2", error.message, "error");
      } else {
        // Si no hay un mensaje de error específico, mostramos un mensaje genérico
        Swal.fire(
          "Error3",
          "Ocurrió un error al registrar el cliente",
          "error"
        );
      }
      console.error(error);
    }
  }

  //obtener forma de pago y tipo de comproabnte
  const obtenerFormapago = (e) => {
    const { value } = e.target;
    setSeleccionarFormaPago({ value });
  };
  const obtenerDocumento = (e) => {
    const { value } = e.target;
    setSeleccionarDocumento({ value });
  };

  //METODOS PARA BUSCAR CLIENTES
  const showDataClientes = async () => {
    const response = await fetch(URLC);
    const data = await response.json();
    //console.log(data)
    setUsersClientes(data);
  };
  //función de búsqueda
  const searcherClientes = (e) => {
    setSearchClientes(e.target.value);
  };

  //metodo de filtrado 2
  const resultsClientes = !searchClientes
    ? usersClientes
    : usersClientes.filter((dato) =>
        dato.nombre.toLowerCase().includes(searchClientes.toLocaleLowerCase())
      );

  //METODO PARA SELECIONAR AL CLIENTES
  const seleccionarCliente = (gestor) => {
    setClienteSeleccionado(gestor);

    abrirCerrarmodalBuscarClientes();
  };

  // METODOS PARA BUSCAR PRODUCTOS

  const seleccionarProducto = (productoSeleccionado) => {
    if (productoSeleccionado.stock < cantidad || cantidad <= 0) {
      Swal.fire(
        "Opps!",
        "No existe stock suficiente O no registro una cantidad correcta",
        "",
        "error"
      );
      return;
    }
    var f = 0;
    productos.forEach((p) => {
      if (productoSeleccionado.id == p.id) {
        f = 0 + 1;
      }
    });

    if (f > 0) {
      Swal.fire(
        "Opps!",
        "Ya existe este producto",
        "O no registro una cantidad",
        "error"
      );
      f = 0;
      return;
    }

    let producto = {
      cantidad: parseInt(cantidad),
      precioVenta: productoSeleccionado.precioVenta,
      precioCompra: productoSeleccionado.precioCompra,
      importe: productoSeleccionado.precioVenta * parseInt(cantidad),
      estado: true,
      id: productoSeleccionado.id,
      nombre: productoSeleccionado.nombre,
      descripcion: productoSeleccionado.descripcion,
      stock: productoSeleccionado.stock,
      imagen: productoSeleccionado.imagen,
      proveedorId: productoSeleccionado.proveedorId,
      categoriaId: productoSeleccionado.categoriaId,
      marcaId: productoSeleccionado.marcaId,
    };
    let arrayProductos = [];
    arrayProductos.push(...productos);
    arrayProductos.push(producto);

    setProductos((anterior) => [...anterior, producto]);
    calcularTotal(arrayProductos);
    abrirCerrarmodalBuscarProductos();
  };

  const actualizarCantidadProducto = (index, cantidad) => {
    setProductos((prevProductos) => {
      const nuevosProductos = prevProductos.map((producto, i) =>
        i === index
          ? {
              ...producto,
              cantidad: cantidad,
              importe: producto.precioVenta * cantidad,
            }
          : producto
      );
      calcularTotal(nuevosProductos); // Calcular el total con los productos actualizados
      return nuevosProductos;
    });
  };

  const handleChangeCantidad = (e, index) => {
    const cantidad = parseInt(e.target.value);
    actualizarCantidadProducto(index, cantidad);
  };

  const calcularTotal = (arrayProductos) => {
    let t = 0;
    let st = 0;
    let imp = 0;

    if (arrayProductos.length > 0) {
      t = arrayProductos.reduce(
        (total, producto) => total + producto.importe,
        0
      );
      st = t / 1.18;
      imp = t - st;
    }

    setSubTotal(st.toFixed(2));
    setIgv(imp.toFixed(2));
    setTotal(t.toFixed(2));
  };

  const eliminarProducto = (id) => {
    let listaproductos = productos.filter((p) => p.id !== id);
    setProductos(listaproductos);
    calcularTotal(listaproductos);
  };
  //función para traer los datos de la API para productos
  const showData = async () => {
    const response = await fetch(URLp);
    const data = await response.json();
    //console.log(data)
    setUsers(data);
  };
  //función de búsqueda  para productos
  const searcher = (e) => {
    setSearch(e.target.value);
  };
  //  metodos para cerrar y abrir los formularios modales
  const abrirCerrarmodalBuscarProductos = () => {
    showData();
    setBuscarProductos(!modalBuscarProductos);
    
  };
  const abrirCerrarmodalBuscarClientes = () => {
    showDataClientes();
    setBuscarClientes(!modalBuscarClientes);
    
  };

  //metodo de busqueda de productos
  const results = !search
    ? users
    : users.filter((dato) =>
        dato.nombre.toLowerCase().includes(search.toLocaleLowerCase())
      );






  //METODO PARA GUARDAR LA VENTA
  async function registrarVenta() {
    if (clienteSeleccionado.id == null) {
      Swal.fire("Opps!", "Selecciona un cliente", "error");
      return;
    }

    if (productos.length < 1) {
      Swal.fire("Opps!", "No existen productos", "error");
      return;
    }

    if (
      seleccionarFormaPago.value == null ||
      seleccionarFormaPago.value == "Forma de Pago"
    ) {
      Swal.fire("Opps!", "Selecciona una Forma de Pago", "error");
      return;
    }

    if (
      seleccionarDocumento.value == null ||
      seleccionarDocumento.value == "Tipo de Comprobante"
    ) {
      Swal.fire("Opps!", "Selecciona un Comprobante", "error");
      return;
    }

        // Crea un array para almacenar los detalles
        let detalles = [];

        // Agrega los detalles de cada producto
        productos.forEach((p) => {
            let detalle = {
                cantidad: p.cantidad,
                precio: p.precioVenta,
                importe: p.importe,
                estado: true,
                productoId: p.id,
            };

            detalles.push(detalle);
        });


        let comprobante = {
          fecha: fecha,
          igv: igv,
          subtotal: subTotal,
          total: total,
          estado: true,
          ClienteId: clienteSeleccionado.id,
          UsuarioId: cookies.get("id"),
          FormaPago: seleccionarFormaPago.value,
          Documento: seleccionarDocumento.value,
          detalle: detalles
        };

        // Actualiza el estado de infoPedido con el comprobante y detalles
        setInfoPedido({
            comprobante: comprobante,
            detalles: detalles,
        });

        try {
            await axios.post(URLventa, comprobante);
            Swal.fire(
                "Venta Registrada!",
                "Exito al registrar la venta " ,
                "success"
            );
            // Genera el comprobante en PDF
            generarComprobantePDF({ comprobante, detalles });
            console.log(comprobante);
            resetearDatos();

        } catch (error) {
            Swal.fire("Opps!", "No se pudo crear la venta", "error");
            console.log("No se pudo enviar la venta ", error);
            console.log(comprobante)
            return;
        }

        
    }

  const initialValues = {
    nombre: clienteSeleccionado.nombre || "",
    numdocumento: clienteSeleccionado.numdocumento || "",
    estado: true,
  };
  //funciones para la TABLE PARA LOS PRODUCTOS

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#FFD8E4",
      color: "#31111D",
      textAlign: "left",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 15,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
    height: "5px",
  }));

  useEffect(() => {
    if (!cookies.get('id')) {
      history("/login");
    }
  }, []);

  //FORMULARIOS
  return (
    <div
      style={{
        overflow: "hidden",
        height: "calc(100vh - 65px)",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex" }}>
        {/* Columna izquierda */}
        <div style={{ flex: "0 0 40%", marginRight: "5px" }}>
          {/* CARD BUSCAR/REGISTRAR CLIENTES */}
          <Card elevation={0} style={{boxShadow: "0px 13px 0px -9px rgba(0,0,0,0.1)",minHeight:"330px"}}>
            <CardHeader
              sx={{
                padding: "10px",
                background: "#ebebeb",
                color: "#333333",
                textAlign: "center",
                borderRadius: "5px",
                border:"1px solid #E0E0E0",
                margin:"5px"
              }}
              title="Cliente"
            ></CardHeader>
            <CardContent sx={{ padding: "20px" }}>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              onSubmit={async (valores) => {
                // Validar si los campos están completos
                if (!valores.nombre || !valores.numdocumento) {
                  Swal.fire("Error", "Por favor, complete todos los campos", "error");
                  return;
                }
                await new Promise((r) => setTimeout(r, 1));
                var est = valores.estado ? true : false;
                await RegistrarCliente({
                  nombre: valores.nombre,
                  numdocumento: valores.numdocumento,
                  estado: est,
                });
              }}
              validationSchema={Yup.object({
                nombre: Yup.string().required("Este campo es requerido..."),
                numdocumento: Yup.number().required("Este campo es requerido..."),
              })}
                          >
                {(formik) => (
                  <Form
                    className="form-control text-white"
                    style={{
                      background: "",
                      border: "none",
                      width: "100%",
                      minWidth: "50%",
                    }}
                  >
                    <div className="row">
                      <div className="col" style={{ padding: "0px" }}>
                        <Box
                          component="form"
                          sx={{
                            "& > :not(style)": {
                              width: "25ch",
                              display: "flex",
                              flexDirection: "column",
                            },
                          }}
                          noValidate
                          autoComplete="off"
                        >
                          <div style={{ width: "100%", gap: "12px" }}>
                            <TextField
                              id="outlined-basic"
                              label="Nombre Completo / Razon"
                              variant="outlined"
                              style={{ width: "100%" }}
                              name="nombre" // Agrega el atributo 'name' para que Formik pueda manejar este campo
                              value={formik.values.nombre}
                              onChange={formik.handleChange}
                              error={formik.touched.nombre && Boolean(formik.errors.nombre)}
                              helperText={formik.touched.nombre && formik.errors.nombre}
                              onKeyDown={(event) => {
                                if (!LETTERS_WITH_SPACES_REGEX .test(event.key)) {
                                  event.preventDefault();
                                }
                              }}
                            />

                            <TextField
                              id="outlined-basic"
                              label="DNI/RUC"
                              name="numdocumento"
                              variant="outlined"
                              style={{ width: "100%" }}
                              value={formik.values.numdocumento}
                              onChange={formik.handleChange}
                              error={formik.touched.numdocumento && Boolean(formik.errors.numdocumento)}
                              helperText={formik.touched.numdocumento && formik.errors.numdocumento}
                              type="number"
                            />
                          </div>
                        </Box>
                      </div>
                      <div style={{ padding: "0px", marginTop: "10px" }}>
                        <div style={{ width: "100%" }}>
                          <Button
                            variant="contained"
                            type="submit"
                            style={{
                              marginRight: "10px",
                              background: "#FF6600",
                              color: "#ffffff",
                            }}
                          >
                            Registrar
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={abrirCerrarmodalBuscarClientes}
                            className="btn btn-success"
                            style={{
                              backgroundColor: "#984061",
                              color: "#ffffff",
                            }}
                          >
                            Buscar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </div>


        {/* Columna derecha */}
        {/* CARD DETALLE DE VENTA */}
        <div style={{ flex: "0 0 60%" }}>
          <Card elevation={0} style={{boxShadow: " 0px 13px 0px -9px rgba(0,0,0,0.1)"}}>
            <CardHeader
              sx={{
                padding: "10px",
                background: "#ebebeb",
                color: "#333333",
                textAlign: "center",
                borderRadius: "5px",
                border:"1px solid #E0E0E0",
                margin:"5px"
              }}
              mb={0}
              title="Venta"
            ></CardHeader>
            <CardContent style={{ padding: "20px" }}>
              <div style={{display:"flex",gap:"20px"}}>
                <div style={{display:"flex",flexDirection:"column",width:"50%",gap:"5px",backgroundColor:"#FCFCFC",padding:"15px",borderRadius:"5px"}}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateField", "DateField"]}>
                      <DateField
                        format="DD/MM/YYYY"
                        label="Fecha"
                        color="success"
                        sx={{ m: 0.2, width: "25ch" }}
                        size="small"
                        defaultValue={dayjs(fecha)}
                        onChange={(date) => setFecha(date)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  <TextField
                    disabled
                    size="small"
                    id="outlined-start-adornment"
                    sx={{ m: 0.2, width: "25ch" }}
                    value={subTotal}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          SubTotal: S/.{" "}
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    disabled
                    size="small"
                    id="outlined-start-adornment"
                    sx={{ m: 0.2, width: "25ch" }}
                    value={igv}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          IGV: S/.{" "}
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    disabled
                    size="small"
                    id="outlined-start-adornment"
                    sx={{ m: 0.2, width: "25ch" }}
                    value={total}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          Total: S/.{" "}
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                <div style={{display:"flex",flexDirection:"column", gap:"10px",width:"50%",backgroundColor:"#FCFCFC",padding:"10px",borderRadius:"5px",paddingTop:"23px"}}>
                  <FormControl sx={{ minWidth: 200, width: "100%" }}>
                    <InputLabel id="demo-simple-select-label">
                      Forma de Pago
                    </InputLabel>
                    <Select
                      
                      labelId="demo-simple-select-error-label"
                      id="demo-simple-select-error"
                      onChange={obtenerFormapago}
                      label="Forma de Pago"
                      style={{ width: "100%" }}
                      renderValue={(value) => `⚠️   ${value}`}
                    >
                      <MenuItem value="Yape">Yape</MenuItem>
                      <MenuItem value="Efectivo">Efectivo</MenuItem>
                      <MenuItem value="Transferencia">Transferencia</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 200, width: "100%" }}>
                    <InputLabel id="demo-simple-select-label">
                      Comprobante
                    </InputLabel>
                    <Select
                      
                      labelId="demo-simple-select-error-label"
                      id="demo-simple-select-error"
                      onChange={obtenerDocumento}
                      style={{ width: "100%" }}
                      label="Comprobante"
                      renderValue={(value) => `⚠️   ${value}`}
                    >
                      <MenuItem value="Boleta">Boleta</MenuItem>
                      <MenuItem value="Factura">Factura</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={registrarVenta}
                      className="btn btn-success"
                      style={{ backgroundColor: "#FF6600", color: "#ffffff" }}
                    >
                      Registrar Venta
                    </Button>
                  </FormControl>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


      {/* CARD BUSCAR PRODUCTOS */}
      <div style={{ marginTop: "10px", flex: "0 0 100%" }}>
        <Card elevation={0} style={{boxShadow: "0px 13px 0px -9px rgba(0,0,0,0.1)"}}>
          <CardHeader
              sx={{
                padding: "10px",
                background: "#ebebeb",
                color: "#333333",
                textAlign: "center",
                borderRadius: "5px",
                border:"1px solid #E0E0E0",
                margin:"5px",
              }}
              mb={0.1}
              title="Productos"
          ></CardHeader>
          <CardContent sx={{ padding: "0px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={abrirCerrarmodalBuscarProductos}
              className="btn btn-success"
              style={{
                marginBottom: "10px",
                margin: "10px",
                backgroundColor: "#FF5722",
                color: "#ffffff",
              }}
            >
              Buscar Producto
            </Button>

            <TableContainer sx={{ padding: "10px" }}>
              <Table
                className="MuiTable-root"
                size="small"
                padding="checkbox"
                aria-label="a dense table"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell style={{backgroundColor:"#fff3b0"}}>Nombre </StyledTableCell>
                    <StyledTableCell align="left" style={{backgroundColor:"#fff3b0"}}>Descripcion</StyledTableCell>
                    <StyledTableCell style={{backgroundColor:"#fff3b0"}} align="left">Precio</StyledTableCell>
                    <StyledTableCell style={{backgroundColor:"#fff3b0"}} align="left">Stock</StyledTableCell>
                    <StyledTableCell style={{backgroundColor:"#fff3b0"}} align="left">Cantidad</StyledTableCell>
                    <StyledTableCell style={{backgroundColor:"#fff3b0"}} align="left">Importe</StyledTableCell>
                    <StyledTableCell style={{backgroundColor:"#fff3b0"}} align="left">Accion</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productos.map((item, index) => (
                    <StyledTableRow key={item.id}>
                      <StyledTableCell component="th" scope="row">
                        {item.nombre}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {item.descripcion}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {item.precioVenta}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {item.stock}
                      </StyledTableCell>

                      <StyledTableCell align="left">
                        <Box
                          component="form"
                          sx={{
                            "& .MuiTextField-root": { m: 0.1, width: "5ch" },
                          }}
                          noValidate
                          autoComplete="off"
                        >

                          <TextField
                              inputProps={{ 
                                min: '1', 
                                max: `${item.stock}`
                              }}
                            size="small"
                            id="input-with-sx"
                            variant="standard"
                            type="number"
                            value={item.cantidad}
                            onChange={(e) => handleChangeCantidad(e, index)}
                          />

                        </Box>
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {item.importe}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {" "}
                        <Button
                          variant="contained"
                          color="error"
                          style={{ width: "100%" }}
                          className="btn btn-danger detail-button"
                          onClick={() => eliminarProducto(item.id)}
                        >
                          Eliminar
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </div>




      {/* //MODAL BUSCAR PRODUCTOS */}
      <Modal isOpen={modalBuscarProductos} style={{minWidth:"50%"}}>
        <ModalHeader
          style={{ background: "#ff8a50", color: "white", borderBottom: "0px" }}
        >
          Buscar Producto
        </ModalHeader>
        <ModalBody className="bg-white">
          <div className="mt-2" style={{ overflow: "hidden" }}>
            <input
              style={{ border: "3px solid #1977d3",margin:"" }}
              value={search}
              onChange={searcher}
              type="text"
              placeholder="Buscar producto..."
              className="form-control"
            />
          </div>
          <div className="table-responsive">
            <div style={{ marginTop: "20px" }}>
              <label
                style={{
                  position: "relative",
                  fontSize: "14px",
                  color: "black",
                }}
              >
                Cantidad:
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  className="form-control"
                  min="0"
                  type="number"
                  onChange={(event) => setCantidad(event.target.value)}
                  value={cantidad}
                  style={{ border: "3px solid #1977d3", maxWidth: "160px", margin:"3px" }}
                ></input>
                <Button
                  style={{ padding: "5px 30px" }}
                  variant="contained"
                  color="error"
                  className="btn btn-danger"
                  onClick={() => abrirCerrarmodalBuscarProductos()}
                >
                  Cancelar
                </Button>
              </div>
            </div>
            <table
              className="table table-sm table-bordered text-white"
              style={{
                marginTop: "20px",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripcion</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody
                style={{
                  border: "3px solid #5A5A5A",
                  backgroundColor: "#252525",
                }}
              >
                {results.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.nombre}</td>
                    <td>{item.descripcion}</td>
                    <td>{item.precioVenta}</td>
                    <td>{item.stock}</td>
                    <td>
                      <Button
                        variant="contained"
                        color="success"
                        className="btn btn-success detail-button"
                        onClick={() => seleccionarProducto(item)}
                      >
                        Elegir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ModalBody>
        <ModalFooter
          className="bg-white justify-content-center"
          style={{ borderTop: "0px" }}
        ></ModalFooter>
      </Modal>

      {/* //MODAL BUSCAR CLIENTES */}
      <Modal isOpen={modalBuscarClientes} style={{minWidth:"50%"}}>
        <ModalHeader
          style={{
            background: "#ff8a50",
            color: "white",
            borderBottom: "none",
          }}
        >
          Lista de Clientes
        </ModalHeader>
        <ModalBody className="bg-white">
          <div className="mt-2" style={{ overflow: "hidden" }}>
            <div style={{display:"flex",gap:"10px"}}>
              <input
                value={searchClientes}
                onChange={searcherClientes}
                type="text"
                placeholder="Buscar..."
                className="form-control"
                style={{ border: "3px solid #1977d3" }}
              />
              <Button
              variant="contained"
              color="error"
              className="btn btn-danger"
              onClick={() => abrirCerrarmodalBuscarClientes()}
              style={{ width: "50%" }}
              >
                Cancelar
              </Button>
            </div>
            <table
              className="table table-sm table-bordered text-white"
              style={{ marginTop: "15px", width: "100%" }}
            >
              <thead>
                <tr>
                  <th>Nombre</th>
                  
                  <th>N° Documento</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {resultsClientes.map((user) => (
                  <tr key={user.id}>
                    <td>{user.nombre}</td>
                    
                    <td>{user.numdocumento}</td>
                    <td>
                      <Button
                        variant="contained"
                        color="success"
                        style={{ width: "100%" }}
                        className="btn btn-success detail-button"
                        onClick={() => seleccionarCliente(user)}
                      >
                        Elegir
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ModalBody>
        <ModalFooter className="bg-white justify-content-center">
          
        </ModalFooter>
      </Modal>
    </div>
  );
}
