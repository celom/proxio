import blog from './payground-modules';
import { createProxy } from './proxy/create-proxy';

const useBlogProxy = createProxy({ ...blog });

export function App() {
  const posts = useBlogProxy('getPosts', { postId: '1' }, { suspense: false });

  if (posts.state === 'loading') {
    return 'Loading...';
  } else if (posts.state === 'hasError') {
    console.log(posts.error);
  } else {
    return posts.data;
  }

  return null;
}
