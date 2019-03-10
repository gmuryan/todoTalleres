import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

class OrdenCompraList extends Component {

    constructor(props) {
        super(props);
        this.state = {ordenes: [], isLoading: true, nombre: ''};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});

        fetch('api/ordenesCompra')
            .then(response => response.json())
            .then(data => this.setState({ordenes: data, isLoading: false}))

    }

    async remove(id) {
        await fetch(`/api/ordenCompra/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedOrdenes = [...this.state.ordenes].filter(i => i.idOC !== id);
            this.setState({ordenes: updatedOrdenes});
        });
    }

    dialog(oc) {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.remove(oc.idOC)
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
        const {ordenes, isLoading, nombre} = this.state;
        const filterOrdenes = ordenes.filter(oc => {
            return oc.proveedor.razonSocial.toLowerCase().indexOf( nombre.toLowerCase()) !== -1
        })
        if (isLoading) {
            return <p>Loading...</p>;

        }

        const ordenesList = filterOrdenes.map(oc => {
            return <tr key={oc.idOC}>
                <td style={{whiteSpace: 'nowrap'}}>{oc.idOC}</td>
                <td>{oc.proveedor.razonSocial}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/ordenesCompra/" + oc.idOC}>View</Button>
                        &nbsp;&nbsp;
                        <Button size="sm" color="danger" onClick={() => this.dialog(oc)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <h3>My Purchase Orders</h3>
                    <input type="text" onChange={this.filterUpdate} placeholder="Razon Social..."></input>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="20%">Nro. OC</th>
                            <th width="20%">Proveedor</th>
                            <th width="10%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ordenesList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default OrdenCompraList