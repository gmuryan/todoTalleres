import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Label, Table} from 'reactstrap';
import TalleresNavbar from './TalleresNavbar';
import {Link} from 'react-router-dom';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import './App.css';
import ClipLoader from 'react-spinners/ClipLoader';
import { css } from '@emotion/core';
import TextField from "@material-ui/core/TextField";
import ClientesEnhancedTable from "./ClientesSortableTable";
import MecanicosEnhancedTable from "./MecanicosSortableTable";
import Typography from "@material-ui/core/Typography";

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
    margin-top: 300px;
`;

class MecanicoList extends Component {

    constructor(props) {
        super(props);
        const taller = JSON.parse(localStorage.getItem("tallerUser"));
        if (taller===null) {
            this.props.history.push('/');
            localStorage.clear();
        }
        this.state = {
            mecanicos: [],
            isLoading: true,
            nombre: '',
            apellido: '',
            mail: '',
            currentPage: 1,
            todosPerPage: 5
        };
        this.dialogDeshabilitar = this.dialogDeshabilitar.bind(this);
        this.dialogHabilitar = this.dialogHabilitar.bind(this);
        this.edit = this.edit.bind(this);
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
        if (taller !== null){
        fetch(`/api/mecanicos/${taller.idTaller}`)
            .then(response => response.json())
            .then(data => this.setState({mecanicos: data, isLoading: false}))
        }
    }

    async remove(id) {
        await fetch(`/api/borrarMecanico/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            fetch('api/mecanicos')
                .then(response => response.json())
                .then(data => this.setState({mecanicos: data}))
            this.dialogEliminado();
        });
    }

    async habilitar(id) {
        await fetch(`/api/habilitarMecanico/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            fetch('api/mecanicos')
                .then(response => response.json())
                .then(data => this.setState({mecanicos: data}))
            this.dialogHabilitado();
        });
    }

    dialogHabilitado(){
        confirmAlert({
            title: 'Operacion Exitosa',
            message: 'Mecanico Habilitado',
            buttons: [
                {
                    label: 'Aceptar'
                }
            ]
        })
    }

    dialogEliminado(){
        confirmAlert({
            title: 'Operacion Exitosa',
            message: 'Mecanico Deshabilitado',
            buttons: [
                {
                    label: 'Aceptar'
                }
            ]
        })
    }

    dialogDeshabilitar(mecanico) {
        confirmAlert({
            title: 'Confirmar',
            message: 'Esta seguro de realizar esta accion?',
            buttons: [
                {
                    label: 'Si',
                    onClick: () => this.remove(mecanico.idMecanico)
                },
                {
                    label: 'No'
                }
            ]
        })
    };

    dialogHabilitar(mecanico) {
        confirmAlert({
            title: 'Confirmar',
            message: 'Esta seguro de realizar esta accion?',
            buttons: [
                {
                    label: 'Si',
                    onClick: () => this.habilitar(mecanico.idMecanico)
                },
                {
                    label: 'No'
                }
            ]
        })
    };

    edit(idMecanico){
        this.props.history.push('/mecanicos/' + idMecanico);
    }

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
        const {mecanicos, isLoading, nombre, apellido, mail, currentPage, todosPerPage} = this.state;
        const classes = {
            textField: {
                width: 200,
            },
        };
        let filterMecanicos = this.state.mecanicos.slice();
        if (this.state.nombre) {
            filterMecanicos = filterMecanicos.filter(mecanico => mecanico.nombre.toLowerCase().indexOf(nombre.toLowerCase()) !== -1);
        }
        if (this.state.apellido) {
            filterMecanicos = filterMecanicos.filter(mecanico => mecanico.apellido.toLowerCase().indexOf(apellido.toLowerCase()) !== -1);
        }
        if (this.state.mail) {
            filterMecanicos = filterMecanicos.filter(mecanico => mecanico.mail.toLowerCase().indexOf(mail.toLowerCase()) !== -1);
        }

        if (isLoading) {
            return <div className='sweet-loading'>
                <ClipLoader
                    css={override}
                    sizeUnit={"px"}
                    size={35}
                    color={'#123abc'}
                    loading={this.state.isLoading}
                />
            </div>
        }

        // Logic for displaying current todos
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = filterMecanicos.slice(indexOfFirstTodo, indexOfLastTodo);

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(mecanicos.length / todosPerPage); i++) {
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

        const mecanicoList = currentTodos.map(mecanico => {
            return <tr key={mecanico.idMecanico}>
                <td>{mecanico.idMecanico}</td>
                <td style={{whiteSpace: 'nowrap'}}>{mecanico.nombre}</td>
                <td>{mecanico.apellido}</td>
                <td>{mecanico.telefono}</td>
                <td>{mecanico.mail}</td>
                <td>{mecanico.activo ? "Si" : "No"}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link}
                                to={"/mecanicos/" + mecanico.idMecanico}>Editar</Button>
                        &nbsp;&nbsp;
                        {mecanico.activo &&
                        <Button size="sm" color="danger" onClick={() => this.dialogDeshabilitar(mecanico)}>Deshabilitar</Button>
                        }
                        {!mecanico.activo &&
                        <Button size="sm" color="success" onClick={() => this.dialogHabilitar(mecanico)}>Habilitar</Button>
                        }
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <TalleresNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/mecanicos/new">Crear Mecanico</Button>
                    </div>
                    <Typography variant="h4">
                        Mecanicos
                    </Typography>
                    <TextField
                        id="standard-basic"
                        className={classes.textField}
                        label="Nombre"
                        margin="normal"
                        onChange={this.filterNombre}
                    />
                    &nbsp;&nbsp;
                    &nbsp;&nbsp;
                    <TextField
                        id="standard-basic"
                        className={classes.textField}
                        label="Apellido"
                        margin="normal"
                        onChange={this.filterApellido}
                    />
                    &nbsp;&nbsp;
                    &nbsp;&nbsp;
                    <TextField
                        id="standard-basic"
                        className={classes.textField}
                        label="Mail"
                        margin="normal"
                        onChange={this.filterMail}
                    />
                    {/*<input type="text" onChange={this.filterNombre} placeholder="Nombre..."></input>*/}
                    {/*&nbsp;&nbsp;*/}
                    {/*<input type="text" onChange={this.filterApellido} placeholder="Apellido..."></input>*/}
                    {/*&nbsp;&nbsp;*/}
                    {/*<input type="text" onChange={this.filterMail} placeholder="Mail..."></input>*/}
                    <MecanicosEnhancedTable rows={filterMecanicos} habilitarMecanico={this.dialogHabilitar} deshabilitarMecanico={this.dialogDeshabilitar} editar={this.edit}/>
                    {/*<Table className="mt-4">*/}
                    {/*    <thead>*/}
                    {/*    <tr>*/}
                    {/*        <th width="20%">ID</th>*/}
                    {/*        <th width="20%">Nombre</th>*/}
                    {/*        <th width="20%">Apellido</th>*/}
                    {/*        <th width="20%">Teléfono</th>*/}
                    {/*        <th width="20%">Mail</th>*/}
                    {/*        <th width="10%">Habilitado</th>*/}
                    {/*        <th width="10%">Acciones</th>*/}
                    {/*    </tr>*/}
                    {/*    </thead>*/}
                    {/*    <tbody>*/}
                    {/*    {mecanicoList}*/}
                    {/*    </tbody>*/}
                    {/*</Table>*/}
                    {/*<ul id="page-numbers">*/}
                    {/*    <Label>Paginas:</Label>*/}
                    {/*    <span>&nbsp;&nbsp;</span>*/}
                    {/*    {renderPageNumbers}*/}
                    {/*</ul>*/}
                </Container>
            </div>
        );
    }
}

export default MecanicoList