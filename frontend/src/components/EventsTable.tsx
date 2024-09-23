import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Box, Stack, IconButton, Button, TablePagination, TableFooter
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import useFetchData from '../hooks/useFetchData';
import axios from 'axios';
import FilterButton from './FilterButton';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';

interface Events {
    _id: string;
    event_name: string;
    event_status: string;
    event_location: string;
}
const token = localStorage.getItem('token'); 

const fetchEvents = () => axios.get('http://localhost:5000/api/events/getAll', {
    headers: {
        Authorization: `Bearer ${token}`
      }
});

const EventsTable: React.FC = () => {
    const { data, isLoading, error } = useFetchData<Events[]>(['events'], fetchEvents);
    const filterOptions = ['All', 'Ongoing', 'Completed'];
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [deletedEventID, setDeletedEventID] = React.useState('');

    const handleDelete = (id:string) => {
        setDialogOpen(true);
        setDeletedEventID(id);
    };

    const handleCancel = () => {
        setDialogOpen(false);
    };

    const navigate = useNavigate();

    const goToAddPage = () => {
        navigate('/event/add');
    };
    //TODO: encrypt id when redirecting
    const goToViewPage = (id:string) => {
        navigate('/event/view/'+id);
    };
    const goToEditPage = (id:string) => {
        navigate('/event/edit/'+id);
    };

    const deleteEvent = async (id:string) => {
        
        try {
            setDialogOpen(false);
            
            const response = await axios.delete('http://localhost:5000/api/events/' + id, {
                headers: {
                    Authorization: `Bearer ${token}`
                  }
            });

            // Handle the response (you can display a success message or redirect)
            alert('Event Deleted successfully!');
            navigate(0);
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event.');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return (
        <>
            <ConfirmDialog
                open={dialogOpen}
                title="Delete Confirmation"
                content="Are you sure you want to delete this event?"
                onConfirm={() => deleteEvent(deletedEventID)}
                onCancel={handleCancel}
            />
            <Stack
                spacing={2}
                useFlexGap
                sx={{ alignItems: 'flex-end', width: { xs: '100%', sm: '70%' }, pb: { xs: 2, sm: 3 } }}
            >
                <Box
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        gap: 1,
                        alignItems: 'flex-end',
                    }}
                >
                    <FilterButton options={filterOptions} ></FilterButton>
                    <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={goToAddPage}>
                        Add Event
                    </Button>
                </Box>
            </Stack>
            <Stack
                spacing={2}
                useFlexGap
                sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
            >

                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.map((event: Events) => (
                                <TableRow key={event._id}>
                                    <TableCell>{event.event_name}</TableCell>
                                    <TableCell>{event.event_status}</TableCell>
                                    <TableCell>{event.event_location}</TableCell>
                                    <TableCell>
                                        <IconButton aria-label="delete" size="small">
                                            <VisibilityIcon fontSize="inherit" onClick={() => goToViewPage(event._id)}/>
                                        </IconButton>
                                        <IconButton aria-label="delete" size="small" onClick={() => goToEditPage(event._id)}>
                                            <EditIcon fontSize="inherit" />
                                        </IconButton>
                                        <IconButton aria-label="delete" size="small" onClick={() => handleDelete(event._id)}>
                                            <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                {/* <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                        colSpan={3}
                                        count={data != undefined ? data.length : 0}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        slotProps={{
                                            select: {
                                                inputProps: {
                                                    'aria-label': 'rows per page',
                                                },
                                                native: true,
                                            },
                                        }}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        ActionsComponent={TablePaginationActions}
                                    /> */}
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Stack>
        </>
    );
};

export default EventsTable;