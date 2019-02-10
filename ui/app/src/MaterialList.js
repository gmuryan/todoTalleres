import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css


class MaterialList extends Component {

  constructor(props) {
    super(props);
    this.state = {materiales: [], isLoading: true, nombre: '', razonSocial: ''};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('api/materiales')
      .then(response => response.json())
      .then(data => this.setState({materiales: data, isLoading: false}));
  }

  async remove(id) {
    await fetch(`/api/material/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedMateriales = [...this.state.materiales].filter(i => i.idMaterial !== id);
      this.setState({materiales: updatedMateriales});
    });
  }

        dialog(mat) {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure to do this?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.remove(mat.idMaterial)
        },
        {
          label: 'No'
        }
      ]
    })
  };

  filterUpdate = e => {
      this.setState({nombre : e.target.value});
      this.setState({razonSocial: e.target.value});
  }

  render() {
    const {materiales, isLoading, nombre, razonSocial} = this.state;
    const filterMateriales = materiales.filter(mat => {
        return mat.nombre.toLowerCase().indexOf( nombre.toLowerCase()) !== -1
        || mat.proveedor.razonSocial.toLowerCase().indexOf(razonSocial.toLowerCase()) !== -1
    })

    if (isLoading) {
      return <p>Loading...</p>;
      
    }

    const materialList = filterMateriales.map(mat => {
      return <tr key={mat.idMaterial}>
        <td style={{whiteSpace: 'nowrap'}}>{mat.nombre}</td>
        <td>{mat.stock}</td>
        <td>{mat.precio}</td>
        <td>{mat.proveedor.razonSocial}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/materiales/" + mat.idMaterial}>Edit</Button>
            &nbsp;&nbsp;
            <Button size="sm" color="danger" onClick={() => this.dialog(mat)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/materiales/new">Add Material</Button>
          </div>
          <h3>My Materials</h3>
          <input type="text" onChange={this.filterUpdate} placeholder="Nombre..."></input>
          &nbsp;&nbsp;
          <input type="text" onChange={this.filterUpdate} placeholder="Proveedor..."></input>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">Nombre</th>
              <th width="20%">Stock</th>
              <th width="20%">Precio</th>
              <th width="20%">Proveedor</th>
              <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {materialList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default MaterialList;