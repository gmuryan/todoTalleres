import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import TalleresNavbar from './TalleresNavbar';
import {confirmAlert} from "react-confirm-alert";
import Typography from "@material-ui/core/Typography";
import ReparacionesEnhancedTable from "./ReparacionesSortableTable";
import Button from '@material-ui/core/Button';


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

        return <div>
            <TalleresNavbar/>
            <Container>
                {this.props.match.params.id !== 'new' &&
                <Typography variant="h4">Editar Mecanico</Typography>
                }
                {this.props.match.params.id === 'new' &&
                <Typography variant="h4">Crear Mecanico</Typography>
                }
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
                            <Label for="telefono">Teléfono</Label>
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
                    <Typography variant="h4">
                        Reparaciones Asignadas
                    </Typography>
                    }
                    {this.props.match.params.id !== 'new' &&
                    <ReparacionesEnhancedTable rows={reparaciones} tallerUser={tallerAux} dense={true}  acciones={false}/>
                    }
                    {this.props.match.params.id !== 'new' &&
                    <br></br>
                    }
                    {this.props.match.params.id !== 'new' &&
                    <br></br>
                    }
                    <FormGroup>
                        <Button variant="contained" color="primary" type="submit">
                            Guardar
                        </Button>{' '}
                        <Link to='/mecanicos' style={{ textDecoration: 'none' }}>
                            <Button variant="contained" color="secondary">
                                Cancelar
                            </Button>
                        </Link>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withRouter(MecanicoEdit);