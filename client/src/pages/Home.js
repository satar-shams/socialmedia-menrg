import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { FETCH_POSTS_QUERY } from '../utils/graphqlQuery';
import LikeButton from '../components/LikeButton';
import { Auth } from '../context/auth';
import DeleteButton from '../components/DeleteButton';
import moment from 'moment';

function Home() {
  const { state } = useContext(Auth);
  const { user } = state;

  const { loading, data: { getPosts: posts } = {} } =
    useQuery(FETCH_POSTS_QUERY);

  return (
    <div>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <main className="main">
          <div className="content">
            <h2 style={{ textAlign: 'center' }}>Recent Posts</h2>
            <ul className="carts">
              {posts.map((post) => (
                <li key={post.id}>
                  <div className="cart">
                    <div className="cart-header">
                      <div>
                        <Link to={`/profile/${post.username}`}>
                          <img
                            className="cart-header-image"
                            src={`/images/profiles/${post.image}`}
                            alt={'user'}
                          />
                        </Link>

                        <span className="cart-hearder-username">
                          {post.username}
                        </span>
                      </div>

                      <div>
                        {user && user.username === post.username && (
                          <DeleteButton postId={post.id} />
                        )}
                      </div>
                    </div>
                    <div>
                      <Link to={`/post/${post.id}`}>
                        <img
                          className="cart-image"
                          src={`/images/posts/${post.postImage}`}
                          alt="cart"
                        />
                      </Link>
                    </div>
                    <div className="cart-action">
                      <div>
                        <LikeButton
                          user={user}
                          post={{
                            id: post.id,
                            likes: post.likes,
                            likeCount: post.likeCount,
                          }}
                        />
                        <Link to={`/post/${post.id}`}>
                          <i
                            style={{ color: 'blue' }}
                            class="fa-regular fa-comment"
                          ></i>{' '}
                        </Link>
                        <span className="comment-count">
                          {' '}
                          {post.commentCount}{' '}
                        </span>{' '}
                      </div>
                      <div>{moment(post.createdAt).fromNow(true)} ago</div>
                    </div>
                    <div>{post.body}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </main>
      )}
    </div>
  );
}

export default Home;
