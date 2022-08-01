import { useMutation } from '@apollo/client';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../context/auth';
import { CREATE_POST_MUTATION } from '../utils/graphqlMutations';
import { FETCH_POSTS_QUERY } from '../utils/graphqlQuery';
import axios from 'axios';

function AddPostForm() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Auth);
  const { user } = state;

  useEffect(() => {
    if (!user.username) {
      navigate('/');
    }
  }, [user, navigate]);

  const [values, setValues] = useState({
    image: '',
    body: '',
  });
  const [image, setImage] = useState('');

  const [imageUrl, setImageUrl] = useState('');

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });

      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      values.body = '';
      values.image = '';
      navigate('/');
    },
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onChangeFile = (e) => {
    setImage(e.target.files[0]);
    if (e.target.files && e.target.files[0]) {
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  useEffect(() => {
    if (values.image) {
      createPost();
    }
  }, [values.image]);

  const submit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('choose an image');
      return;
    }
    const formData = new FormData();
    formData.append('image', image);

    const result = await axios({
      method: 'post',
      url: window.location.origin.slice(0, -4) + '5000/single',
      data: formData,
      enctype: 'multipart/form-data',
    });
    setValues({ ...values, image: result.data });
  };
  return (
    <div className="form">
      <form onSubmit={submit}>
        <ul className="form-container">
          <li>
            <h4>Add Post</h4>
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
              <img className="image-post-upload" src={imageUrl} alt="Preview" />
            )}
          </li>
          <li>
            <label htmlFor="body">Body</label>
            <input
              type="text"
              name="body"
              id="body"
              onChange={onChange}
            ></input>
          </li>
          <li>
            <button type="submit" className="button primary">
              Add post
            </button>
          </li>
        </ul>

        {error && (
          <ul>
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        )}
      </form>
    </div>
  );
}

export default AddPostForm;
