'use client';

import { useOptimistic } from 'react';
import Image, { type ImageLoaderProps } from 'next/image';

import { formatDate } from '@/lib/format';
import LikeButton from './like-icon';
import { togglePostLikeStatus } from '@/actions/posts';
import type { Post as PostType } from '@/lib/posts';

function imageLoader(config: ImageLoaderProps): string {
  const [urlStart, urlEnd] = config.src.split('upload/');
  const transformations = `w_200,q_${config.quality}`;
  return `${urlStart}upload/${transformations}/${urlEnd}`;
}

interface PostProps {
  post: PostType;
  action: (postId: number) => Promise<void>;
}

function Post({ post, action }: PostProps) {
  return (
    <article className="post">
      <div className="post-image">
        <Image
          loader={imageLoader}
          src={post.image}
          width={200}
          height={120}
          alt={post.title}
          quality={50}
        />
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{' '}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          <div>
            <form
              action={action.bind(null, post.id)}
              className={post.isLiked ? 'liked' : ''}
            >
              <LikeButton />
            </form>
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

interface PostsProps {
  posts: PostType[];
}

export default function Posts({ posts }: PostsProps) {
  const [optimisticPosts, updateOptimisticPosts] = useOptimistic(
    posts,
    (prevPosts: PostType[], updatedPostId: number) => {
      const updatedPostIndex = prevPosts.findIndex(
        (post) => post.id === updatedPostId
      );

      if (updatedPostIndex === -1) {
        return prevPosts;
      }

      const updatedPost = { ...prevPosts[updatedPostIndex] };
      updatedPost.likes = updatedPost.likes + (updatedPost.isLiked ? -1 : 1);
      updatedPost.isLiked = updatedPost.isLiked ? 0 : 1;
      const newPosts = [...prevPosts];
      newPosts[updatedPostIndex] = updatedPost;
      return newPosts;
    }
  );

  if (!optimisticPosts || optimisticPosts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  async function updatePost(postId: number) {
    updateOptimisticPosts(postId);
    await togglePostLikeStatus(postId);
  }

  return (
    <ul className="posts">
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} action={updatePost} />
        </li>
      ))}
    </ul>
  );
}