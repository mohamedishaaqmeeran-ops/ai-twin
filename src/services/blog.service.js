import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api/blogs";

const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

/* =========================================================
   PUBLIC BLOG APIs
========================================================= */

const getPublicBlogs = async (params = {}) => {
  const response = await api.get("/", {
    params,
  });

  return response.data;
};

const getFeaturedBlogs = async () => {
  const response = await api.get("/featured");

  return response.data;
};

const getRecentBlogs = async () => {
  const response = await api.get("/recent");

  return response.data;
};

const getCategories = async () => {
  const response = await api.get("/categories");

  return response.data;
};

const getBlogBySlug = async (slug) => {
  const response = await api.get(
    `/${slug}`
  );

  return response.data;
};

const getRelatedBlogs = async (slug) => {
  const response = await api.get(
    `/${slug}/related`
  );

  return response.data;
};

/* =========================================================
   ADMIN BLOG APIs
========================================================= */

const getAdminBlogs = async (params = {}) => {
  const response = await api.get("/admin", {
    params,
  });

  return response.data;
};

const getAdminBlogById = async (blogId) => {
  const response = await api.get(
    `/admin/${blogId}`
  );

  return response.data;
};

const createBlog = async (blogData) => {
  const response = await api.post(
    "/admin",
    blogData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

const updateBlog = async ({
  blogId,
  blogData,
}) => {
  const response = await api.patch(
    `/admin/${blogId}`,
    blogData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

const deleteBlog = async (blogId) => {
  const response = await api.delete(
    `/admin/${blogId}`
  );

  return response.data;
};

const togglePublish = async (blogId) => {
  const response = await api.patch(
    `/admin/${blogId}/publish`
  );

  return response.data;
};

const toggleFeatured = async (blogId) => {
  const response = await api.patch(
    `/admin/${blogId}/featured`
  );

  return response.data;
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const blogService = {
  getPublicBlogs,
  getFeaturedBlogs,
  getRecentBlogs,
  getCategories,
  getBlogBySlug,
  getRelatedBlogs,
  getAdminBlogs,
  getAdminBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublish,
  toggleFeatured,
};

export default blogService;