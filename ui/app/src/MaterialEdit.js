import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';

class MaterialEdit extends Component {

  emptyItem = {
    nombre: '',
    stock: '',
    puntoDePedido: '',
    precio: '',
    proveedor: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      proveedores : []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {

    if (this.props.match.params.id !== 'new') {
      const mat = await (await fetch(`/api/material/${this.props.match.params.id}`)).json();
      const provs = await (await fetch(`/api/proveedores`)).json();
      this.setState({item: mat, proveedores: provs});
    }else{
        const provs = await (await fetch(`/api/proveedores`)).json();
        this.setState({proveedores: provs});
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    await fetch('/api/material', {
      method: (item.idMaterial) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/materiales');
  }

  render() {
    const {item, proveedores} = this.state;
    let optionItems = proveedores.map((prov) => 
        <option key={prov.idProveedor} selected={item.proveedor.idProveedor == prov.idProveedor} value={JSON.stringify(prov)}>{prov.razonSocial}</option>
    );
    const title = <h2>{item.idMaterial ? 'Edit Material' : 'Add Material'}</h2>;
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
            <Label for="puntoDePedido">Punto de Pedido</Label>
            <Input type="text" name="puntoDePedido" id="puntoDePedido" value={item.puntoDePedido || ''}
                   onChange={this.handleChange} autoComplete="puntoDePedido"/>
          </FormGroup>
          <FormGroup>
            <Label for="precio">Precio</Label>
            <Input type="text" name="precio" id="precio" value={item.precio || ''}
                   onChange={this.handleChange} autoComplete="precio"/>
          </FormGroup>
          <FormGroup>
              <Label for="proveedor">Proveedor</Label>
              <br></br>
              <div>
            <select className="select" name="proveedor" id="proveedor" onChange={this.handleChange} autoComplete="proveedor">
                {optionItems}
            </select>
            </div>
          </FormGroup>          
            <FormGroup>
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/materiales">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(MaterialEdit);