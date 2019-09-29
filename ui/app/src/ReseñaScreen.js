import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table} from 'reactstrap';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment'
import ClientesNavbar from "./ClientesNavbar";
import TalleresNavbar from "./TalleresNavbar";
import Comment from "./Comment";
import AppNavbar from "./AppNavbar";
import App from "./App";

class ReseñaScreen extends Component {


    emptyTaller = {
        nombre: '',
        barrio: '',
        telefono: '',
        mail: '',
        ubicacion: '',
        marca: '',
        clasificacion: '',
        descripcionTaller: ''
    };

    emptyItem = {
        cliente: '',
        taller: '',
        comentario: '',
        fechaReseña: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyItem,
            reseñas: [],
            taller: this.emptyTaller,
            errors: {},
            formIsValid: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        const tallerUser = JSON.parse(localStorage.getItem("tallerUser"));
        const clienteUser = JSON.parse(localStorage.getItem("clienteUser"));
        const adminUser = JSON.parse(localStorage.getItem("adminUser"));
        if (clienteUser !== null || tallerUser !== null || adminUser !== null) {
            const res = await (await fetch(`/api/reseñas/${this.props.match.params.id}`)).json();
            this.setState({reseñas: res});
            if (clienteUser !== null) {
                const taller = await (await fetch(`/api/taller/${this.props.match.params.id}`)).json();
                this.setState({taller: taller});
            }
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

    handleValidation() {
        let fields = this.state.item;
        let errors = {};
        let formIsValid = true;

        if (fields["comentario"] === null || fields["comentario"] === '') {
            formIsValid = false;
            errors["comentario"] = "No puede estar vacio";
        }

        this.setState({errors: errors});
        return formIsValid;
    }

    dialogCreado() {
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
        if (this.handleValidation()) {
            const {item} = this.state;
            console.log(item);

            await fetch('/api/reseña', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(item),
            });
            this.dialogCreado();
            const reseñasList = await (await fetch(`/api/reseñas/${this.props.match.params.id}`)).json();
            this.setState({reseñas: reseñasList});
            // this.setState(prevState => ({
            //     reseñas : [...prevState.reseñas, this.state.item]
            // }))
            this.setState({item: this.emptyItem});
            // this.forceUpdate();
        }
    }

    render() {
        const {item, reseñas, taller} = this.state;
        const title = <h2>Reseñas</h2>;
        const tallerAux = JSON.parse(localStorage.getItem("tallerUser"));
        const clienteAux = JSON.parse(localStorage.getItem("clienteUser"));
        const adminAux = JSON.parse(localStorage.getItem("adminUser"));
        if (clienteAux !== null) {
            item.cliente = JSON.stringify(clienteAux);
            item.taller = taller;
        }
        const reseñasList = reseñas.map(reseña => {
            return (
                <Comment idReseña={reseña.idReseña} fecha={reseña.fechaReseña} nombre={reseña.cliente.nombre}
                         apellido={reseña.cliente.apellido}
                         comentario={reseña.comentario} adminAux={adminAux}/>
            );
        });
        return (
            <div>
                {tallerAux !== null &&
                <TalleresNavbar/>
                }
                {clienteAux !== null &&
                <ClientesNavbar/>
                }
                {adminAux !== null &&
                <AppNavbar/>
                }
                <Container>
                    {clienteAux !== null &&
                    <h2>Información del Taller</h2>
                    }
                    <Form>
                        {clienteAux !== null &&
                        <div className="row">
                            <FormGroup className="col-md-4 mb-3">
                                <Label for="nombre">Nombre</Label>
                                <Input readOnly type="text" name="nombre" id="nombre" value={taller.nombre || ''}
                                       onChange={this.handleChange} autoComplete="nombre"/>
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3">
                                <Label for="barrio">Barrio</Label>
                                <Input readOnly type="text" name="barrio" id="barrio" value={taller.barrio || ''}
                                       onChange={this.handleChange} autoComplete="barrio"/>
                            </FormGroup>
                            <FormGroup className="col-md-4 mb-3">
                                <Label for="telefono">Teléfono</Label>
                                <Input readOnly type="text" name="telefono" id="telefono" value={taller.telefono || ''}
                                       onChange={this.handleChange} autoComplete="telefono"/>
                            </FormGroup>
                        </div>
                        }
                        {clienteAux !== null &&
                        <div className="row">
                            <FormGroup className="col-md-6 mb-3">
                                <Label for="mail">Mail</Label>
                                <Input readOnly type="text" name="mail" id="mail" value={taller.mail || ''}
                                       onChange={this.handleChange} autoComplete="mail"/>
                            </FormGroup>
                            <FormGroup className="col-md-6 mb-3">
                                <Label for="ubicacion">Ubicación</Label>
                                <Input readOnly type="text" name="ubicacion" id="ubicacion"
                                       value={taller.ubicacion || ''}
                                       onChange={this.handleChange} autoComplete="ubicacion"/>
                            </FormGroup>
                        </div>
                        }
                        {clienteAux !== null &&
                        <div>
                            <div className="row">
                                <FormGroup className="col-md-12 mb-3">
                                    <Label for="descripcionTaller">Descripción del Taller</Label>
                                    <Input readOnly type="text" name="descripcionTaller" id="descripcionTaller"
                                           value={taller.descripcionTaller || ''}
                                           onChange={this.handleChange} autoComplete="descripcionTaller"/>
                                </FormGroup>
                            </div>
                        </div>
                        }
                        {clienteAux !== null &&
                        <div className="row">
                            <FormGroup className="col-md-6 mb-3">
                                <Label for="marca">Marca</Label>
                                <Input readOnly type="text" name="marca" id="marca" value={taller.marca.descripcion}
                                       onChange={this.handleChange} autoComplete="marca"/>
                            </FormGroup>
                            <FormGroup className="col-md-6 mb-3">
                                <Label for="clasificacion">Especialización</Label>
                                <Input readOnly type="text" name="clasificacion" id="clasificacion"
                                       value={taller.clasificacion.descripcion || ''}
                                       onChange={this.handleChange} autoComplete="clasificacion"/>
                            </FormGroup>
                        </div>
                        }
                    </Form>
                    <br></br>
                    {title}
                    {reseñasList}
                    {reseñasList.length > 0 &&
                    <br></br>
                    }
                    {reseñasList.length > 0 &&
                    <br></br>
                    }
                    <Form onSubmit={this.handleSubmit}>
                        {clienteAux !== null &&
                        <textarea className="input-big" type="text" placeholder="Deje su comentario aquí..."
                                  name="comentario" id="comentario" value={item.comentario || ''}
                                  onChange={this.handleChange} autoComplete="comentario"/>

                        }
                        {clienteAux !== null &&
                        <span className="error">{this.state.errors["comentario"]}</span>
                        }
                        {clienteAux !== null &&
                        <br></br>
                        }
                        {clienteAux !== null &&
                        <br></br>
                        }
                        <FormGroup>
                            {clienteAux !== null &&
                            <Button color="primary" type="submit">Publicar</Button>
                            }
                            {clienteAux !== null &&
                            ' '
                            }
                            {clienteAux !== null &&
                            <Button color="secondary" tag={Link} to="/talleres">Cancelar</Button>
                            }
                            {(tallerAux !== null || adminAux !== null) &&
                            <Button color="secondary" tag={Link}
                                    to={tallerAux !== null ? "/homeTaller" : "/talleres"}>Volver</Button>
                            }
                        </FormGroup>
                    </Form>
                </Container>
            </div>
        )
            ;
    }
}

export default withRouter(ReseñaScreen);