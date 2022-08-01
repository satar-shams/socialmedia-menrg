import { useMutation } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Auth } from '../context/auth';
import { REGISTER_USER } from '../utils/graphqlMutations';

function Register() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Auth);
  const { user } = state;

  const [resData, setResData] = useState({});
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: '',
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      dispatch({
        type: 'LOG_IN',
        payload: userData,
      });

      setErrors({});
      navigate('/');
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  useEffect(() => {
    if (user.username) {
      navigate('/');
    }
  }, [user, navigate]);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onChange1 = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
      ['image']: e.target.value + '.jpg',
    });

    console.log(values);
  };

  const submit = (e) => {
    e.preventDefault();
    addUser();
  };

  return (
    <div className="form">
      <form onSubmit={submit}>
        <ul className="form-container">
          <li>
            <h4>Create Account</h4>
          </li>
          {loading && <div className="loader"></div>}
          <li>
            <label htmlFor="username">Name</label>
            <input
              type="name"
              name="username"
              id="username"
              onChange={onChange1}
            ></input>
          </li>
          <li>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
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
            <label htmlFor="confirmPassword">Re-Enter Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              onChange={onChange}
            ></input>
          </li>
          <li>
            <button type="submit" className="button primary">
              Register
            </button>
          </li>
          <li>
            Already have an account?
            <Link to="/login" className="button secondary text-center">
              Login your Social Media account
            </Link>
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

export default Register;
