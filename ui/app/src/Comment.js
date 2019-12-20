import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Container, Form, Label} from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Rating from '@material-ui/lab/Rating';
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

class Comment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeId: '',
            openDialogEliminar: false,
            openDialogExito: false
        };
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(event) {
        this.setState({
            openDialogExito: false,
            openDialogEliminar: false
        });
    }

    dialog(idReseña) {
        this.setState({openDialogEliminar: true, activeId: idReseña});
    };

    dialogEliminado() {
        this.setState({openDialogExito: true, openDialogEliminar: false});
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
                    <div>
                        <Dialog
                            open={this.state.openDialogExito}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Operación Exitosa"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Cambios guardados correctamente.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => window.location.reload()} color="primary">
                                    Aceptar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div>
                        <Dialog
                            open={this.state.openDialogEliminar}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Confirmar"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    ¿Esta seguro de realizar esta acción?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => this.remove(this.state.activeId)} color="primary">
                                    Si
                                </Button>
                                <Button onClick={this.handleClose} color="primary">
                                    No
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Label>({this.props.fecha}) {this.props.nombre} {this.props.apellido} opinó:</Label>
                        </Grid>
                    </Grid>
                    <Label>Puntuación: </Label>
                    &nbsp;&nbsp;
                    <Rating
                        name="simple-controlled"
                        value={this.props.puntuacion}
                        readOnly
                        // onChange={(event, newValue) => {
                        //     setValue(newValue);
                        // }}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
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
                        </Grid>
                    </Grid>
                    {this.props.adminAux !== null &&
                    <Button onClick={() => this.dialog(this.props.idReseña)} variant="contained" color="secondary">
                        Eliminar
                    </Button>
                        // <Button size="sm" color="danger" onClick={() => this.dialog(this.props.idReseña)}>Eliminar</Button>
                    }
                    {/*</div>*/}
                </Form>
            </Container>
        );
    }
}

export default withRouter(Comment);