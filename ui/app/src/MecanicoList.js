import React, {Component} from 'react';
import TalleresNavbar from './TalleresNavbar';
import {Link} from 'react-router-dom';
import {Container, Label, Table} from 'reactstrap';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import './App.css';
import ClipLoader from 'react-spinners/ClipLoader';
import { css } from '@emotion/core';
import TextField from "@material-ui/core/TextField";
import ClientesEnhancedTable from "./ClientesSortableTable";
import MecanicosEnhancedTable from "./MecanicosSortableTable";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';

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
            mail: ''
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
            title: 'Operación Exitosa',
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
            title: 'Operación Exitosa',
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
            message: '¿Esta seguro de realizar esta acción?',
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
            message: '¿Esta seguro de realizar esta acción?',
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
        const {mecanicos, isLoading, nombre, apellido, mail} = this.state;
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

        return (
            <div>
                <TalleresNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button type="button" variant="contained" color="primary" className={classes.button} onClick={() => this.props.history.push('/mecanicos/new')}>
                            Crear Mecanico
                        </Button>
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
                    <MecanicosEnhancedTable rows={filterMecanicos} habilitarMecanico={this.dialogHabilitar} deshabilitarMecanico={this.dialogDeshabilitar} editar={this.edit} acciones={true}/>
                </Container>
            </div>
        );
    }
}

export default MecanicoList