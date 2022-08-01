import { useMutation } from '@apollo/client';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../context/auth';
import { UPDATE_USER } from '../utils/graphqlMutations';

function Profile() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Auth);
  const { user } = state;

  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [resData, setResData] = useState({});
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    username: user.username || '',
    email: user.email || '',
    password: '',
    confirmPassword: '',
    image: user.image || '',
  });

  const onChangeFile = (e) => {
    if (e.target.files[0].type !== 'image/jpeg') {
      alert('Only .jpeg fromat allowed');
      return;
    }
    var file = new File([e.target.files[0]], user.username + '.jpg', {
      type: 'image/jpeg',
    });

    setImage(file);
    if (e.target.files && e.target.files[0]) {
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    update(_, { data: { register: userData } }) {
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
    if (!user.username) {
      navigate('/');
    }
  }, [user, navigate]);
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const submit = (e) => {
    e.preventDefault();
    updateUser();
  };

  const submit1 = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('choose an image');
      return;
    }
    const formData = new FormData();

    formData.append('image', image);

    const result = await axios({
      method: 'post',
      url: window.location.origin.slice(0, -4) + '5000/profiless',
      data: formData,
      enctype: 'multipart/form-data',
    });
    navigate('/');
    window.location.reload(false);
  };

  return (
    <div>
      <div className="form">
        <form onSubmit={submit1}>
          <ul className="form-container">
            <li>
              <h4>Add Image</h4>
            </li>
            {false && <div className="loader"></div>}
            <li>
              <label htmlFor="file">Image</label>
              <input
                type="file"
                name="file"
                id="file"
                onChange={onChangeFile}
              ></input>
            </li>
            <li>
              {imageUrl && (
                <img
                  className="image-post-upload"
                  src={imageUrl}
                  alt="Preview"
                />
              )}
            </li>
            <li>
              <button type="submit" className="button primary">
                Update image
              </button>
            </li>
          </ul>
        </form>
        <form onSubmit={submit}>
          <ul className="form-container">
            <li>
              <h4>Update Account</h4>
            </li>
            {loading && <div className="loader"></div>}
            <li>
              <label htmlFor="username">Name</label>
              <input
                type="name"
                name="username"
                id="username"
                value={values.username}
                disabled
              ></input>
            </li>
            <li>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={values.email}
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
                Update
              </button>
            </li>
            <li></li>
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
    </div>
  );
}

export default Profile;
