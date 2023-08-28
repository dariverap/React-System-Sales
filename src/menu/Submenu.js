import React, { useState, useEffect } from 'react';
import { SidebarData } from './SIdebarData'
import styled, { css } from 'styled-components'
import { NavLink, Link ,useLocation, useNavigate} from "react-router-dom";
import { tieneAccesoUsuario } from '../utils/utils';

const activeStyle = css`
  border-left: 6px solid white;
  background: #1A237E;
`;

const SidebarLink = styled(NavLink)`
        display: flex;
        color: #424242;
        text-decoration: none;
        padding: 15px;
        height: 50px;
        font-size: 17px;
        font-weight: 500;
        cursor: pointer;
        justify-content: space-between;
        align-items: center;
        border-radius: 5px;
        background: transparent;

        & svg{
            font-size: 27px;
            color: #757575;
        }

        & span{
            color: #252525;
        }

        &:hover {
            background: #fff3b0;
            cursor: pointer;
        }
    `;

    const SidebarLabel = styled.span`
        color: #e1e9fc;
    `;

    const DropdownLink = styled(NavLink)`
        height: 45px;
        padding-left: 2.4rem;
        display: flex;
        align-items: center;
        text-decoration: none;
        color: #333333;
        font-size: 15px;
        font-weight: 500;
        gap: 15px;
        background: #f5f5f5;
        border-radius: 5px;

        & svg{
            font-size: 26px;
            
        }

        & span{
            color: #252525;
        }

        &:hover {
            background: #fff3b0;
            cursor: pointer;
        }
        &.active {
            background:linear-gradient(90deg, rgba(255,102,0,1) 0%, rgba(255,152,63,1) 100%);
        }
        &.active span{
            color: white;
        }
        &.active svg{
            color: white;
        }
`;


const Submenu = ({item}) => {

    const [subnav, setSubnav] = React.useState(false)
    const navigate = useNavigate(); // Utiliza useNavigate en lugar de useHistory
    const showSubnav = () => {
        setSubnav(!subnav);
    };
    // Realiza la redirección si el usuario no tiene acceso
    const redirect = () => {
        if (!tieneAccesoUsuario()) {
            // Usa navigate para redirigir
            if (tieneAccesoUsuario("Administrador")) {
               //navigate("/reporteventas");
            }
            else if (tieneAccesoUsuario("Vendedor")) {
                navigate("/ventas");
            }
            else if (tieneAccesoUsuario("Almacenero")) {
                navigate("/catalogo");
            }
        }
    };
    
    useEffect(() => {
        redirect(); // Llama a la función al montar el componente
      }, []); // Asegúrate de pasar un array vacío como segundo argumento para que se ejecute solo una vez

    const location = useLocation();

    const handleSubmenuClick = (event) => {
        event.preventDefault(); // Evita que el clic se propague al SidebarLink
        showSubnav();
    };

return (
    <>
        <SidebarLink
        to={item.link}
        onClick={item.subNav ? handleSubmenuClick : null}
        >
            <div style={{display:"flex",gap:"25px"}}>
                    {item.icon}
                <SidebarLabel>{item.title}</SidebarLabel>
            </div>
            <div>
                {item.subNav && subnav 
                ? item.iconOpened 
                : item.subNav 
                ? item.iconClosed 
                : null}
            </div>
        </SidebarLink>
        {subnav && item.subNav.map((item,index) => {
            if (
                (tieneAccesoUsuario("Administrador")) ||
                (tieneAccesoUsuario("Vendedor") 
                    && item.link.includes("/ventas") 
                    || item.link.includes("/reporteventas")
                    || item.link.includes("/productos")
                    || item.link.includes("/catalogo")
                    ) &&
                (tieneAccesoUsuario("Almacenero") 
                    && item.link.includes("/catalogo")
                    || item.link.includes("/productos"))
                ){
                return (
                    <DropdownLink to={item.link} key={index} isActive={() => location.pathname=== item.path}>
                        {item.icono}
                        <SidebarLabel>{item.title}</SidebarLabel>
                    </DropdownLink>
                );
            }else{
                return null;
            }
        })}
    </>
    )
}

export default Submenu