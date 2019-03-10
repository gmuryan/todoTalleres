import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';

class OrdenCompraEdit extends Component {

    emptyItem = {
        proveedor: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            detalles: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const oc = await (await fetch(`/api/ordenCompra/${this.props.match.params.id}`)).json();
            const dets = await (await fetch(`/api/detallesOC/${this.props.match.params.id}`)).json();
            this.setState({item: oc, detalles : dets});
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

        await fetch('/api/ordenCompra', {
            method: (item.idOC) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/ordenesCompra');
    }

    render() {
        const {item, detalles} = this.state;
        const detalleList = detalles.map(detalle => {
            return <tr key={detalle.idDetalleOC}>
                <td>{detalle.material.nombre}</td>
                <td>{detalle.cantidad}</td>
            </tr>
        });
        const title = <h2>{item.idOC ? 'View Purchase Order' : 'Add Purchase Order'}</h2>;

        return <div>
            <AppNavbar/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="proveedor">Proveedor</Label>
                        <Input readOnly name="proveedor" id="proveedor" value={item.proveedor.razonSocial || ''}
                               onChange={this.handleChange} autoComplete="proveedor"/>
                    </FormGroup>
                    <br></br>
                    <div>
                        <Container fluid>
                            <h3>Detalle OC</h3>
                            <Table className="mt-4">
                                <thead>
                                <tr>
                                    <th width="20%">Material</th>
                                    <th width="20%">Cantidad</th>
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
                        <Button color="secondary" tag={Link} to="/ordenesCompra">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(OrdenCompraEdit);