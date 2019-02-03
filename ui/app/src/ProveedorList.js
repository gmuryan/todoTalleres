import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
class ProveedorList extends Component {

  constructor(props) {
    super(props);
    this.state = {proveedores: [], isLoading: true};
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

  render() {
    const {proveedores, isLoading} = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const proveedorList = proveedores.map(prov => {
      return <tr key={prov.idProveedor}>
        <td style={{whiteSpace: 'nowrap'}}>{prov.razonSocial}</td>
        <td>{prov.cuit}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/proveedores/" + prov.idProveedor}>Edit</Button>
            <Button size="sm" color="danger" onClick={() => this.remove(prov.idProveedor)}>Delete</Button>
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
          <input type="text" name="razonSocial" id="razonSocial" placeholder="Razon Social..."></input>
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