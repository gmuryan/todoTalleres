import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import TalleresNavbar from './TalleresNavbar';
import {confirmAlert} from "react-confirm-alert";

class MecanicoEdit extends Component {


    emptyItem = {
        nombre: '',
        apellido: '',
        telefono: '',
        mail: '',
        taller: ''
    };


    constructor(props) {
        super(props);
        const taller = JSON.parse(localStorage.getItem("tallerUser"));
        console.log(taller);
        if (taller===null) {
            localStorage.clear();
            this.props.history.push('/');
        }
        this.state = {
            item: this.emptyItem,
            errors: {},
            reparaciones: [],
            flag: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const mecanico = await (await fetch(`/api/mecanico/${this.props.match.params.id}`)).json();
            this.setState({item: mecanico});
            const reps = await (await fetch(`/api/reparacionesMecanico/${this.props.match.params.id}`)).json();
            this.setState({reparaciones: reps});
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

    handleValidation(){
        let fields = this.state.item;
        let errors = {};
        let formIsValid = true;

        //Name
        if(fields["nombre"].length === 0){
            formIsValid = false;
            errors["nombre"] = "No puede estar vacio";
        }
        else if(typeof fields["nombre"] !== "undefined"){
            if(!fields["nombre"].match(/^[a-zA-Z]+$/)){
                formIsValid = false;
                errors["nombre"] = "Solo letras";
            }
        }

        //Apellido
        if(fields["apellido"].length === 0){
            formIsValid = false;
            errors["apellido"] = "No puede estar vacio";
        }
        else if(typeof fields["apellido"] !== "undefined"){
            if(!fields["apellido"].match(/^[a-zA-Z]+$/)){
                formIsValid = false;
                errors["apellido"] = "Solo letras";
            }
        }

        //Telefono
        if(fields["telefono"].length === 0){
            formIsValid = false;
            errors["telefono"] = "No puede estar vacio";
        }
        else if(typeof fields["telefono"] !== "undefined"){
            if(!fields["telefono"].match(/^[0-9]+$/)){
                formIsValid = false;
                errors["telefono"] = "Solo numeros";
            }
        }

        //Email
        if(!fields["mail"]){
            formIsValid = false;
            errors["mail"] = "No puede estar vacio";
        }
        else if(typeof fields["mail"] !== "undefined"){
            let lastAtPos = fields["mail"].lastIndexOf('@');
            let lastDotPos = fields["mail"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["mail"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["mail"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["mail"] = "Mail invalido";
            }
        }

        this.setState({errors: errors});
        return formIsValid;
    }

    dialogCreado(){
        confirmAlert({
            title: 'Operacion Exitosa',
            buttons: [
                {
                    label: 'Aceptar'
                }
            ]
        })
    }


    async handleSubmit(event) {
        event.preventDefault();
        if (this.handleValidation()){
            const {item} = this.state;

            await fetch('/api/mecanico', {
                method: (item.idMecanico) ? 'PUT' : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
            });
            this.props.history.push('/mecanicos');
            this.dialogCreado();
        }
    }

    render() {
        const {item, flag, reparaciones} = this.state;
        const title = <h2>{item.idMecanico ? 'Editar Mecanico' : 'Crear Mecanico'}</h2>;
        const tallerAux = JSON.parse(localStorage.getItem("tallerUser"));
        item.taller = JSON.stringify(tallerAux);
        const reparacionesList = reparaciones.map(reparacion => {
            return <tr key={reparacion.idReparacion}>
                <td>{reparacion.idReparacion}</td>
                <td>{reparacion.fechaDevolucion}</td>
                <td>{reparacion.horaDevolucion ? reparacion.horaDevolucion.substring(0, 5) : reparacion.horaDevolucion}</td>
                <td>{reparacion.estadoReparacion.descripcion}</td>
                {reparacion.importeTotal &&
                <td> ${new Intl.NumberFormat('de-DE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(reparacion.importeTotal)}</td>
                }
                {!reparacion.importeTotal &&
                <td>{reparacion.importeTotal}</td>
                }
                <td>{reparacion.cliente.nombre + " " + reparacion.cliente.apellido}</td>
            </tr>
        });
        return <div>
            <TalleresNavbar/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="nombre">Nombre</Label>
                            <Input type="text" name="nombre" id="nombre" value={item.nombre || ''}
                                   onChange={this.handleChange} autoComplete="nombre"/>
                            <span className="error">{this.state.errors["nombre"]}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="apellido">Apellido</Label>
                            <Input type="text" name="apellido" id="apellido" value={item.apellido || ''}
                                   onChange={this.handleChange} autoComplete="apellido"/>
                            <span className="error">{this.state.errors["apellido"]}</span>
                        </FormGroup>
                    </div>
                    <div className="row">
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="telefono">Telefono</Label>
                            <Input type="text" name="telefono" id="telefono" value={item.telefono || ''}
                                   onChange={this.handleChange} autoComplete="telefono"/>
                            <span className="error">{this.state.errors["telefono"]}</span>
                        </FormGroup>
                        <FormGroup className="col-md-6 mb-3">
                            <Label for="mail">Mail</Label>
                            <Input type="text" name="mail" id="mail" value={item.mail || ''}
                                   onChange={this.handleChange} autoComplete="mail"/>
                            <span className="error">{this.state.errors["mail"]}</span>
                        </FormGroup>
                    </div>
                    {this.props.match.params.id !== 'new' &&
                    <h3> Reparaciones asignadas</h3>
                    }
                    {this.props.match.params.id !== 'new' &&
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="5%">ID</th>
                            <th width="10%">Dia Devolucion</th>
                            <th width="10%">Hora Devolucion</th>
                            <th width="10%">Estado</th>
                            <th width="10%">Importe</th>
                            <th width="10%">Cliente</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reparacionesList}
                        </tbody>
                    </Table>
                    }
                    {this.props.match.params.id !== 'new' &&
                    <br></br>
                    }
                    {this.props.match.params.id !== 'new' &&
                    <br></br>
                    }
                    <FormGroup>
                        <Button color="primary" type="submit">Guardar</Button>{' '}
                        <Button color="secondary" tag={Link} to="/mecanicos">Cancelar</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(MecanicoEdit);