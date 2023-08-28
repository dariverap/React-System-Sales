import React, { Component } from 'react';
import CompProductoResumen from './CompProductoResumen';

class CompListaProductos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filtro: '',
        };
    }

    handleSearchChange = (event) => {
        this.setState({ filtro: event.target.value });
    };

    render() {

        const styleTitle = {
            fontSize: '30px',
            marginLeft: '10px',
            marginTop: '30px',
            backgroundColor:'#ABABAB',
            padding: '5px',
            borderRadius: '10px',
            color: '#fff',
        }
        const style2 = {
            fontSize: 25,
            fontWeight: '600',
            padding:"5px 10px",
            color:"black",
            borderRadius:"5px",
            backgroundColor:"#EEEEEE",
            border:"1px solid white",
            marginTop: '30px',
            marginLeft: '10px',
          };

        const productosFiltrados = this.props.pListaProducto.filter((producto) =>
            producto.nombre.toLowerCase().includes(this.state.filtro.toLowerCase())
        );

        return <div className="col-15">
            <p className="h5 " style={style2}>CATALOGO DE PRODUCTOS</p>
            <div className="row row-cols-1 row-cols-md-4 p-2">
                <div className="input-group mb-3">
                <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar producto"
                            aria-label="Recipient's username"
                            aria-describedby="button-addon2"
                            value={this.state.filtro}
                            onChange={this.handleSearchChange}
                        />
                </div>
                {productosFiltrados.map((lp) => (
                        <CompProductoResumen pDatosDelProducto={lp} key={lp.id} />
                    ))}
            </div>
        </div>

    }
}

export default CompListaProductos;