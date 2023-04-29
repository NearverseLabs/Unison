import { useTheme } from '@mui/material/styles';
import { Button, Stack, Typography } from '@mui/material';

import { useNavigate } from 'react-router-dom';

const RequestSuccessfull = () => {
    const navigate = useNavigate();
    const { palette } = useTheme();
    const handleClick = () => navigate('/collab');

    return (
        <>
            <Stack gap={4}>
                <Stack direction="row" gap="12px" sx={{ cursor: 'pointer' }} onClick={() => navigate('/collab/request_bot')}>
                    <Typography color="grey.100">{`<`}</Typography>
                    <Typography color="grey.100">Go Back</Typography>
                </Stack>
                <Stack
                    sx={{
                        width: 496,
                        padding: '33px 40px',
                        gap: 1.5,
                        bgcolor: palette.common.white,
                        borderRadius: 2.5
                    }}
                >
                    <Typography color="text.primary" sx={{ fontSize: 24, fontWeight: 600 }}>
                        Successfully Imported Bot!
                    </Typography>
                    <Typography color="text.secondary" sx={{ fontSize: 14, fontWeight: 400 }}>
                        Cursus vel sem eu, ullamcorper lobortis nunc. Aenean nisl libero, dictum et lectus id, ultrices ultricies sem.
                    </Typography>
                    <Button variant="contained" color="primary" size="medium" sx={{ width: 175, mt: 1.5 }} onClick={handleClick}>
                        Back to Collabboard
                    </Button>
                </Stack>
            </Stack>
        </>
    );
};
export default RequestSuccessfull;
