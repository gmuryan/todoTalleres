import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import './App.css';

class PrendaList extends Component {

  constructor(props) {
    super(props);
    this.state = {prendas: [], isLoading: true, nombre: ''};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('api/prendas')
      .then(response => response.json())
      .then(data => this.setState({prendas: data, isLoading: false}))

  }

  async remove(id) {
    await fetch(`/api/prenda/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedPrendas = [...this.state.prendas].filter(i => i.idPrenda !== id);
      this.setState({prendas: updatedPrendas});
    });
  }

        dialog(prenda) {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure to do this?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.remove(prenda.idPrenda)
        },
        {
          label: 'No'
        }
      ]
    })
  };

  filterUpdate = e => {
      this.setState({nombre : e.target.value});
      this.setState({nit : e.target.value})
  }

  render() {
    const {prendas, isLoading, nombre} = this.state;
    const filterPrendas = prendas.filter(prenda => {
        return prenda.nombre.toLowerCase().indexOf( nombre.toLowerCase()) !== -1
    })

    if (isLoading) {
      return <p>Loading...</p>;
      
    }

    const prendaList = filterPrendas.map(prenda => {
    if (prenda.temporada == true){  
      return <tr key={prenda.idPrenda}>
        <td style={{whiteSpace: 'nowrap'}}>{prenda.nombre}</td>
        <td>{prenda.stock}</td>
        <td>{prenda.temporada.toString()}</td>
        <td>{prenda.porcentaje}</td>
        <td>{prenda.estacion}</td>

        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/prendas/" + prenda.idPrenda}>Edit</Button>
            &nbsp;&nbsp;
            <Button size="sm" color="danger" onClick={() => this.dialog(prenda)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
      }else{
        return <tr key={prenda.idPrenda}>
        <td style={{whiteSpace: 'nowrap'}}>{prenda.nombre}</td>
        <td>{prenda.stock}</td>
        <td>{prenda.temporada.toString()}</td>
        <td></td>
        <td>{prenda.estacion}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/prendas/" + prenda.idPrenda}>Edit</Button>
            &nbsp;&nbsp;
            <Button size="sm" color="danger" onClick={() => this.dialog(prenda)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
      }
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/prendas/new">Add Prenda</Button>
          </div>
          <h3>My Prendas</h3>
          <input type="text" onChange={this.filterUpdate} placeholder="Prenda..."></input>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">Nombre</th>
              <th width="20%">Stock</th>
              <th width="20%">Temporada</th>
              <th width="20%">Porcentaje</th>
              <th width="20%">Estacion</th>
              <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {prendaList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default PrendaList