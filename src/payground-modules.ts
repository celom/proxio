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
