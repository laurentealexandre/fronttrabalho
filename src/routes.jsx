import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EventList from './pages/EventList';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';  
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route 
                path="/events/create" 
                element={
                    <PrivateRoute>
                        <CreateEvent />
                    </PrivateRoute>
                } 
            />
            <Route 
                path="/events/edit/:id" 
                element={
                    <PrivateRoute>
                        <EditEvent />
                    </PrivateRoute>
                } 
            />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};

export default AppRoutes;