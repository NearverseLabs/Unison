import { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Box, CssBaseline, Toolbar, Stack } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
    const header = useMemo(
        () => (
            <Toolbar sx={{ height: '100%' }}>
                <Header />
            </Toolbar>
        ),
        []
    );

    return (
        <>
            <CssBaseline />
            <AppBar sx={{ width: '100%', height: 96 }} color="inherit" elevation={0} position="relative">
                {header}
            </AppBar>
            <Stack flexDirection="row">
                <AppBar
                    sx={{ width: 262, bgcolor: 'white', height: 'calc(100vh - 96px)' }}
                    color="inherit"
                    component="nav"
                    elevation={0}
                    position="relative"
                >
                    <Sidebar />
                </AppBar>
                <Box
                    sx={{
                        width: '87%',
                        bgcolor: '#FAFAFA',
                        padding: 4,
                        height: 'calc(100vh - 96px)',
                        overflowY: 'auto'
                    }}
                >
                    <Outlet />
                </Box>
            </Stack>
        </>
    );
};

export default MainLayout;
