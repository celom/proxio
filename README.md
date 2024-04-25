# @celom/proxio

Proxio combines the power of Jotai state management with TypeScript to provide a simple and efficient way to handle asynchronous requests in a React application.

With Proxio, you can call asynchronous functions with type safety and without worrying about unnecessary re-renders as it caches the function response and only triggers it again if necessary.

In the code examples provided, you can see how Proxio is used with React Suspense and without Suspense. The `getPosts` and `getAuthors` functions are defined in the `blog.module.ts` file and exported as part of the default export. These functions can be accessed using the `useBlogProxy` hook created with `createProxy` from the `./proxy/create-proxy` module.

To install Proxio, you can use npm or yarn by running the following command:

```
npm install @celom/proxio
```

### Consider the following ES module:

```ts
// blog.module.ts

const getPosts = async (props: { postId: string }) => {
  return { postId: props.postId };
};

const getAuthors = async (props: { authorId: string }) => {
  return { authorId: props.authorId };
};

export default {
  getPosts,
  getAuthors,
};
```

### Example using React Suspense:

```ts
// app.tsx

import { createProxy } from './proxy/create-proxy';
import blog from './payground copy';

const useBlogProxy = createProxy({ ...blog });

export function App() {
  const authors = useBlogProxy('getAuthors', { authorId: '1' });

  return authors;
}
```

In this example, the `useBlogProxy` hook is used to call the `getAuthors` function with the `authorId` parameter set to `'1'`. The result is stored in the `authors` variable.

### Example without Suspense:

The `suspense` option should be set to `false` to disable React Suspense.

```ts
// app.tsx

import { createProxy } from './proxy/create-proxy';
import blog from './payground copy';

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
```

In this example without Suspense, the `useBlogProxy` hook is used to call the `getPosts` function with the `postId` parameter set to `'1'`.

The result is stored in the `posts` variable. Depending on the state of `posts`, different actions are taken. If the state is `'loading'`, the string `'Loading...'` is returned. If the state is `'hasError'`, the error is logged to the console. Otherwise, the data is returned.

## Installation

To install, you can use npm or yarn:

```bash
npm install @celom/proxio
```

## License

This project is licensed under the ISC License.
