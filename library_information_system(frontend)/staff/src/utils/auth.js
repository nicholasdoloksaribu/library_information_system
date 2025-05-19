import Cookies from 'js-cookie';
import { Link, useNavigate } from "react-router-dom";

export const getAccessToken = () => {
  const token = Cookies.get('access_token');
  return token;
};

export const isAuthenticated = () => {
  const authenticated = !!getAccessToken();
  return authenticated;
};

export const saveAccessToken = (token, abilities, expiresIn = 10800) => {
  const expires = new Date(Date.now() + expiresIn * 1000);
  Cookies.set('access_token', token, { expires });
  Cookies.set('ability', abilities, {expires})
};