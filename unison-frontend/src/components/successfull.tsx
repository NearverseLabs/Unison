import { useTheme } from '@mui/material/styles';
import { Button, Stack, Typography, Select, MenuItem } from '@mui/material';

const RequestSuccessfull = ({ handleClick, roleoptions, form, setForm }: any) => {
    const { palette } = useTheme();
    return (
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

            <Stack direction="row" gap={9.5}>
                <Stack gap={1} width={198}>
                    <Typography className="req-title">Role *</Typography>
                    <Typography className="req-small-tle">This is role</Typography>
                </Stack>
                <Stack justifyContent="center">
                    <Select
                        id="demo-simple-select"
                        value={form.roleId}
                        sx={{ height: 40 }}
                        className="req-input"
                        onChange={(e) => {
                            setForm({ ...form, roleId: e.target.value });
                        }}
                    >
                        {roleoptions.map((row: any) => (
                            <MenuItem key={row.value} value={row.value}>
                                {row.label}
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>
            </Stack>

            <Button variant="contained" color="primary" size="medium" sx={{ width: 175, mt: 1.5 }} onClick={handleClick}>
                Update Role
            </Button>
        </Stack>
    );
};
export default RequestSuccessfull;
