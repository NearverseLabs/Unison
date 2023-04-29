import { useTheme } from '@mui/material/styles';
import { Stack, Table, TableHead, TableCell, TableRow, TableBody, Avatar } from '@mui/material';
import DefaultImg from 'assets/images/project.svg';

const DataList = [
    {
        project: {
            avatar: '',
            name: 'Near Tribes'
        },
        reward: 1
    },
    {
        project: {
            avatar: '',
            name: 'Near Tribes'
        },
        reward: 5
    },
    {
        project: {
            avatar: '',
            name: 'Near Tribes'
        },
        reward: 2
    },
    {
        project: {
            avatar: '',
            name: 'Near Tribes'
        },
        reward: 1
    }
];

const Claimed = () => {
    const { palette } = useTheme();

    return (
        <>
            <Stack gap={4}>
                <Table
                    sx={{
                        maxWidth: 315,
                        border: '1px solid #AAAAAA',
                        borderRadius: 2,
                        borderCollapse: 'unset',
                        bgcolor: palette.grey[500]
                    }}
                    aria-label="simple table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Project</TableCell>
                            <TableCell>Reward</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {DataList.map((row, i) => (
                            <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    <Stack direction="row" gap={1.25} alignItems="center">
                                        <Avatar sx={{ width: 40, height: 40 }} alt="Avatar" src={DefaultImg} />
                                        {row.project.name}
                                    </Stack>
                                </TableCell>
                                <TableCell>{row.reward} Near</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Stack>
        </>
    );
};
export default Claimed;
