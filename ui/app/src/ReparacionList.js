import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Label, Table} from 'reactstrap';
import TalleresNavbar from "./TalleresNavbar";
import {Link} from 'react-router-dom';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import './App.css';
import ClientesNavbar from "./ClientesNavbar";

class ReparacionList extends Component {

    constructor(props) {
        super(props);
        const taller = JSON.parse(localStorage.getItem("tallerUser"));
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        if (taller === null && cliente === null) {
            this.props.history.push('/');
            localStorage.clear();
        }
        this.state = {
            reparaciones: [],
            isLoading: true,
            fechaDevolucion: '',
            horaDevolucion: '',
            fechaReserva: '',
            horaReserva: '',
            importeTotal: '',
            estadoReparacion: '',
            descripcionProblema: '',
            descripcionReparacion: '',
            taller: '',
            cliente: '',
            currentPage: 1,
            todosPerPage: 10
        };
        this.handleClick = this.handleClick.bind(this);
        this.remove = this.remove.bind(this);
    }

    handleClick(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    componentDidMount() {
        this.setState({isLoading: true});
        const taller = JSON.parse(localStorage.getItem("tallerUser"));
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        if (taller !== null || cliente !== null) {
            if (taller !== null) {
                fetch(`api/reparacionesTaller/${taller.idTaller}`)
                    .then(response => response.json())
                    .then(data => this.setState({reparaciones: data, isLoading: false}))
            }
            if (cliente !== null){
                fetch(`api/reparacionesCliente/${cliente.idCliente}`)
                    .then(response => response.json())
                    .then(data => this.setState({reparaciones: data, isLoading: false}))
            }
        }
    }

    async remove(id) {
        await fetch(`/api/reparacion/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedReparaciones = [...this.state.reservas].filter(i => i.idReparacion !== id);
            this.setState({reparaciones: updatedReparaciones});
            this.dialogEliminado();
        });
    }

    dialogEliminado() {
        confirmAlert({
            title: 'Operacion Exitosa',
            message: 'Reparacion Eliminada',
            buttons: [
                {
                    label: 'Aceptar'
                }
            ]
        })
    }

    dialog(reparacion) {
        confirmAlert({
            title: 'Confirmar',
            message: 'Esta seguro de realizar esta accion?',
            buttons: [
                {
                    label: 'Si',
                    onClick: () => this.remove(reparacion.idReparacion)
                },
                {
                    label: 'No'
                }
            ]
        })
    };

    // filterMail = e => {
    //     this.setState({mail: e.target.value});
    // }
    //
    // filterNombre = e => {
    //     this.setState({nombre: e.target.value});
    // }
    //
    // filterApellido = e => {
    //     this.setState({apellido: e.target.value});
    // }

    render() {
        const {reparaciones, isLoading, fechaDevolucion, horaDevolucion, fechaReserva, horaReserva, importeTotal, estadoReparacion, descripcionProblema, descripcionReparacion, taller, cliente, currentPage, todosPerPage} = this.state;
        const tallerUser = JSON.parse(localStorage.getItem("tallerUser"));
        const clienteUser = JSON.parse(localStorage.getItem("clienteUser"));
        let filterReparaciones = this.state.reparaciones.slice();
        // if (this.state.nombre) {
        //     filterReservas = filterReservas.filter(cliente => cliente.nombre.toLowerCase().indexOf(nombre.toLowerCase()) !== -1);
        // }
        // if (this.state.apellido) {
        //     filterReservas = filterReservas.filter(cliente => cliente.apellido.toLowerCase().indexOf(apellido.toLowerCase()) !== -1);
        // }
        // if (this.state.mail) {
        //     filterReservas = filterReservas.filter(cliente => cliente.mail.toLowerCase().indexOf(mail.toLowerCase()) !== -1);
        // }

        if (isLoading) {
            return <p>Loading...</p>;

        }

        // Logic for displaying current todos
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = filterReparaciones.slice(indexOfFirstTodo, indexOfLastTodo);

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(reparaciones.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }
        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li
                    key={number}
                    id={number}
                    onClick={this.handleClick}
                >
                    [{number}]
                </li>
            );
        });

        const reparacionesList = currentTodos.map(reparacion => {
            return <tr key={reparacion.idReparacion}>
                <td>{reparacion.idReparacion}</td>
                <td style={{whiteSpace: 'nowrap'}}>{reparacion.horaReserva.substring(0, 5)}</td>
                <td>{reparacion.fechaReserva}</td>
                {tallerUser !== null &&
                <td>{reparacion.cliente.nombre + " " + reparacion.cliente.apellido}</td>
                }
                {clienteUser !== null &&
                <td>{reparacion.taller.nombre}</td>
                }
                {/*<td>{cliente.mail}</td>*/}
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link}
                                to={"/reparaciones/" + reparacion.idReparacion}>Editar</Button>
                        &nbsp;&nbsp;
                        <Button size="sm" color="danger" onClick={() => this.dialog(reparacion)}>Eliminar</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                {clienteUser !== null &&
                <ClientesNavbar/>
                }
                {tallerUser !== null &&
                <TalleresNavbar/>
                }
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/reparaciones/new">Crear Reparacion</Button>
                    </div>
                    <h3>Reparaciones</h3>
                    <input type="text" onChange={this.filterNombre} placeholder="Nombre..."></input>
                    &nbsp;&nbsp;
                    <input type="text" onChange={this.filterApellido} placeholder="Apellido..."></input>
                    &nbsp;&nbsp;
                    <input type="text" onChange={this.filterMail} placeholder="Mail..."></input>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="20%">ID</th>
                            <th width="20%">Hora Reserva</th>
                            <th width="20%">Dia Reserva</th>
                            {tallerUser !== null &&
                            <th width="20%">Cliente</th>
                            }
                            {clienteUser !== null &&
                            <th width="20%">Taller</th>
                            }
                            {/*<th width="20%">Mail</th>*/}
                            <th width="10%">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reparacionesList}
                        </tbody>
                    </Table>
                    <ul id="page-numbers">
                        <Label>Paginas:</Label>
                        <span>&nbsp;&nbsp;</span>
                        {renderPageNumbers}
                    </ul>
                </Container>
            </div>
        );
    }
}

export default ReparacionList