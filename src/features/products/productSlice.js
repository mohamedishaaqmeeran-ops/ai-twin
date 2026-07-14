
import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://twinn-backend.onrender.com/api";

/* =========================================================
   FETCH PRODUCTS
========================================================= */

export const fetchProducts =
  createAsyncThunk(
    "products/fetchProducts",

    async (
      _,
      {
        rejectWithValue,
      }
    ) => {
      try {
        const response =
          await fetch(
            `${API_URL}/products`,
            {
              method: "GET",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          return rejectWithValue(
            data?.message ||
              "Unable to load products."
          );
        }

        return (
          data?.products ||
          data?.data ||
          []
        );
      } catch (error) {
        return rejectWithValue(
          error?.message ||
            "Unable to load products."
        );
      }
    }
  );

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  products: [],

  loading: false,

  error: null,
};

/* =========================================================
   SLICE
========================================================= */

const productSlice =
  createSlice({
    name: "products",

    initialState,

    reducers: {
      clearProductError: (
        state
      ) => {
        state.error =
          null;
      },

      clearProducts: (
        state
      ) => {
        state.products =
          [];
      },
    },

    extraReducers: (
      builder
    ) => {
      builder

        /* FETCH PRODUCTS */

        .addCase(
          fetchProducts.pending,

          (state) => {
            state.loading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          fetchProducts.fulfilled,

          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.products =
              Array.isArray(
                action.payload
              )
                ? action.payload
                : [];
          }
        )

        .addCase(
          fetchProducts.rejected,

          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.error =
              action.payload ||
              "Unable to load products.";
          }
        );
    },
  });

/* =========================================================
   EXPORT ACTIONS
========================================================= */

export const {
  clearProductError,
  clearProducts,
} =
  productSlice.actions;

/* =========================================================
   EXPORT REDUCER
========================================================= */

export default productSlice.reducer;
