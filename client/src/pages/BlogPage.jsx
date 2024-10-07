import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";


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

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    
    setBlogs(exampleBlogs);

    //  API:
    // fetch('https://your-api-endpoint.com/sports-news')
    //   .then(response => response.json())
    //   .then(data => setBlogs(data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Sports Blogs</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {blogs.map((blog) => (
          <div key={blog.id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "15px" }}>
            <img src={blog.image} alt={blog.title} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
            <h2>{blog.title}</h2>
            <p>{blog.description}</p>
            <Link to={`/blog/${blog.id}`} style={{ color: "blue", textDecoration: "none" }}>Read more</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
