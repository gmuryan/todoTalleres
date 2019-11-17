import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {Link} from'react-router-dom';
import {withRouter} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

const MenuAppBar = ({logout, clienteUser, tallerUser, adminUser}) => {
    const classes = useStyles();
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorSM, setAnchorSM] = React.useState(null);
    const open = Boolean(anchorEl);
    const openMainMenu = Boolean(anchorSM);

    const handleChange = event => {
        setAuth(event.target.checked);
    };

    const handleMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMainMenu = event =>{
        setAnchorSM(event.currentTarget);
    };

    const handleCloseMainMenu = () =>{
        setAnchorSM(null);
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"                            aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMainMenu}>
                        <MenuIcon/>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorSM}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={openMainMenu}
                        onClose={handleCloseMainMenu}
                    >
                        {adminUser &&
                        <Link to='/home' style={{textDecoration: 'none'}}>
                            <MenuItem>Home</MenuItem>
                        </Link>
                        }
                        {clienteUser &&
                        <Link to='/homeCliente' style={{textDecoration: 'none'}}>
                            <MenuItem>Home</MenuItem>
                        </Link>
                        }
                        {tallerUser &&
                        <Link to='/homeTaller' style={{textDecoration: 'none'}}>
                            <MenuItem>Home</MenuItem>
                        </Link>
                        }
                        {adminUser &&
                        <Link to='/clientes' style={{ textDecoration: 'none' }}>
                            <MenuItem>Clientes</MenuItem>
                        </Link>
                        }
                        {tallerUser &&
                        <Link to={'/reseñas/' + tallerUser.idTaller} style={{ textDecoration: 'none' }}>
                            <MenuItem>Reseñas</MenuItem>
                        </Link>
                        }
                        {tallerUser &&
                        <Link to={'/mecanicos'} style={{ textDecoration: 'none' }}>
                            <MenuItem>Mecánicos</MenuItem>
                        </Link>
                        }
                        {(clienteUser || adminUser) &&
                        <Link to='/talleres' style={{ textDecoration: 'none' }}>
                            <MenuItem>Talleres</MenuItem>
                        </Link>
                        }
                        {(clienteUser || tallerUser) &&
                        <Link to='/reparaciones' style={{ textDecoration: 'none' }}>
                            <MenuItem>Reparaciones</MenuItem>
                        </Link>
                        }
                    </Menu>
                    <Typography variant="h6" className={classes.title}>
                        TodoTalleres
                    </Typography>
                    {auth && (
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                {clienteUser &&
                                <Link to={'/misDatos/' + clienteUser.idCliente} style={{ textDecoration: 'none' }}>
                                    <MenuItem onClick={handleClose}>Mis Datos</MenuItem>
                                </Link>
                                }
                                {tallerUser &&
                                <Link to={'/miTaller/' + tallerUser.idTaller} style={{ textDecoration: 'none' }}>
                                    <MenuItem onClick={handleClose}>Mi Taller</MenuItem>
                                </Link>
                                }
                                <Link to='/' style={{ textDecoration: 'none' }}>
                                    <MenuItem onClick={logout}>Salir</MenuItem>
                                </Link>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default withRouter(MenuAppBar);