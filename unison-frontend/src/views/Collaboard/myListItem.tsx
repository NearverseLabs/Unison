import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';

import DefaultImage from 'assets/images/default.png';

const MyListItem = ({ data }: any) => {
    const navigate = useNavigate();
    return (
        <Stack
            sx={{
                p: 3,
                gap: 3,
                minWidth: 331,
                width: 331,
                height: 401,
                bgcolor: '#F1F1F1',
                border: '1px solid #E7E7E7',
                alignItems: 'center'
            }}
        >
            <Stack sx={{ gap: '14px', alignItems: 'center', textAlign: 'center' }}>
                <Box
                    component="img"
                    src={
                        data.server.icon
                            ? `https://cdn.discordapp.com/icons/${data.serverId}/${data.server.icon}.png?size=1024`
                            : DefaultImage
                    }
                    sx={{ width: '100%', height: 150, borderRadius: 2 }}
                />
                <Typography fontSize={16} fontWeight={700} mt={0.25}>
                    {data.server.name}
                </Typography>
                <Typography>{data.description}</Typography>
            </Stack>
            <Button
                variant="contained"
                color="primary"
                sx={{ width: '100%', padding: '14px' }}
                size="large"
                onClick={() => navigate(`edit_collab/${data.serverId}`)}
            >
                Edit Project Details
            </Button>
        </Stack>
    );
};
export default MyListItem;
