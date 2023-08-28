import React, { useState, useEffect } from 'react'

const SearchComponent = () => {

  //setear los hooks useState
  const [usersClientes, setUsersClientes] = useState([])
  const [searchClientes, setSearchClientes] = useState("")

  //función para traer los datos de la API
  const URLC = 'https://localhost:44318/api-ferreteria/cliente/custom'

  const showDataClientes = async () => {
    const response = await fetch(URLC)
    const data = await response.json()
    //console.log(data)
    setUsersClientes(data)
  }
  //función de búsqueda
  const searcherClientes = (e) => {
    setSearchClientes(e.target.value)
  }

  //metodo de filtrado 2   
  const resultsClientes = !searchClientes ? usersClientes : usersClientes.filter((dato) => dato.nombre.toLowerCase().includes(searchClientes.toLocaleLowerCase()))

  useEffect(() => {
    showDataClientes()
  }, [])

  //renderizamos la vista
  return (
    <div className="w-250 mt-3" style={{ overflow: "hidden" }}>
      <input value={searchClientes} onChange={searcherClientes} type="text" placeholder='Search' className='form-control' />
      <table className='table table-sm table-bordered'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {resultsClientes.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nombre}</td>
              <td>{user.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default SearchComponent