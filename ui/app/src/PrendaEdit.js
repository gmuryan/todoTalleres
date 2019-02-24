import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import { ButtonGroup, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import './App.css';

class PrendaEdit extends Component {

  emptyItem = {
    nombre: '',
    estacion: '',
    porcentaje: '',
    stock: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      temporada: false,
      detalles: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      const prenda = await (await fetch(`/api/prenda/${this.props.match.params.id}`)).json();
      const dets = await (await fetch(`/api/detallesPrenda/${this.props.match.params.id}`)).json();
      this.setState({item: prenda, temporada: prenda.temporada, detalles: dets});
    }
  }

  handleChange(event) {
    console.log(event.target.value)
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});
    if (name=='temporada')
        this.setState({
             temporada: !this.state.temporada
         })
  }

  toggle = () =>{
      this.setState({
          temporada: !this.state.temporada
      })
  }

    dialog(detalle) {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure to do this?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.remove(detalle.idDetallePrenda)
        },
        {
          label: 'No'
        }
      ]
    })
  };

    async remove(id) {
    await fetch(`/api/detallePrenda/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(() => {
      let updatedDetalles = [...this.state.detalles].filter(i => i.idDetallePrenda !== id);
      this.setState({detalles: updatedDetalles});
    });
  }


  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    await fetch('/api/prenda', {
      method: (item.idPrenda) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/prendas');
  }

  render() {
    const {item, temporada, detalles} = this.state;
    const detalleList = detalles.map (detalle => {
        return <tr key={detalle.idDetallePrenda}>
        <td>{detalle.material.nombre}</td>
        <td>{detalle.cantidad}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/detallePrendas/" + detalle.idDetallePrenda}>Edit</Button>
            &nbsp;&nbsp;
            <Button size="sm" color="danger" onClick={() => this.dialog(detalle)}>Delete</Button>
          </ButtonGroup>
        </td>
        </tr>
    });
    const title = <h2>{item.idPrenda ? 'Edit Prenda' : 'Add Prenda'}</h2>;
    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="nombre">Nombre</Label>
            <Input type="text" name="nombre" id="nombre" value={item.nombre || ''}
                   onChange={this.handleChange} autoComplete="nombre"/>
          </FormGroup>
          <FormGroup>
            <Label for="stock">Stock</Label>
            <Input type="text" name="stock" id="stock" value={item.stock || ''}
                   onChange={this.handleChange} autoComplete="stock"/>
          </FormGroup>
          <FormGroup>
            <Label for="temporada">Temporada</Label>
            <br></br>
            <Input type="checkbox" name="temporada" id="temporada" checked={this.state.temporada} value={this.state.temporada ? false : true} onChange={this.handleChange}/>
          </FormGroup>
          {this.state.temporada == true && (
          <FormGroup>
            <Label for="porcentaje">Porcentaje</Label>
            <Input type="text" name="porcentaje" id="porcentaje" value={item.porcentaje || ''}
             onChange={this.handleChange} autoComplete="porcentaje"/>   
          </FormGroup>
          )}
          {this.state.temporada == true &&(
            <FormGroup>
            <Label for="estacion">Estacion</Label>
            <Input type="text" name="estacion" id="estacion" value={item.estacion || ''}
             onChange={this.handleChange} autoComplete="estacion"/>   
          </FormGroup>
          )}
          <br></br>
          <div>
           <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={"/detallePrendas/new/" + item.idPrenda}>Add Detalle</Button>
          </div>
          <h3>Detalle Prenda</h3>
          <Table className="mt-4">
            <thead>
            <tr>
              <th width="20%">Material</th>
              <th width="20%">Cantidad</th>
              <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {detalleList}
            </tbody>
          </Table>
        </Container>
        </div>
        <br></br>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/prendas">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(PrendaEdit);