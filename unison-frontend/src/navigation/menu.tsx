import { DashboardIcon, CollabIcon, LogoutIcon } from 'ui-component/SvgIcon';

const Menu = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        icon: <DashboardIcon />
    },
    {
        id: 'collab',
        title: 'Collab',
        type: 'item',
        url: '/collab',
        icon: <CollabIcon />
    },
    {
        id: 'logOut',
        title: 'Log Out',
        type: 'item',
        url: '/logout',
        icon: <LogoutIcon />
    }
];
export default Menu;
