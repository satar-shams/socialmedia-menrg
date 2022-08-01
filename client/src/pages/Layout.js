import { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Auth } from '../context/auth';

const Layout = () => {
  const { state, dispatch } = useContext(Auth);
  const { user } = state;

  const logOutHandler = () => {
    dispatch({
      type: 'LOG_OUT',
    });
  };
  return (
    <>
      <header className="header">
        <div className="left">
          {/* <button>&#9776;</button> */}
          <Link to="/"> Home</Link>
        </div>
        <div className="header-links">
          {user.username ? (
            <>
              <Link to="/addpost">Add Post</Link>
              <Link to={`/profile/${user.username}`}>
                <img
                  className="cart-header-image"
                  src={`/images/profiles/${user.image}`}
                  alt=""
                />
                {user.username}
              </Link>
              <Link onClick={logOutHandler} to="/login">
                Log Out
              </Link>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Log in</Link>
            </>
          )}
        </div>
      </header>

      <Outlet />
    </>
  );
};

export default Layout;
