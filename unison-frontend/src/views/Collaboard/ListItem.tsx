import { Box, Button, Divider, Stack, Typography, useTheme } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import { DiscordIcon } from 'ui-component/SvgIcon';

import DefaultImage from 'assets/images/default.png';
import { useNavigate } from 'react-router-dom';
import { ProjectStatusValue, CollabStatusValue } from 'components';
import { useSelector } from 'store';

const ListItem = ({ data }: { data: any }) => {
    const { palette } = useTheme();
    const navigate = useNavigate();
    const handleApplyClick = (id: string) => navigate(`${id}`);

    const { user } = useSelector((state) => state.auth);
    return (
        <Stack
            sx={{
                p: 3,
                gap: 3,
                minWidth: 331,
                width: 331,
                minHeight: 610,
                height: 610,
                bgcolor: '#F1F1F1',
                border: '1px solid #E7E7E7',
                alignItems: 'center'
            }}
        >
            <Stack
                sx={{
                    gap: '14px',
                    alignItems: 'center',
                    textAlign: 'center',
                    width: '100%',
                    position: 'relative'
                }}
            >
                <Box
                    component="img"
                    src={
                        data.server.icon
                            ? `https://cdn.discordapp.com/icons/${data.serverId}/${data.server.icon}.png?size=1024`
                            : DefaultImage
                    }
                    sx={{
                        width: '100%',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        backgroundSize: 'cover',
                        height: '10rem'
                    }}
                />
                <Typography fontSize={16} fontWeight={700} mt={0.25}>
                    {data.server.name}
                </Typography>
                <Typography>{data.description}</Typography>
                {data.userType === 2 && (
                    <Stack
                        sx={{
                            position: 'absolute',
                            background: '#01C29A',
                            top: '0',
                            right: '0',
                            width: '110px',
                            height: '28px',
                            color: '#FFFFFF'
                        }}
                    >
                        Influencer
                    </Stack>
                )}
                {data.userType === 3 && (
                    <Stack
                        sx={{
                            position: 'absolute',
                            background: '#01C29A',
                            top: '0',
                            right: '0',
                            width: '110px',
                            height: '28px',
                            color: '#FFFFFF'
                        }}
                    >
                        DAO
                    </Stack>
                )}
            </Stack>
            <Divider sx={{ borderColor: palette.grey[600] }} />
            <Stack gap={4} width="100%">
                <Stack
                    sx={{
                        gap: 2,
                        '& div': {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            '& p': {
                                fontSize: '12px'
                            }
                        }
                    }}
                >
                    <Stack>
                        <Typography>Project Status</Typography>
                        <Typography>{ProjectStatusValue[data.projectStatus - 1].name}</Typography>
                    </Stack>
                    <Stack>
                        <Typography>Collabs</Typography>
                        <Stack alignItems="center" gap={1}>
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    bgcolor: data.collabStatus === 1 ? '#01C29A' : 'red',
                                    borderRadius: '100px'
                                }}
                            />
                            <Typography>{CollabStatusValue[data.collabStatus - 1].name}</Typography>
                        </Stack>
                    </Stack>

                    <Stack>
                        <Typography>Server Id</Typography>
                        <Typography>{data.serverId}</Typography>
                    </Stack>
                </Stack>
                <Stack gap={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ width: '100%' }}
                        size="large"
                        disabled={user.userid === data.userId || data.collabStatus === 2}
                        onClick={() => handleApplyClick(data._id)}
                    >
                        Apply for collab
                    </Button>
                    <Divider sx={{ borderColor: palette.grey[600] }} />
                    <Stack alignItems="center">
                        <Stack
                            sx={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: 97,
                                '& svg': {
                                    width: 30,
                                    fill: 'rgb(20, 21, 34)',
                                    height: 25
                                }
                            }}
                        >
                            <TwitterIcon
                                sx={{ cursor: 'pointer' }}
                                onClick={() => window.open(`https://twitter.com/${data.twitterLink}`, '_black')}
                            />
                            <Stack
                                sx={{ cursor: 'pointer' }}
                                onClick={() => window.open(`https://discord.gg/${data.discordLink}`, '_black')}
                            >
                                <DiscordIcon />
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
};
export default ListItem;
