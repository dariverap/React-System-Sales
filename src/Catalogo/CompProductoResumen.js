import React, { Component } from 'react';
import  logo  from '../assets/img/bg-login2.jpg'

class CompProductoResumen extends Component {
    render() {
        var url = "img/"+this.props.pDatosDelProducto.url;
        var urlProducto = "producto/" + this.props.pDatosDelProducto.id;
        return <div className="col mb-4">
            <div className="card h-100 product-card">
                <a>
                    <img src={url} className="card-img-top" alt=''/>
                </a>
                <div className="card-body">
                    <a className="text-primary">
                        <h5 className="card-title">{this.props.pDatosDelProducto.nombre}</h5>
                    </a>
                    <p className="card-text">{this.props.pDatosDelProducto.descripcion}</p>
                    <p className="text-success">Precio: S/ {this.props.pDatosDelProducto.precioVenta}</p>
                    <p className="text-danger">Stock: {this.props.pDatosDelProducto.stock}</p>
                </div>
            </div>
        </div>
    }
}

export default CompProductoResumen;