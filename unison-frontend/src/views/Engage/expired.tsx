import { useTheme } from '@mui/material/styles';
import { Button, Stack, Table, TableHead, TableCell, TableRow, TableBody, Avatar, IconButton } from '@mui/material';

import DefaultImg from 'assets/images/project.svg';
import TwitterIcon from '@mui/icons-material/Twitter';

const DataList = [
    {
        project: {
            avatar: '',
            name: 'Near Tribes'
        },
        endsIn: 'Ended on 4th Dec 2022',
        reward: 1,
        totalRewards: 10,
        claimType: 'Raffle',
        requirements: 'Like & Retweet',
        status: 'Ended',
        tweetLink: false
    },
    {
        project: {
            avatar: '',
            name: 'Near Tribes'
        },
        endsIn: 'Ended on 1st Dec 2022',
        reward: 5,
        totalRewards: 50,
        claimType: 'Raffle',
        requirements: 'Like & Retweet',
        status: 'Ended',
        tweetLink: false
    },
    {
        project: {
            avatar: '',
            name: 'Near Tribes'
        },
        endsIn: 'Ended on 10th Nov 2022',
        reward: 2,
        totalRewards: 50,
        claimType: 'Raffle',
        requirements: 'Like & Retweet',
        status: 'Ended',
        tweetLink: true
    },
    {
        project: {
            avatar: '',
            name: 'Near Tribes'
        },
        endsIn: 'Ended on 1st Nov 2022',
        reward: 5,
        totalRewards: 50,
        claimType: 'Raffle',
        requirements: 'Like & Retweet',
        status: 'Ended',
        tweetLink: true
    }
];

const Expired = () => {
    const { palette } = useTheme();

    return (
        <Stack gap={4}>
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
                        <TableCell>Project</TableCell>
                        <TableCell>Ends In</TableCell>
                        <TableCell>Reward</TableCell>
                        <TableCell>Total Rewards</TableCell>
                        <TableCell>Claim Type</TableCell>
                        <TableCell>Requirements</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Tweet Link</TableCell>
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
                            <TableCell>{row.endsIn}</TableCell>
                            <TableCell>{row.reward} Near</TableCell>
                            <TableCell>{row.totalRewards} Near</TableCell>
                            <TableCell>{row.claimType}</TableCell>
                            <TableCell>{row.requirements}</TableCell>
                            <TableCell>
                                <Button variant="contained" size="small">
                                    {row.status}
                                </Button>
                            </TableCell>
                            <TableCell>
                                <IconButton size="large" color="success" disabled={!row.tweetLink}>
                                    <TwitterIcon
                                        sx={{
                                            fill: palette.text.primary,
                                            opacity: row.tweetLink ? 1 : 0.5
                                        }}
                                    />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Stack>
    );
};
export default Expired;
