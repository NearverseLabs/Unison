import { Button, Divider, Stack, Typography, Select, MenuItem, TextField } from '@mui/material';

import { useNavigate } from 'react-router-dom';

const NewCampaign = () => {
    const navigate = useNavigate();
    return (
        <>
            <Stack gap={4}>
                <Stack
                    direction="row"
                    gap="12px"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                        navigate('/engage');
                    }}
                >
                    <Typography color="grey.100">{`<`}</Typography>
                    <Typography color="grey.100">Go Back</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Stack gap="14px">
                        <Typography color="text.primary" sx={{ fontSize: 24, fontWeight: 600 }}>
                            Create New Campaign
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontSize: 14, fontWeight: 400 }}>
                            Fill Your Collaboration Details
                        </Typography>
                    </Stack>
                    <Stack justifyContent="center">
                        <Button variant="contained" color="primary" size="medium">
                            Create New Campaign
                        </Button>
                    </Stack>
                </Stack>
                <Divider />
                <Stack
                    gap={4}
                    sx={{
                        '& .req-title': {
                            fontWeight: 600,
                            fontSize: 16,
                            color: 'text.primary'
                        },
                        '& .req-small-tle': {
                            fontWeight: 400,
                            fontSize: 14,
                            color: 'text.secondary'
                        },
                        '& .req-input': {
                            width: 454
                        }
                    }}
                >
                    <Stack direction="row" gap={9.5}>
                        <Stack gap={1} width={198}>
                            <Typography className="req-title">Project /Username*</Typography>
                            <Typography className="req-small-tle">Your Future Collab Partner</Typography>
                        </Stack>
                        <Stack justifyContent="center">
                            <TextField hiddenLabel defaultValue="Near Tribes" className="req-input" size="small" />
                        </Stack>
                    </Stack>
                    <Stack direction="row" gap={9.5}>
                        <Stack gap={1} width={198}>
                            <Typography className="req-title">ClaimType *</Typography>
                            <Typography className="req-small-tle">viverra cursus non elementum .</Typography>
                        </Stack>
                        <Stack justifyContent="center">
                            <Select id="demo-simple-select" value={1} sx={{ height: 40 }} className="req-input">
                                <MenuItem value={1}>Raffle</MenuItem>
                                <MenuItem value={2}>Twenty</MenuItem>
                            </Select>
                        </Stack>
                    </Stack>
                    <Stack direction="row" gap={9.5}>
                        <Stack gap={1} width={198}>
                            <Typography className="req-title">Requirements *</Typography>
                            <Typography className="req-small-tle">Etiam in mauris sit amet turpis</Typography>
                        </Stack>
                        <Stack justifyContent="center">
                            <Select id="demo-simple-select" value={1} sx={{ height: 40 }} className="req-input">
                                <MenuItem value={1}>Like & Retweet</MenuItem>
                                <MenuItem value={2}>Twenty</MenuItem>
                            </Select>
                        </Stack>
                    </Stack>
                    <Stack direction="row" gap={9.5}>
                        <Stack gap={1} width={198}>
                            <Typography className="req-title">Reward*</Typography>
                            <Typography className="req-small-tle">Choose no of open spots</Typography>
                        </Stack>
                        <Stack justifyContent="center">
                            <TextField hiddenLabel defaultValue="" className="req-input" size="small" />
                        </Stack>
                    </Stack>
                    <Stack direction="row" gap={9.5}>
                        <Stack gap={1} width={198}>
                            <Typography className="req-title">Total Rewards*</Typography>
                            <Typography className="req-small-tle">Choose no of open spots</Typography>
                        </Stack>
                        <Stack justifyContent="center">
                            <TextField hiddenLabel defaultValue="" className="req-input" size="small" />
                        </Stack>
                    </Stack>
                    &ngsp;
                    <Stack direction="row" gap={9.5}>
                        <Stack gap={1} width={198}>
                            <Typography className="req-title">Time*</Typography>
                            <Typography className="req-small-tle">Choose no of open spots</Typography>
                        </Stack>
                        <Stack justifyContent="center">
                            <TextField hiddenLabel defaultValue="" className="req-input" size="small" />
                        </Stack>
                    </Stack>
                    &ngsp;
                    <Stack direction="row" gap={9.5}>
                        <Stack gap={1} width={198}>
                            <Typography className="req-title">Tweet Link*</Typography>
                            <Typography className="req-small-tle">Choose no of open spots</Typography>
                        </Stack>
                        <Stack justifyContent="center">
                            <TextField hiddenLabel defaultValue="" className="req-input" size="small" />
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </>
    );
};
export default NewCampaign;
