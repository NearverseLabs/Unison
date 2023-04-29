import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Stack, Typography, Table, TableHead, TableCell, TableRow, TableBody, Avatar } from '@mui/material';
import DefaultImg from 'assets/images/project.svg';
import useApi from 'hooks/userApi';
import Pagination from '@mui/material/Pagination';
import { CollabTypeValue, FormatValue, InFLCollabTypeValue, PageSize } from 'components';

const Progress = () => {
    const { palette } = useTheme();
    const { getProgressCollabs } = useApi();
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [collabs, setCollabs] = useState<any[]>([]);

    const getCollabs = async () => {
        const { data } = await getProgressCollabs({ page, pageSize: PageSize });
        setTotalPage(Math.ceil(data.count / PageSize));
        setCollabs(data.results);
    };

    useEffect(() => {
        getCollabs();
        // eslint-disable-next-line
    }, [page]);

    return (
        <>
            <Stack direction="row" justifyContent="space-between">
                <Stack gap="14px">
                    <Typography color="text.primary" sx={{ fontSize: 24, fontWeight: 600 }}>
                        Collabs In Progress
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
                        <TableCell>Requested By</TableCell>
                        <TableCell>Status</TableCell>
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
                                    <Button variant="contained" size="small" sx={{ padding: '4px 16px' }}>
                                        IN Progress
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
        </>
    );
};
export default Progress;
