import React from "react";
import { useParams } from "react-router-dom";

// Пример данных для тестирования (позже это будут данные из API)
const exampleBlogs = [
  {
    id: 1,
    title: "Latest Football News",
    description: "A quick roundup of the latest football matches and transfers.",
    image: "https://via.placeholder.com/150",
    fullContent: "Full blog content about football...",
  },
  {
    id: 2,
    title: "Top Fitness Tips",
    description: "Discover the best fitness tips to improve your workouts.",
    image: "https://via.placeholder.com/150",
    fullContent: "Full blog content about fitness...",
  },
  {
    id: 3,
    title: "Running Guide for Beginners",
    description: "A complete guide for those who are new to running.",
    image: "https://via.placeholder.com/150",
    fullContent: "Full blog content about running...",
  },
];

const BlogDetailPage = () => {
  const { id } = useParams();
  const blog = exampleBlogs.find((b) => b.id === parseInt(id));

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>{blog.title}</h1>
      <img src={blog.image} alt={blog.title} style={{ width: "100%", height: "300px", objectFit: "cover" }} />
      <p>{blog.fullContent}</p>
    </div>
  );
};

export default BlogDetailPage;
