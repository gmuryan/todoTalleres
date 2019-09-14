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

class Comment extends Component {

    constructor(props) {
        super(props);
    }

    dialog(idReseña) {
        confirmAlert({
            title: 'Confirmar',
            message: 'Esta seguro de realizar esta accion?',
            buttons: [
                {
                    label: 'Si',
                    onClick: () => this.remove(idReseña)
                },
                {
                    label: 'No'
                }
            ]
        })
    };

    dialogEliminado() {
        confirmAlert({
            title: 'Operacion Exitosa',
            message: 'Reseña Eliminada',
            buttons: [
                {
                    label: 'Aceptar',
                    onClick: () => window.location.reload()
                }
            ]
        })
    }


    async remove(id) {
        await fetch(`/api/reseña/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            this.dialogEliminado();
        });
    }

    render() {
        return (
            <Container>
                <Form>
                    <div className="row">
                            <Label>({this.props.fecha}) {this.props.nombre} {this.props.apellido} dijo:</Label>
                            <textarea readOnly={true} className="input-big-readOnly" type="text" name="descripcionReparacion"
                                      id="descripcionReparacion"
                                      value={this.props.comentario} autoComplete="descripcionReparacion"/>
                        {this.props.adminAux !== null &&
                        <Button size="sm" color="danger" onClick={() => this.dialog(this.props.idReseña)}>Eliminar</Button>
                        }
                    </div>
                </Form>
            </Container>
        );
    }
}

export default withRouter(Comment);