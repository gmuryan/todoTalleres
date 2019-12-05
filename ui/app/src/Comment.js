import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Container, Form, Label} from 'reactstrap';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import "react-datepicker/dist/react-datepicker.css";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";

class Comment extends Component {

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
        const classes = {
            textField: {
                width: 200,
            },
        };
        return (
            <Container>
                <Form>
                    <div className="row">
                        <Label>({this.props.fecha}) {this.props.nombre} {this.props.apellido} dijo:</Label>
                        <TextField
                            id="outlined-multiline-static"
                            name="descripcionReparacion"
                            multiline
                            fullWidth
                            rows="4"
                            style={{
                                backgroundColor: "#e9ecef"
                            }}
                            InputProps={{
                                readOnly: true,
                            }}
                            value={this.props.comentario}
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                        />
                        {this.props.adminAux !== null &&
                        <Button onClick={() => this.dialog(this.props.idReseña)} variant="contained" color="secondary">
                            Eliminar
                        </Button>
                            // <Button size="sm" color="danger" onClick={() => this.dialog(this.props.idReseña)}>Eliminar</Button>
                        }
                    </div>
                </Form>
            </Container>
        );
    }
}

export default withRouter(Comment);