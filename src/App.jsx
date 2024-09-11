import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const API_URL = "http://localhost:5001/posts";

const getPosts = async () => {
  const { data } = await axios.get(API_URL);
  return data;
};

const addPost = async (newPost) => {
  const { data } = await axios.post(API_URL, newPost);
  return data;
};

const App = () => {
  const queryClient = useQueryClient();

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const [title, setTitle] = useState("");
  const [views, setViews] = useState("");

  const mutation = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  if (isLoading) {
    return <p>로딩중...</p>;
  }

  if (isError) {
    return <p>오류가 발생하였습니다…</p>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ title, views });
    setTitle("");
    setViews("");
  };

  return (
    <div>
      <h1>Posts</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={title}
            placeholder={"타이틀"}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <input
            type="number"
            value={views}
            placeholder={"vies"}
            onChange={(e) => setViews(e.target.value)}
          />
        </div>
        <button type="submit">추가</button>
      </form>

      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id}>
            <p>Title: {post.title}</p>
            <p>Views: {post.views}</p>
          </div>
        ))
      ) : (
        <p>게시물이 없습니다.</p>
      )}
    </div>
  );
};

export default App;
