import React, { Component } from 'react';
import CompListaProductos from './CompListaProductos';


class PageListaProductos extends Component {

  state = {
    apiListaProductos: []
  }
  async componentDidMount() {
    const respuestaGet = await fetch('https://localhost:44318/api-ferreteria/producto/custom');
    const respuestaJson = await respuestaGet.json();
    this.setState({
      apiListaProductos: respuestaJson
    })
  }

  render() {
    return <div>
      <main role="main" className="container" style={{minHeight:"calc(100dvh - 60px)"}}>
        <div className="row">
          <CompListaProductos pListaProducto={this.state.apiListaProductos} />
        </div>
      </main>
    </div>

  }
}

export default PageListaProductos;