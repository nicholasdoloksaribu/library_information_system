import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

export const LogoutComponent = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logout function called from component');
    Cookies.remove('access_token');
    Cookies.remove('ability');
    Cookies.remove('access');
    navigate("/");
  };

  return (
    <span className="font-semibold text-md cursor-pointer" onClick={handleLogout}>Log Out</span>
  );
};