import { useMutation } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Auth } from '../context/auth';
import { LOGIN_USER } from '../utils/graphqlMutations';

function Login() {
  const navigate = useNavigate();

  const { state, dispatch } = useContext(Auth);
  const { user } = state;
  const [resData, setResData] = useState({});
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    if (user.username) {
      navigate('/');
    }
  }, [user, navigate]);

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      localStorage.setItem('userData', JSON.stringify(userData));

      setResData(userData);
      dispatch({
        type: 'LOG_IN',
        payload: userData,
      });
      setErrors({});
      window.location.reload(false);
      navigate('/');
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <div className="form">
      <form onSubmit={submit}>
        <ul className="form-container">
          <li>
            <h4>Create Account</h4>
          </li>
          <li>{loading && <div className="loader"></div>}</li>
          <li>
            <label htmlFor="username">Name</label>
            <input
              type="name"
              name="username"
              id="username"
              onChange={onChange}
            ></input>
          </li>
          <li>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={onChange}
            ></input>
          </li>
          <li>
            <button type="submit" className="button primary">
              Login
            </button>
          </li>
        </ul>

        {Object.keys(errors).length > 0 && (
          <div>
            <ul>
              <h1>errors</h1>
              {Object.values(errors).map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;
