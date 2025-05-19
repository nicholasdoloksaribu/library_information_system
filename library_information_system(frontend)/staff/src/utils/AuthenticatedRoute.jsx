// utils/AuthenticatedRoute.jsx
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth';
import Cookies from 'js-cookie';

export const AuthenticatedRoute = ({ element, allowedAbilities }) => {
    const userAbility = Cookies.get('ability');

    const hasRequiredAbility = () => {
        if (!allowedAbilities || allowedAbilities.length === 0) {
            return true;
        }

        if (!userAbility) {
            return false;
        }

        const decodedAbility = decodeURIComponent(userAbility);
        const userAbilitiesArray = decodedAbility.split(',');

        return allowedAbilities.some(allowed => userAbilitiesArray.includes(allowed));
    };

    return isAuthenticated() && hasRequiredAbility() ? element : <Navigate to="/" />;
};