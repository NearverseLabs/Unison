import { Stack, Typography, Avatar } from '@mui/material';
import { useSelector } from 'store';

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <Stack gap="43px">
            <Stack direction="row" gap={3} alignItems="center">
                <Avatar
                    sx={{ width: 52, height: 52 }}
                    alt="Avatar"
                    src={`https://cdn.discordapp.com/avatars/${user.userid}/${user.avatar}.png`}
                />
                <Stack gap={1}>
                    <Typography fontSize={24} fontWeight={600}>
                        Hi, {user.username}
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    );
};
export default ProfilePage;
