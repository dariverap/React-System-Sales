import Inventory2Icon from '@mui/icons-material/Inventory2';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SummarizeIcon from '@mui/icons-material/Summarize';
import SellIcon from '@mui/icons-material/Sell';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import BrandingWatermarkRoundedIcon from '@mui/icons-material/BrandingWatermarkRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';


export const SidebarData = [
    {
        title: 'Ventas',
        link: '/',
        icon: <SellIcon/>,
        iconClosed: <KeyboardArrowDownIcon/>,
        iconOpened: <KeyboardArrowUpIcon/>,
        subNav:[{
            title: 'Clientes',
            link: '/clientes',
            icono: <PersonRoundedIcon/>,
        },{
            title: 'Reporte de ventas',
            link: '/reporteventas',
            icono: <SummarizeIcon/>,
        },{
            title: 'Registro de ventas',
            link: '/ventas',
            icono: <MonetizationOnRoundedIcon/>,
        }
    ]
    },
    {
        title: 'Productos',
        link: '/',
        icon: <Inventory2Icon/>,
        iconClosed: <KeyboardArrowDownIcon/>,
        iconOpened: <KeyboardArrowUpIcon/>,
        subNav:[{
            title: 'Categorias',
            link: '/categorias',
            icono: <CategoryRoundedIcon/>,
        },{
            title: 'Marcas',
            link: '/marcas',
            icono: <BrandingWatermarkRoundedIcon/>,
        },{
            title: 'Productos',
            link: '/productos',
            icono: <Inventory2Icon/>,
        }/*,{
            title: 'Catalogo',
            link: '/catalogo',
            icono: <SummarizeIcon/>,
        }*/
    ]
    },
     {
         title: 'Compra',
         link: '/',
         icon: <ShoppingCartIcon/>,
         iconClosed: <KeyboardArrowDownIcon/>,
         iconOpened: <KeyboardArrowUpIcon/>,
         subNav:[{
             title: 'Proveedores',
             link: '/proveedores',
             icono: <LocalShippingRoundedIcon/>,
         },{
             title: 'Registro de compras',
             link: '/compras',
             icono: <SummarizeIcon/>,
         }
         ,{
            title: 'Registro de Entrada',
            link: '/entrada',
            icono: <SummarizeIcon/>,
        }
     ]
     },
    {
        title: 'Sistema',
        link: '/usuarios',
        icon: <PeopleAltIcon/>,
        iconClosed: <KeyboardArrowDownIcon/>,
        iconOpened: <KeyboardArrowUpIcon/>,
        subNav:[{
            title: 'Usuarios',
            link: '/usuarios',
            icono: <PersonRoundedIcon/>,
        },{
            title:'Empleados',
            link: '/empleados',
            icono: <BadgeRoundedIcon/>,
        }
    ]
    }
]