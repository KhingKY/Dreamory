import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Box, AppBar, Toolbar, Button, IconButton, Container, Divider, MenuItem, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Link, useNavigate } from 'react-router-dom';



const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: alpha(theme.palette.background.default, 0.4),
    boxShadow: theme.shadows[1],
    padding: '8px 12px',
}));

export default function Header() {
    const navigate = useNavigate();

    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const logOut = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    };

    return (
        <AppBar
            position="fixed"
            sx={{ boxShadow: 0, bgcolor: 'transparent', backgroundImage: 'none', mt: 10 }}
        >
            <Container maxWidth="lg">

                <StyledToolbar variant="dense" disableGutters>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Link to="/">
                                <Button variant="text" color="info" size="small">
                                    Events
                                </Button>
                            </Link>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        {localStorage.getItem('token') ?
                            <MenuItem>
                                <Button color="error" variant="outlined" fullWidth onClick = {logOut}>
                                    Log Out
                                </Button>
                            </MenuItem>
                            :
                            <>
                                <Link to="/signin">
                                    <Button color="primary" variant="text" size="small">
                                        Sign in
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button color="primary" variant="contained" size="small">
                                        Sign up
                                    </Button>
                                </Link>
                            </>
                        }
                    </Box>
                    <Box sx={{ display: { sm: 'flex', md: 'none' } }}>
                        <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer anchor="top" open={open} onClose={toggleDrawer(false)}>
                            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <IconButton onClick={toggleDrawer(false)}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                </Box>
                                <Divider sx={{ my: 3 }} />
                                <MenuItem>Events</MenuItem>
                                <MenuItem>Users</MenuItem>
                                {localStorage.getItem('token') ?
                                    <MenuItem>
                                        <Button color="error" variant="outlined" fullWidth>
                                            Log Out
                                        </Button>
                                    </MenuItem>
                                    :
                                    <>
                                        <MenuItem>
                                            <Link to="/signin">
                                                <Button color="primary" variant="contained" fullWidth>
                                                    Sign up
                                                </Button>
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link to="/signup">
                                                <Button color="primary" variant="outlined" fullWidth>
                                                    Sign in
                                                </Button>
                                            </Link>
                                        </MenuItem>
                                    </>
                                }
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>

            </Container>
        </AppBar>
    );
}