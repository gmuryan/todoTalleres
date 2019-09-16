import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import {Link} from 'react-router-dom';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import './App.css';
import ClientesNavbar from "./ClientesNavbar";

class TallerList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            talleres: [],
            isLoading: true,
            nombre: '',
            barrio: '',
            clasificacion: '',
            marca: '',
            currentPage: 1,
            todosPerPage: 5
        };
        this.handleClick = this.handleClick.bind(this);
        this.remove = this.remove.bind(this);
        const admin = JSON.parse(localStorage.getItem("adminUser"));
        const cliente = JSON.parse(localStorage.getItem("clienteUser"));
        if (admin === null && cliente === null) {
            localStorage.clear();
            this.props.history.push('/');
        }
    }

    handleClick(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    componentDidMount() {
        this.setState({isLoading: true});

        fetch('api/talleres')
            .then(response => response.json())
            .then(data => this.setState({talleres: data, isLoading: false}))

    }

    async remove(id) {
        await fetch(`/api/borrarTaller/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            fetch('api/talleres')
                .then(response => response.json())
                .then(data => this.setState({talleres: data}))
            this.dialogEliminado();
        });
    }

    async habilitar(id) {
        await fetch(`/api/habilitarTaller/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            fetch('api/talleres')
                .then(response => response.json())
                .then(data => this.setState({talleres: data}))
            this.dialogHabilitado();
        });
    }


    dialogHabilitado() {
        confirmAlert({
            title: 'Operacion Exitosa',
            message: 'Taller Habilitado',
            buttons: [
                {
                    label: 'Aceptar'
                }
            ]
        })
    }

    dialogEliminado() {
        confirmAlert({
            title: 'Operacion Exitosa',
            message: 'Taller Deshabilitado',
            buttons: [
                {
                    label: 'Aceptar'
                }
            ]
        })
    }

    dialogDeshabilitar(taller) {
        confirmAlert({
            title: 'Confirmar',
            message: 'Esta seguro de realizar esta accion?',
            buttons: [
                {
                    label: 'Si',
                    onClick: () => this.remove(taller.idTaller)
                },
                {
                    label: 'No'
                }
            ]
        })
    };

    dialogHabilitar(taller) {
        confirmAlert({
            title: 'Confirmar',
            message: 'Esta seguro de realizar esta accion?',
            buttons: [
                {
                    label: 'Si',
                    onClick: () => this.habilitar(taller.idTaller)
                },
                {
                    label: 'No'
                }
            ]
        })
    };

    filterBarrio = e => {
        this.setState({barrio: e.target.value});
    }

    filterNombre = e => {
        this.setState({nombre: e.target.value});
    }

    filterClasificacion = e => {
        this.setState({clasificacion: e.target.value});
    }

    filterMarca = e => {
        this.setState({marca: e.target.value});
    }

    render() {
        const {talleres, isLoading, nombre, barrio, clasificacion, marca, currentPage, todosPerPage} = this.state;
        const adminUser = JSON.parse(localStorage.getItem("adminUser"));
        const clienteUser = JSON.parse(localStorage.getItem("clienteUser"));
        let filterTalleres = this.state.talleres.slice();
        if (this.state.nombre) {
            filterTalleres = filterTalleres.filter(taller => taller.nombre.toLowerCase().indexOf(nombre.toLowerCase()) !== -1);
        }
        if (this.state.barrio) {
            filterTalleres = filterTalleres.filter(taller => taller.barrio.toLowerCase().indexOf(barrio.toLowerCase()) !== -1);
        }
        if (this.state.clasificacion) {
            filterTalleres = filterTalleres.filter(taller => taller.clasificacion.descripcion.toLowerCase().indexOf(clasificacion.toLowerCase()) !== -1 || taller.clasificacion.descripcion.match("Todas"));
        }
        if (this.state.marca) {
            filterTalleres = filterTalleres.filter(taller => taller.marca.descripcion.toLowerCase().indexOf(marca.toLowerCase()) !== -1 || taller.marca.descripcion.match("Todas"));
        }

        if (isLoading) {
            return <p>Loading...</p>;

        }

        // Logic for displaying current todos
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = filterTalleres.slice(indexOfFirstTodo, indexOfLastTodo);

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(talleres.length / todosPerPage); i++) {
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

        const tallerList = currentTodos.map(taller => {
            if (adminUser) {
                return <tr key={taller.idTaller}>
                    <td>{taller.idTaller}</td>
                    <td style={{whiteSpace: 'nowrap'}}>{taller.nombre}</td>
                    <td>{taller.barrio}</td>
                    <td>{taller.telefono}</td>
                    <td>{taller.mail}</td>
                    <td>{taller.marca.descripcion}</td>
                    <td>{taller.clasificacion.descripcion}</td>
                    {adminUser &&
                    <td>{taller.activo ? "Si" : "No"}</td>
                    }
                    <td>
                        {adminUser !== null &&
                        <ButtonGroup>
                            <Button size="sm" color="primary" tag={Link}
                                    to={"/talleres/" + taller.idTaller}>Editar</Button>
                            &nbsp;&nbsp;
                            <Button size="sm" color="secondary" tag={Link}
                                    to={"/reseñas/" + taller.idTaller}>Reseñas</Button>
                            &nbsp;&nbsp;
                            {taller.activo &&
                            <Button size="sm" color="danger" onClick={() => this.dialogDeshabilitar(taller)}>Deshabilitar</Button>
                            }
                            {!taller.activo &&
                            <Button size="sm" color="success" onClick={() => this.dialogHabilitar(taller)}>Habilitar</Button>
                            }
                        </ButtonGroup>
                        }
                    </td>
                </tr>
            }
            if (clienteUser && taller.activo) {
                return <tr key={taller.idTaller}>
                    <td>{taller.idTaller}</td>
                    <td style={{whiteSpace: 'nowrap'}}>{taller.nombre}</td>
                    <td>{taller.barrio}</td>
                    <td>{taller.telefono}</td>
                    <td>{taller.mail}</td>
                    <td>{taller.marca.descripcion}</td>
                    <td>{taller.clasificacion.descripcion}</td>
                    {adminUser &&
                    <td>{taller.activo ? "Si" : "No"}</td>
                    }
                    <td>
                        {adminUser !== null &&
                        <ButtonGroup>
                            <Button size="sm" color="primary" tag={Link}
                                    to={"/talleres/" + taller.idTaller}>Editar</Button>
                            &nbsp;&nbsp;
                            <Button size="sm" color="secondary" tag={Link}
                                    to={"/reseñas/" + taller.idTaller}>Reseñas</Button>
                            &nbsp;&nbsp;
                            <Button size="sm" color="danger" onClick={() => this.dialog(taller)}>Eliminar</Button>
                        </ButtonGroup>
                        }
                        {clienteUser !== null &&
                        <ButtonGroup>
                            <Button size="sm" color="primary" tag={Link}
                                    to={"/reservacion/" + taller.idTaller}>Reservar</Button>
                            &nbsp;&nbsp;
                            <Button size="sm" color="info" tag={Link}
                                    to={"/reseñas/" + taller.idTaller}>Ver más</Button>
                        </ButtonGroup>
                        }
                    </td>
                </tr>
            }
        });

        return (
            <div>
                {adminUser !== null &&
                <AppNavbar/>
                }
                {clienteUser !== null &&
                <ClientesNavbar/>
                }
                <Container fluid>
                    {adminUser !== null &&
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/talleres/new">Crear Taller</Button>
                    </div>
                    }
                    <h3>Talleres</h3>
                    <input type="text" onChange={this.filterNombre} placeholder="Nombre..."></input>
                    &nbsp;&nbsp;
                    <input type="text" onChange={this.filterBarrio} placeholder="Barrio..."></input>
                    &nbsp;&nbsp;
                    <input type="text" onChange={this.filterMarca} placeholder="Marca..."></input>
                    &nbsp;&nbsp;
                    <input type="text" onChange={this.filterClasificacion} placeholder="Especializacion..."></input>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="10%">ID</th>
                            <th width="10%">Nombre</th>
                            <th width="10%">Barrio</th>
                            <th width="10%">Telefono</th>
                            <th width="10%">Mail</th>
                            <th width="10%">Marca</th>
                            <th width="10%">Especializacion</th>
                            {adminUser &&
                            <th width="10%">Habilitado</th>
                            }
                            <th width="10%">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tallerList}
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

export default TallerList