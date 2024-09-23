import React from 'react';
import './App.css';
import { Container, Box } from '@mui/material';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventsForm from './pages/EventsForm';
import EventsList from './pages/EventsList';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

function App() {
	return (
		<div className="App">
			<Router>
				<Header />
				<Box
            id="hero"
            sx={(theme) => ({
                width: '100%',
                backgroundRepeat: 'no-repeat',

                backgroundImage:
                    'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
                ...theme.applyStyles('dark', {
                    backgroundImage:
                        'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
                }),
            })}
        >
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pt: { xs: 14, sm: 20 },
                    pb: { xs: 8, sm: 12 },
                }}
            >
				<Routes>
					<Route path="/" element={<EventsList />} />
					<Route path="/event/add" element={<EventsForm mode="add" />} />
					<Route path="/event/edit/:id" element={<EventsForm mode="edit" />} />
					<Route path="/event/view/:id" element={<EventsForm mode="view" />} />
					<Route path="/event/:id" element={<EventsForm mode="view" />} />
					<Route path="/signup" element={<SignUp />} />
					<Route path="/signin" element={<SignIn/>} />
				</Routes>
				</Container>
        </Box>
			</Router>
		</div>
	);
}

export default App;
