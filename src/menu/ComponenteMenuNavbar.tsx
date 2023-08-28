import usuario from '../assets/img/user-RE.webp'
import Cookies from 'universal-cookie';
import * as React from 'react';
import logo from '../assets/img/logoYS.webp'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { bgBG } from '@mui/x-data-grid';
import { Link, useNavigate } from "react-router-dom";



const settings = ['Cerrar sesión'];

export default function ComponenteMenuNavbar(){
    const history = useNavigate();
    const cookies = new Cookies();
    const cerrarSesion=()=>{
        cookies.remove('id');
        cookies.remove('nombre');
        cookies.remove('rol');
        localStorage.clear();
        history('/login');
    }
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
      };
      const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
      };
    
      const handleCloseNavMenu = () => {
        setAnchorElNav(null);
      };
    
      const handleCloseUserMenu = () => {
        setAnchorElUser(null);
      };
    

    return(
    <div style={{zIndex:1000,width:"100%",position:"fixed"}}>
        <AppBar position="static" sx={{boxShadow:"none",background:"linear-gradient(90deg, rgba(255,102,0,1) 0%, rgba(255,152,63,1) 100%)",width:"100%"}} >
            <Container style={{minWidth:"100%",height:"100%"}}>
                <Toolbar disableGutters>
                <Avatar src={logo} sx={{marginRight:"20px"}} alt='logo'/>
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    href="/ventas"
                    sx={{
                        mr: 2,
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        letterSpacing: '.2rem',
                        color: '#ffffff',
                        textDecoration: 'none',

                    }}
                >
                    FERRETERIA YERIAS S.A.C
                </Typography>

                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                    }}
                    >
                    </Menu>
                </Box>
                
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    
                </Box>

                <Box sx={{ flexGrow: 0 }}>
                    <IconButton onClick={handleOpenUserMenu} sx={{ padding:"5px 20px 5px 20px" , borderRadius:"5px",backgroundColor:"white",gap:"10px",'&:hover': {
                        backgroundColor: '#E0E0E0'
                    },
                }}>
                        <Avatar alt="Remy Sharp" src={usuario} />
                        <Typography style={{fontWeight:600}}>{cookies.get('nombre')}</Typography>
                        <ArrowDropDownIcon/>
                    </IconButton>
                    <Menu
                    sx={{ mt: '48px', padding:"5px 20px 5px 20px"}}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    >
                    {settings.map((setting) => (
                        <MenuItem key={setting} onClick={cerrarSesion}>
                        <Typography textAlign="center" sx={{padding:"5px 20px 5px 20px"}}>{setting}</Typography>
                        <LogoutIcon style={{color:"red", marginLeft:"10px"}}/>
                        </MenuItem>
                    ))}
                    </Menu>
                </Box>
                </Toolbar>
            </Container>
        </AppBar>
    </div>
    )
}