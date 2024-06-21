import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const storedData = localStorage.getItem('persist:root');
  const parsedData = JSON.parse(storedData);
  const user = JSON.parse(parsedData.user);
  const currentUser = user.currentUser;
  // console.log(currentUser.role);


  if (currentUser.role !== 'admin') {
    return <Navigate to="/field" />;
  }

  return <Outlet />;
};

export default AdminRoute;
