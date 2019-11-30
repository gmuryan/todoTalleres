import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {Link} from'react-router-dom';
import {withRouter} from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import TextsmsIcon from '@material-ui/icons/Textsms';
import BuildIcon from '@material-ui/icons/Build';
import StoreIcon from '@material-ui/icons/Store';

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
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
}));

const MenuAppBar = ({logout, clienteUser, tallerUser, adminUser}) => {
    const classes = useStyles();
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorSM, setAnchorSM] = React.useState(null);
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
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

    const toggleDrawer = (side, open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [side]: open });
    };

    const sideList = side => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
            <List>
                {adminUser &&
                <Link to='/home' className="link-menu-color" style={{textDecoration: 'none'}}>
                    <ListItem button>
                        <ListItemIcon><HomeIcon/></ListItemIcon>
                        <ListItemText primary="Inicio"/>
                    </ListItem>
                </Link>
                }
                {clienteUser &&
                <Link to='/homeCliente' className="link-menu-color" style={{textDecoration: 'none'}}>
                    <ListItem button>
                        <ListItemIcon><HomeIcon/></ListItemIcon>
                        <ListItemText primary="Inicio"/>
                    </ListItem>
                </Link>
                }
                {tallerUser &&
                <Link to='/homeTaller' className="link-menu-color" style={{textDecoration: 'none'}}>
                    <ListItem button>
                        <ListItemIcon><HomeIcon/></ListItemIcon>
                        <ListItemText primary="Inicio"/>
                    </ListItem>
                </Link>
                }
                {adminUser &&
                <Link to='/clientes' className="link-menu-color" style={{ textDecoration: 'none' }}>
                    <ListItem button>
                        <ListItemIcon><PeopleIcon/></ListItemIcon>
                        <ListItemText primary="Clientes"/>
                    </ListItem>
                </Link>
                }
                {tallerUser &&
                <Link to={'/reseñas/' + tallerUser.idTaller} className="link-menu-color" style={{ textDecoration: 'none' }}>
                    <ListItem button>
                        <ListItemIcon><TextsmsIcon/></ListItemIcon>
                        <ListItemText primary="Reseñas"/>
                    </ListItem>
                </Link>
                }
                {tallerUser &&
                <Link to={'/mecanicos'} className="link-menu-color" style={{ textDecoration: 'none' }}>
                    <ListItem button>
                        <ListItemIcon><PeopleIcon/></ListItemIcon>
                        <ListItemText primary="Mecánicos"/>
                    </ListItem>
                </Link>
                }
                {(clienteUser || adminUser) &&
                <Link to='/talleres' className="link-menu-color" style={{ textDecoration: 'none' }}>
                    <ListItem button>
                        <ListItemIcon><StoreIcon/></ListItemIcon>
                        <ListItemText primary="Talleres"/>
                    </ListItem>
                </Link>
                }
                {(clienteUser || tallerUser) &&
                <Link to='/reparaciones' className="link-menu-color" style={{ textDecoration: 'none' }}>
                    <ListItem button>
                        <ListItemIcon><BuildIcon/></ListItemIcon>
                        <ListItemText primary="Reparaciones"/>
                    </ListItem>
                </Link>
                }
            </List>
        </div>
    );

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"                            aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={toggleDrawer('left', true)}>
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
                                <Link to={'/misDatos/' + clienteUser.idCliente} className="link-menu-color" style={{ textDecoration: 'none' }}>
                                    <MenuItem onClick={handleClose}>Mis Datos</MenuItem>
                                </Link>
                                }
                                {tallerUser &&
                                <Link to={'/miTaller/' + tallerUser.idTaller} className="link-menu-color" style={{ textDecoration: 'none' }}>
                                    <MenuItem onClick={handleClose}>Mi Taller</MenuItem>
                                </Link>
                                }
                                <Link to='/' className="link-menu-color" style={{ textDecoration: 'none' }}>
                                    <MenuItem onClick={logout}>Salir</MenuItem>
                                </Link>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <div>
                <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
                    {sideList('left')}
                </Drawer>
            </div>
        </div>
    );
}

export default withRouter(MenuAppBar);