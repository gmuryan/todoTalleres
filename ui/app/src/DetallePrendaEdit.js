import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import './App.css';

class DetallePrendaEdit extends Component {

  emptyItem = {
    material: '',
    cantidad: ''
  };


  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      materiales: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      const detalle = await (await fetch(`/api/detallePrenda/${this.props.match.params.id}`)).json();
      const mats = await (await fetch(`/api/materiales`)).json();
      this.setState({item: detalle, materiales: mats});
    }else{
      const mats = await (await fetch(`/api/materiales`)).json();
      this.setState({materiales: mats});
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
    await fetch('/api/detallePrenda', {
      method: (item.idDetallePrenda) ? 'PUT' : 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item),
      idPrenda: 1,
    });
      this.props.history.goBack();
  }

  render() {
    const {item, materiales} = this.state;
    let optionItems = materiales.map((mat) =>
        <option key={mat.idMaterial} selected={item.material.idMaterial == mat.idMaterial} value={JSON.stringify(mat)}>{mat.nombre}</option>
    );
    let newOptions = materiales.map((mat) =>
        <option key={mat.idMaterial} value={JSON.stringify(mat)}>{mat.nombre}</option>
    );
    const title = <h2>{item.idDetallePrenda ? 'Edit Detalle Prenda' : 'Add Detalle Prenda'}</h2>;

    return <div>
      <AppNavbar/>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
        {item.idDetallePrenda && ( 
          <FormGroup>
              <Label for="material">Material</Label>
              <br></br>
              <div>
            <select className="select" name="material" id="material" onChange={this.handleChange} autoComplete="material">
                {optionItems}
            </select>
            </div>
          </FormGroup>
          )}
          {item.idDetallePrenda == null && ( 
          <FormGroup>
              <Label for="material">Material</Label>
              <br></br>
              <div>
            <select className="select" name="material" id="material" onChange={this.handleChange} autoComplete="material">
                <option default>Select a Material...</option>
                {newOptions}
            </select>
            </div>
          </FormGroup>
          )}
          <FormGroup>
            <Label for="cantidad">Cantidad</Label>
            <Input type="text" name="cantidad" id="cantidad" value={item.cantidad || ''}
                   onChange={this.handleChange} autoComplete="cantidad"/>
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">Save</Button>{' '}
            <Button color="secondary" onClick={this.props.history.goBack}>Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(DetallePrendaEdit);