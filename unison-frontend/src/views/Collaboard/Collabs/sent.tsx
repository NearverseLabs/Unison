import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    Button,
    Divider,
    Stack,
    Typography,
    Table,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    Avatar,
    Badge,
    Modal,
    Box,
    TextareaAutosize
} from '@mui/material';
import DefaultImg from 'assets/images/project.svg';
import useApi from 'hooks/userApi';
import { CollabTypeValue, FormatValue, InFLCollabTypeValue, PageSize } from 'components';
import ClearIcon from '@mui/icons-material/Clear';
import Pagination from '@mui/material/Pagination';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24
};

const backgrounds: any = {
    0: 'orange',
    1: 'green',
    2: 'red',
    undefined: ''
};

const statusData: any = {
    0: 'Pending',
    1: 'Approved',
    2: 'Rejected',
    undefined: ''
};

const Received = () => {
    const { palette } = useTheme();
    const { getSentCollabs } = useApi();

    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [totalPage, setTotalPage] = useState(0);
    const [collabs, setCollabs] = useState<any[]>([]);
    const [collabitem, setCollabitem] = useState({
        _id: '',
        status: 0,
        userId: '',
        description: ''
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const getMyCollabsAPI = async () => {
        const pageSize = PageSize;
        const { data } = await getSentCollabs({ page, pageSize });
        setTotalPage(Math.ceil(data.count / pageSize));
        setCollabs(data.results);
    };

    useEffect(() => {
        getMyCollabsAPI();
        // eslint-disable-next-line
    }, [page]);

    return (
        <>
            <Stack direction="row" justifyContent="space-between">
                <Stack gap="14px">
                    <Typography color="text.primary" sx={{ fontSize: 24, fontWeight: 600 }}>
                        Sent Collab Requests
                    </Typography>
                </Stack>
            </Stack>
            <Table
                sx={{
                    minWidth: 650,
                    border: '1px solid #AAAAAA',
                    borderRadius: 2,
                    borderCollapse: 'unset',
                    bgcolor: palette.grey[500]
                }}
                aria-label="simple table"
            >
                <TableHead>
                    <TableRow>
                        <TableCell>From</TableCell>
                        <TableCell>To</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Format</TableCell>
                        <TableCell>Spots</TableCell>
                        <TableCell>status</TableCell>
                        <TableCell>Requested By </TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {collabs.map((row, i) => (
                        <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                <Stack direction="row" gap={1.25} alignItems="center">
                                    <Avatar
                                        sx={{ width: 40, height: 40 }}
                                        alt="Avatar"
                                        src={
                                            row.rqserver.length
                                                ? `https://cdn.discordapp.com/icons/${row.rqserver[0].id}/${row.rqserver[0].icon}.png?size=1024`
                                                : DefaultImg
                                        }
                                    />
                                    {row.rqserver.length ? row.rqserver[0].name : 'others'}
                                </Stack>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <Stack direction="row" gap={1.25} alignItems="center">
                                    <Avatar
                                        sx={{ width: 40, height: 40 }}
                                        alt="Avatar"
                                        src={
                                            row.server.icon
                                                ? `https://cdn.discordapp.com/icons/${row.server.id}/${row.server.icon}.png?size=1024`
                                                : DefaultImg
                                        }
                                    />
                                    {row.server.name}
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Button variant="contained" size="small">
                                    {row.project.userType === 1
                                        ? CollabTypeValue[row.collabType - 1].name
                                        : InFLCollabTypeValue[row.collabType - 1].name}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="contained" size="small">
                                    {FormatValue[row.format - 2] && FormatValue[row.format - 2].name}
                                </Button>
                            </TableCell>
                            <TableCell>{row.openedSpots}</TableCell>
                            <TableCell
                                sx={{
                                    '& .MuiBadge-badge': {
                                        background: backgrounds[row.status]
                                    }
                                }}
                            >
                                <Badge color="primary" overlap="circular" badgeContent={statusData[row.status]} />
                            </TableCell>
                            <TableCell>
                                <Stack direction="row" gap={1.25} alignItems="center">
                                    <Avatar
                                        sx={{ width: 40, height: 40 }}
                                        alt="Avatar"
                                        src={`https://cdn.discordapp.com/avatars/${row.user.userid}/${row.user.avatar}.png`}
                                    />
                                    {row.user.username}#{row.user.discriminator}
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Stack direction="row" gap={1.5}>
                                    <Button
                                        onClick={() => {
                                            handleOpen();
                                            setCollabitem(row);
                                        }}
                                        variant="contained"
                                        size="small"
                                        sx={{ padding: '4px 16px' }}
                                    >
                                        View Description
                                    </Button>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Stack sx={{ alignItems: 'flex-end' }}>
                <Pagination page={page} count={totalPage} onChange={(e, p) => setPage(p)} variant="outlined" shape="rounded" />
            </Stack>
            <Divider />
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Stack
                        sx={{
                            background: 'black',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            padding: '0 0.5rem'
                        }}
                    >
                        <Typography style={{ color: 'white' }}>Approve/Reject Collab</Typography>
                        <Typography sx={{ cursor: 'pointer' }} onClick={handleClose}>
                            <ClearIcon />
                        </Typography>
                    </Stack>
                    <Stack sx={{ padding: '1rem' }}>
                        <Stack display="block">
                            <Stack gap={1} sx={{ width: '100%' }}>
                                <Typography className="req-title">Request Description/</Typography>
                                <Typography className="req-title">Announcement Detail ( Form WL Collab)</Typography>
                            </Stack>
                            <Stack style={{ width: '100%' }}>
                                <TextareaAutosize
                                    style={{
                                        font: 'inherit',
                                        letterSpacing: 'inherit',
                                        boxSizing: 'content-box',
                                        background: 'none',
                                        height: '2.4375em',
                                        margin: '0',
                                        display: 'block',
                                        width: '100%',
                                        animationDuration: '10ms',
                                        color: '#54577A',
                                        borderRadius: '4px',
                                        overflow: 'auto'
                                    }}
                                    value={collabitem.description}
                                    disabled
                                />
                            </Stack>
                        </Stack>
                        <Stack
                            sx={{
                                padding: '1rem',
                                justifyContent: 'space-between'
                            }}
                            direction="row"
                            gap={1.5}
                        >
                            <>
                                <Button color="success" variant="contained" disabled size="small" sx={{ padding: '4px 16px' }}>
                                    Approve
                                </Button>
                                <Button color="error" variant="contained" disabled size="small" sx={{ padding: '4px 16px' }}>
                                    Reject
                                </Button>
                            </>
                        </Stack>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
};
export default Received;
