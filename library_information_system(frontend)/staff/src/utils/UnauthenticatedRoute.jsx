import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth';

export const UnauthenticatedRoute = ({ element }) => {
  return !isAuthenticated() ? element : <Navigate to="/Dashboard" />;
};