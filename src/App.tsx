import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import '../node_modules/bootstrap/dist/js/bootstrap'
import ComponenteMenuNavbar from './menu/ComponenteMenuNavbar';
import ComponenteMenuLateral from './menu/ComponenteMenuLateral';
import { Suspense } from 'react';
import ComponenteListarCliente from './Clientes/ComponenteListarCliente';
import ComponenteListarCategoria from './categoria/ComponenteListarCategoria';
import ComponenteListarUsuario from './usuario/ComponenteListarUsuario';
import ComponenteLogin from './principal/ComponenteLogin';
import ComponenteVenta from './venta/ComponenteVenta';
import ComponenteRedireccionar from './principal/ComponenteRedireccionado';
import ComponenteListarProducto from './producto/ComponenteListarProducto';
import ComponenteListarMarca from './marca/ComponenteListarMarca';
import ComponenteListarEmpleado from './empleado/ComponenteListarEmpleado';
import ComponenteReporteVenta from './venta/ComponenteReporteVenta';
import ComponenteListarProveedor from './proveedor/ComponenteListarProveedor';
import PageListaProductos from './Catalogo/PageListaProductos';
import ComponenteCompra from './compra/ComponenteCompra';
import ComponenteSalida from './compra/ComponenteEntrada';

function App() {

  


  return (
    <Router>
    <div className="text-white" style={{ width: "100%", background: "#F3F6F9", display: "grid", gridTemplateColumns: "1fr auto", height:"100%" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <ComponenteMenuNavbar />
          <div style={{marginLeft:"16%",marginTop:"60px"}}>
            <Suspense fallback={<div style={{fontSize:"20px"}}>Cargando....</div>}>
              <Routes>
                <Route path="/" element={<ComponenteLogin/>}/>
                <Route path="/login" element={<ComponenteLogin/>}/>
                <Route path="/ventas" element={<ComponenteVenta/>}/>
                <Route path="/compras" element={<ComponenteCompra />} />
                <Route path="/clientes" element={<ComponenteListarCliente />} />
                <Route path="/categorias" element={<ComponenteListarCategoria/>} />
                <Route path="/usuarios" element={<ComponenteListarUsuario/>} />
                <Route path="/productos" element={<ComponenteListarProducto/>}/>
                <Route path="/empleados" element={<ComponenteListarEmpleado/>} /> 
                <Route path="/reporteventas" element={<ComponenteReporteVenta/>} />
                <Route path="/marcas" element={<ComponenteListarMarca/>}/>
                <Route path="/proveedores" element={<ComponenteListarProveedor/>}/>
                <Route path="/catalogo" element={<PageListaProductos/>}/>
                <Route path="/entrada" element={<ComponenteSalida/>}/>
              </Routes>
            </Suspense>
          </div>
      </div>
      <ComponenteMenuLateral />
    </div>
  </Router>
  );
}
export default App;