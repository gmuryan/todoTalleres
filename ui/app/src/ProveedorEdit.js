import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';

class ProveedorEdit extends Component {

  emptyItem = {
    razonSocial: '',
    cuit: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      const prov = await (await fetch(`/api/proveedor/${this.props.match.params.id}`)).json();
      this.setState({item: prov});
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

    await fetch('/api/proveedor', {
      method: (item.idProveedor) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
    });
    this.props.history.push('/proveedores');
  }

  render() {
    const {item} = this.state;
    const title = <h2>{item.idProveedor ? 'Edit Supplier' : 'Add Supplier'}</h2>;

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="razonSocial">Razon Social</Label>
            <Input type="text" name="razonSocial" id="razonSocial" value={item.razonSocial || ''}
                   onChange={this.handleChange} autoComplete="razonSocial"/>
          </FormGroup>
          <FormGroup>
            <Label for="cuit">Cuit</Label>
            <Input type="text" name="cuit" id="cuit" value={item.cuit || ''}
                   onChange={this.handleChange} autoComplete="cuit"/>
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" tag={Link} to="/proveedores">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(ProveedorEdit);