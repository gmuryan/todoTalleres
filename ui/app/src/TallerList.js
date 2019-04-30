import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Label, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import {Link} from 'react-router-dom';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import './App.css';

class TallerList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            talleres: [],
            isLoading: true,
            nombre: '',
            barrio: '',
            clasificacion: '',
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

        fetch('api/talleres')
            .then(response => response.json())
            .then(data => this.setState({talleres: data, isLoading: false}))

    }

    async remove(id) {
        await fetch(`/api/taller/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedTalleres = [...this.state.talleres].filter(i => i.idTaller !== id);
            this.setState({talleres: updatedTalleres});
        });
    }

    dialog(taller) {
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

    filterMail = e => {
        this.setState({mail: e.target.value});
    }

    filterNombre = e => {
        this.setState({nombre: e.target.value});
    }

    filterApellido = e => {
        this.setState({apellido: e.target.value});
    }

    render() {
        const {talleres, isLoading, nombre, barrio, clasificacion, currentPage, todosPerPage} = this.state;
        let filterTalleres = this.state.talleres.slice();
        if (this.state.nombre) {
            filterTalleres = filterTalleres.filter(taller => taller.nombre.toLowerCase().indexOf(nombre.toLowerCase()) !== -1);
        }
        if (this.state.barrio) {
            filterTalleres = filterTalleres.filter(taller => taller.barrio.toLowerCase().indexOf(barrio.toLowerCase()) !== -1);
        }
        if (this.state.clasificacion) {
            filterTalleres = filterTalleres.filter(taller => taller.clasificacion.toLowerCase().indexOf(clasificacion.toLowerCase()) !== -1);
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
            return <tr key={taller.idTaller}>
                <td>{taller.idTaller}</td>
                <td style={{whiteSpace: 'nowrap'}}>{taller.nombre}</td>
                <td>{taller.barrio}</td>
                <td>{taller.telefono}</td>
                <td>{taller.mail}</td>
                <td>{taller.clasificacion.descripcion}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link}
                                to={"/talleres/" + taller.idTaller}>Editar</Button>
                        &nbsp;&nbsp;
                        <Button size="sm" color="danger" onClick={() => this.dialog(taller)}>Eliminar</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/talleres/new">Crear Taller</Button>
                    </div>
                    <h3>Talleres</h3>
                    <input type="text" onChange={this.filterNombre} placeholder="Nombre..."></input>
                    &nbsp;&nbsp;
                    <input type="text" onChange={this.filterApellido} placeholder="Barrio..."></input>
                    &nbsp;&nbsp;
                    <input type="text" onChange={this.filterMail} placeholder="Clasificacion..."></input>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="10%">Id</th>
                            <th width="10%">Nombre</th>
                            <th width="10%">Barrio</th>
                            <th width="10%">Telefono</th>
                            <th width="10%">Mail</th>
                            <th width="10%">Clasificacion</th>
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