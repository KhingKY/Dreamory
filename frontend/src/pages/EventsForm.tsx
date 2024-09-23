import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Box, Typography, Card, CardContent, CardMedia, CardActions } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import moment, { Moment } from 'moment';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface EventsFormProps {
    mode: string;
}

interface IFormInput {
    event_name: string;
    event_status: string;
    event_start_date: moment.Moment | null;
    event_end_date: moment.Moment | null;
    event_location: string;
    event_image: any;
}

const EventsForm: React.FC<EventsFormProps> = ({ mode }) => {
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm<IFormInput>();
    const [fileName, setFileName] = React.useState('');
    const [endDate, setEndDate] = React.useState<Moment | null>(null);
    const [startDate, setStartDate] = React.useState<Moment | null>(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); 

    const { id } = useParams<{ id: string }>();
    const fetchEvent = () => axios.get('http://localhost:5000/api/events/' + id);
    // Fetch existing user data if id is present
    const { data, isLoading, error } = useQuery({ queryKey: ['events', id], queryFn: fetchEvent, enabled: !!id });

    // Helper function to render error messages safely
    const renderErrorMessage = (error: any) => {
        if (error && typeof error.message === 'string') {
            return error.message;
        }
        return null; // Return null if no error message is present
    };

    React.useEffect(() => {
        if (data) {
            const moment_event_start_date: Moment = moment(data.data.event_start_date);
            const moment_event_end_date: Moment = moment(data.data.event_end_date);
            setStartDate(moment_event_start_date);
            setEndDate(moment_event_end_date);
            reset(data.data); // Populate form fields with existing user data
        }
    }, [data, reset]);

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            let start_date_input;
            let end_date_input;
            if (data.event_start_date) {
                if (moment.isMoment(data.event_start_date)) {
                    start_date_input = data.event_start_date.toISOString()
                } else {
                    start_date_input = data.event_start_date
                }
            }
            if (data.event_end_date) {
                if (moment.isMoment(data.event_end_date)) {
                    end_date_input = data.event_end_date.toISOString()
                } else {
                    end_date_input = data.event_end_date
                }
            }
            // Convert image file to FormData
            const formData = new FormData();
            formData.append('event_name', data.event_name);
            formData.append('event_start_date', start_date_input || '');
            formData.append('event_end_date', end_date_input || '');
            formData.append('event_location', data.event_location);
            formData.append('event_status', data.event_status);
            if (data.event_image) {
                formData.append('event_image', data.event_image[0]); // Assuming a single file upload
            }
            console.log(formData);
            // Make the POST request
            let response;
            switch (mode) {
                case "edit":
                    response = await axios.put('http://localhost:5000/api/events/' + id, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    break;
                default:
                    response = await axios.post('http://localhost:5000/api/events/add', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    break;
            }

            // Handle the response (you can display a success message or redirect)
            alert('Form submitted successfully!');
            navigate(0);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit the form.');
        }
    };


    return (
        <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
            {/* Image Upload Field */}
            {data && data.data.event_img_location ? (
                <CardMedia
                    image={"http://localhost:5000/" + data.data.event_img_location}
                    alt="Uploaded Image"
                    component="img"
                    height="200"
                />
            ) : ''}

            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent>
                    {mode == "view" ?
                        <Typography gutterBottom variant="h5" component="div">
                            {data?.data.event_name}
                        </Typography>
                        :
                        <TextField
                            label="Event Name"
                            {...register('event_name', { required: 'Event Name is required' })}
                            error={!!errors.event_name}
                            helperText={errors.event_name ? errors.event_name.message : ''}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                    }

                    <Grid container spacing={2}>
                        {mode == "view" ?
                            <Grid size={12}>
                                <Box>
                                    <Typography align="left" variant="subtitle1" color="textSecondary">
                                        Start Date:
                                    </Typography>
                                    <Typography align="left" variant="body1">{data ? moment(data.data.event_start_date).format('DD/MM/YYYY') : ''}</Typography>
                                </Box>
                            </Grid>
                            :
                            <Controller
                                name="event_start_date"
                                control={control}
                                rules={{ required: 'Start Date is required' }}
                                render={({ field: { onChange } }) => (
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <DatePicker
                                            label="Start Date"
                                            value={startDate} // Controlled value
                                            onChange={(newValue) => {
                                                setStartDate(newValue); // Update local state
                                                onChange(newValue); // Update react-hook-form state
                                            }}
                                            slots={{
                                                textField: (params) => (
                                                    <TextField
                                                        {...params}
                                                        error={!!errors.event_start_date}
                                                        helperText={errors.event_start_date ? errors.event_start_date.message : ''}
                                                        fullWidth
                                                        margin="normal"
                                                    />
                                                )
                                            }}
                                        />
                                    </LocalizationProvider>
                                )}
                            />
                        }
                        {mode == "view" ?
                            <Grid size={12}>
                                <Box>
                                    <Typography align="left" variant="subtitle1" color="textSecondary">
                                        End Date:
                                    </Typography>
                                    <Typography align="left" variant="body1">{data ? moment(data.data.event_end_date).format('DD/MM/YYYY') : ''}</Typography>
                                </Box>
                            </Grid>
                            :
                            <Controller
                                name="event_end_date"
                                control={control}
                                rules={{ required: 'End Date is required' }}
                                render={({ field: { onChange } }) => (
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <DatePicker
                                            label="End Date"
                                            value={endDate} // Controlled value
                                            onChange={(newValue) => {
                                                setEndDate(newValue); // Update local state
                                                onChange(newValue); // Update react-hook-form state
                                            }}
                                            slots={{
                                                textField: (params) => (
                                                    <TextField
                                                        {...params}
                                                        error={!!errors.event_end_date}
                                                        helperText={errors.event_end_date ? errors.event_end_date.message : ''}
                                                        fullWidth
                                                        margin="normal"
                                                    />
                                                )
                                            }}
                                        />
                                    </LocalizationProvider>
                                )}
                            />
                        }
                        {mode == "view" ?
                            <Grid size={12}>
                                <Box>
                                    <Typography align="left" variant="subtitle1" color="textSecondary">
                                        Status:
                                    </Typography>
                                    <Typography align="left" variant="body1">{data?.data.event_status}</Typography>
                                </Box>
                            </Grid>
                            :
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Status</InputLabel>
                                <Controller
                                    name="event_status"
                                    control={control}
                                    defaultValue="ONGOING"
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            label="Status"
                                            error={!!errors.event_status}
                                        >
                                            <MenuItem value="ONGOING">Ongoing</MenuItem>
                                            <MenuItem value="COMPLETED">Completed</MenuItem>
                                        </Select>
                                    )}
                                />
                                {errors.event_status && (
                                    <p style={{ color: 'red' }}>{errors.event_status.message}</p>
                                )}
                            </FormControl>
                        }

                        {mode == "view" ?
                            <Grid size={12}>
                                <Box>
                                    <Typography align="left" variant="subtitle1" color="textSecondary">
                                        Location:
                                    </Typography>
                                    <Typography align="left" variant="body1">{data?.data.event_location}</Typography>
                                </Box>
                            </Grid>
                            :
                            <TextField
                                label="Location"
                                {...register('event_location', { required: 'Location is required' })}
                                error={!!errors.event_location}
                                helperText={errors.event_location ? errors.event_location.message : ''}
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                            />
                        }
                        {mode != "view" &&
                            <Box display="flex" justifyContent="flex-start" margin="16px 0">

                                <Controller
                                    name="event_image"
                                    control={control}
                                    defaultValue={null}
                                    render={({ field: { onChange } }) => (
                                        <>
                                            <Button
                                                component="label"
                                                variant="outlined"
                                                startIcon={<FileUploadIcon />}
                                            >
                                                Upload Event Thumbnail
                                                <input
                                                    type="file"
                                                    hidden
                                                    onChange={(event) => {
                                                        const files = event.target.files;
                                                        if (files && files.length > 0) {
                                                            onChange(files); // Update form state
                                                            setFileName(files[0].name); // Set file name for display
                                                        }
                                                    }}
                                                />
                                            </Button>
                                            {fileName && <Typography variant="body2">{fileName}</Typography>}
                                        </>
                                    )}
                                />
                                {errors.event_image && (
                                    <Typography variant="body2" style={{ color: 'red' }}>
                                        {renderErrorMessage(errors.event_image.message)}
                                    </Typography>
                                )}
                            </Box>
                        }
                    </Grid>
                </CardContent>
                {mode != "view" &&
                    <CardActions>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Submit
                        </Button>
                    </CardActions>
                }

            </form >
        </Card>

    );
};

export default EventsForm;


