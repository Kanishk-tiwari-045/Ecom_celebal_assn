import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    // You can replace this with your own spinner or skeleton
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
        {/* Or: <span>Loading...</span> */}
      </div>
    );
  }

  if (!user) {
    // Redirect to login and save the current path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
