import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import blogService from "../../services/blog.service";

/* =========================================================
   PUBLIC THUNKS
========================================================= */

export const fetchPublicBlogs =
  createAsyncThunk(
    "blog/fetchPublicBlogs",
    async (
      params = {},
      { rejectWithValue }
    ) => {
      try {
        return await blogService.getPublicBlogs(
          params
        );
      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

export const fetchFeaturedBlogs =
  createAsyncThunk(
    "blog/fetchFeaturedBlogs",
    async (
      limit = 3,
      { rejectWithValue }
    ) => {
      try {
        return await blogService.getFeaturedBlogs(
          limit
        );
      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

export const fetchRecentBlogs =
  createAsyncThunk(
    "blog/fetchRecentBlogs",
    async (
      params = {},
      { rejectWithValue }
    ) => {
      try {
        return await blogService.getRecentBlogs(
          params
        );
      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

export const fetchBlogCategories =
  createAsyncThunk(
    "blog/fetchBlogCategories",
    async (_, { rejectWithValue }) => {
      try {
        return await blogService.getBlogCategories();
      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

export const fetchBlogBySlug =
  createAsyncThunk(
    "blog/fetchBlogBySlug",
    async (
      slug,
      { rejectWithValue }
    ) => {
      try {
        return await blogService.getBlogBySlug(
          slug
        );
      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

export const fetchRelatedBlogs =
  createAsyncThunk(
    "blog/fetchRelatedBlogs",
    async (
      {
        slug,
        limit = 3,
      },
      { rejectWithValue }
    ) => {
      try {
        return await blogService.getRelatedBlogs(
          slug,
          limit
        );
      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

/* =========================================================
   ADMIN THUNKS
========================================================= */

export const fetchAdminBlogs =
  createAsyncThunk(
    "blog/fetchAdminBlogs",
    async (
      params = {},
      { rejectWithValue }
    ) => {
      try {
        return await blogService.getAdminBlogs(
          params
        );
      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

export const fetchAdminBlogById =
  createAsyncThunk(
    "blog/fetchAdminBlogById",
    async (
      blogId,
      { rejectWithValue }
    ) => {
      try {
        return await blogService.getAdminBlogById(
          blogId
        );
      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

export const createBlogPost =
  createAsyncThunk(
    "blog/createBlogPost",
    async (
      formData,
      { rejectWithValue }
    ) => {
      try {
        return await blogService.createBlog(
          formData
        );
      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

export const updateBlogPost =
  createAsyncThunk(
    "blog/updateBlogPost",
    async (
      {
        blogId,
        formData,
      },
      { rejectWithValue }
    ) => {
      try {
        return await blogService.updateBlog(
          blogId,
          formData
        );
      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

export const removeBlogPost =
  createAsyncThunk(
    "blog/removeBlogPost",
    async (
      blogId,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await blogService.deleteBlog(
            blogId
          );

        return {
          ...response,
          blogId,
        };
      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

export const changeBlogPublishStatus =
  createAsyncThunk(
    "blog/changeBlogPublishStatus",
    async (
      {
        blogId,
        published,
      },
      { rejectWithValue }
    ) => {
      try {
        return await blogService.toggleBlogPublish(
          blogId,
          published
        );
      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

export const changeBlogFeaturedStatus =
  createAsyncThunk(
    "blog/changeBlogFeaturedStatus",
    async (
      {
        blogId,
        featured,
      },
      { rejectWithValue }
    ) => {
      try {
        return await blogService.toggleBlogFeatured(
          blogId,
          featured
        );
      } catch (error) {
        return rejectWithValue(
          error.message
        );
      }
    }
  );

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  blogs: [],
  featuredBlogs: [],
  recentBlogs: [],
  relatedBlogs: [],
  categories: [],

  selectedBlog: null,
  adminBlogs: [],
  adminSelectedBlog: null,

  pagination: {
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  adminPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },

  stats: {
    total: 0,
    published: 0,
    drafts: 0,
    featured: 0,
  },

  loading: false,
  listLoading: false,
  detailsLoading: false,
  adminLoading: false,
  actionLoading: false,

  error: null,
  actionError: null,
  successMessage: "",
};

/* =========================================================
   SLICE
========================================================= */

const blogSlice = createSlice({
  name: "blog",
  initialState,

  reducers: {
    clearBlogError: (state) => {
      state.error = null;
      state.actionError = null;
    },

    clearBlogMessage: (state) => {
      state.successMessage = "";
    },

    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
      state.relatedBlogs = [];
    },

    clearAdminSelectedBlog: (
      state
    ) => {
      state.adminSelectedBlog = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* PUBLIC BLOG LIST */

      .addCase(
        fetchPublicBlogs.pending,
        (state) => {
          state.listLoading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchPublicBlogs.fulfilled,
        (state, action) => {
          state.listLoading = false;
          state.blogs =
            action.payload.blogs || [];
          state.pagination =
            action.payload.pagination ||
            state.pagination;
        }
      )
      .addCase(
        fetchPublicBlogs.rejected,
        (state, action) => {
          state.listLoading = false;
          state.error =
            action.payload ||
            "Unable to load blogs.";
        }
      )

      /* FEATURED */

      .addCase(
        fetchFeaturedBlogs.fulfilled,
        (state, action) => {
          state.featuredBlogs =
            action.payload.blogs || [];
        }
      )

      /* RECENT */

      .addCase(
        fetchRecentBlogs.fulfilled,
        (state, action) => {
          state.recentBlogs =
            action.payload.blogs || [];
        }
      )

      /* CATEGORIES */

      .addCase(
        fetchBlogCategories.fulfilled,
        (state, action) => {
          state.categories =
            action.payload.categories ||
            [];
        }
      )

      /* BLOG DETAILS */

      .addCase(
        fetchBlogBySlug.pending,
        (state) => {
          state.detailsLoading = true;
          state.error = null;
          state.selectedBlog = null;
        }
      )
      .addCase(
        fetchBlogBySlug.fulfilled,
        (state, action) => {
          state.detailsLoading = false;
          state.selectedBlog =
            action.payload.blog || null;
        }
      )
      .addCase(
        fetchBlogBySlug.rejected,
        (state, action) => {
          state.detailsLoading = false;
          state.error =
            action.payload ||
            "Unable to load blog.";
        }
      )

      /* RELATED */

      .addCase(
        fetchRelatedBlogs.fulfilled,
        (state, action) => {
          state.relatedBlogs =
            action.payload.blogs || [];
        }
      )

      /* ADMIN LIST */

      .addCase(
        fetchAdminBlogs.pending,
        (state) => {
          state.adminLoading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchAdminBlogs.fulfilled,
        (state, action) => {
          state.adminLoading = false;
          state.adminBlogs =
            action.payload.blogs || [];
          state.adminPagination =
            action.payload.pagination ||
            state.adminPagination;
          state.stats =
            action.payload.stats ||
            state.stats;
        }
      )
      .addCase(
        fetchAdminBlogs.rejected,
        (state, action) => {
          state.adminLoading = false;
          state.error =
            action.payload ||
            "Unable to load admin blogs.";
        }
      )

      /* ADMIN DETAILS */

      .addCase(
        fetchAdminBlogById.pending,
        (state) => {
          state.adminLoading = true;
          state.error = null;
          state.adminSelectedBlog = null;
        }
      )
      .addCase(
        fetchAdminBlogById.fulfilled,
        (state, action) => {
          state.adminLoading = false;
          state.adminSelectedBlog =
            action.payload.blog || null;
        }
      )
      .addCase(
        fetchAdminBlogById.rejected,
        (state, action) => {
          state.adminLoading = false;
          state.error =
            action.payload ||
            "Unable to load blog.";
        }
      )

      /* CREATE */

      .addCase(
        createBlogPost.pending,
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
          state.successMessage = "";
        }
      )
      .addCase(
        createBlogPost.fulfilled,
        (state, action) => {
          state.actionLoading = false;
          state.successMessage =
            action.payload.message ||
            "Blog created successfully.";
        }
      )
      .addCase(
        createBlogPost.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.actionError =
            action.payload ||
            "Unable to create blog.";
        }
      )

      /* UPDATE */

      .addCase(
        updateBlogPost.pending,
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
          state.successMessage = "";
        }
      )
      .addCase(
        updateBlogPost.fulfilled,
        (state, action) => {
          state.actionLoading = false;
          state.adminSelectedBlog =
            action.payload.blog || null;
          state.successMessage =
            action.payload.message ||
            "Blog updated successfully.";

          const updated =
            action.payload.blog;

          if (updated) {
            state.adminBlogs =
              state.adminBlogs.map(
                (blog) =>
                  blog._id === updated._id
                    ? updated
                    : blog
              );
          }
        }
      )
      .addCase(
        updateBlogPost.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.actionError =
            action.payload ||
            "Unable to update blog.";
        }
      )

      /* DELETE */

      .addCase(
        removeBlogPost.pending,
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
        }
      )
      .addCase(
        removeBlogPost.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const id =
            action.payload
              .deletedBlogId ||
            action.payload.blogId;

          state.adminBlogs =
            state.adminBlogs.filter(
              (blog) =>
                String(blog._id) !==
                String(id)
            );

          state.successMessage =
            action.payload.message ||
            "Blog deleted successfully.";
        }
      )
      .addCase(
        removeBlogPost.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.actionError =
            action.payload ||
            "Unable to delete blog.";
        }
      )

      /* PUBLISH */

      .addCase(
        changeBlogPublishStatus.fulfilled,
        (state, action) => {
          const updated =
            action.payload.blog;

          state.adminBlogs =
            state.adminBlogs.map(
              (blog) =>
                blog._id === updated._id
                  ? updated
                  : blog
            );

          state.successMessage =
            action.payload.message || "";
        }
      )
      .addCase(
        changeBlogPublishStatus.rejected,
        (state, action) => {
          state.actionError =
            action.payload ||
            "Unable to change status.";
        }
      )

      /* FEATURED */

      .addCase(
        changeBlogFeaturedStatus.fulfilled,
        (state, action) => {
          const updated =
            action.payload.blog;

          state.adminBlogs =
            state.adminBlogs.map(
              (blog) =>
                blog._id === updated._id
                  ? updated
                  : blog
            );

          state.successMessage =
            action.payload.message || "";
        }
      )
      .addCase(
        changeBlogFeaturedStatus.rejected,
        (state, action) => {
          state.actionError =
            action.payload ||
            "Unable to change featured status.";
        }
      );
  },
});

export const {
  clearBlogError,
  clearBlogMessage,
  clearSelectedBlog,
  clearAdminSelectedBlog,
} = blogSlice.actions;

export default blogSlice.reducer;
