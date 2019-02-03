import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css


class ProveedorList extends Component {

  constructor(props) {
    super(props);
    this.state = {proveedores: [], isLoading: true, nombre: '', nit: ''};
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

    fetch('api/proveedores')
      .then(response => response.json())
      .then(data => this.setState({proveedores: data, isLoading: false}));
  }

  async remove(id) {
    await fetch(`/api/proveedor/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedProveedores = [...this.state.proveedores].filter(i => i.idProveedor !== id);
      this.setState({proveedores: updatedProveedores});
    });
  }

        dialog(prov) {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure to do this?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.remove(prov.idProveedor)
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
    const {proveedores, isLoading, nombre, nit} = this.state;
    const filterProveedores = proveedores.filter(prov => {
        return prov.razonSocial.toLowerCase().indexOf( nombre.toLowerCase()) !== -1
        || prov.cuit.indexOf(nit) !== -1
    })

    if (isLoading) {
      return <p>Loading...</p>;
      
    }

    const proveedorList = filterProveedores.map(prov => {
      return <tr key={prov.idProveedor}>
        <td style={{whiteSpace: 'nowrap'}}>{prov.razonSocial}</td>
        <td>{prov.cuit}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/proveedores/" + prov.idProveedor}>Edit</Button>
            &nbsp;&nbsp;
            <Button size="sm" color="danger" onClick={() => this.dialog(prov)}>Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/proveedores/new">Add Supplier</Button>
          </div>
          <h3>My Suppliers</h3>
          <input type="text" onChange={this.filterUpdate} placeholder="Razon Social..."></input>
          &nbsp;&nbsp;
          <input type="text" onChange={this.filterUpdate} placeholder="Cuit..."></input>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">Razon Social</th>
              <th width="20%">Cuit</th>
              <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {proveedorList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default ProveedorList;