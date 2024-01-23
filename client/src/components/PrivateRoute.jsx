import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {signOutUserSuccess} from '../redux/user/userSlice';

export default function PrivateRoute() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!document.cookie) {
      dispatch(signOutUserSuccess());
      //ref to sign in page using useNavigate
      navigate('/sign-in');
    }
  }, []);

  const { currentUser } = useSelector((state) => state.user);

  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;
}