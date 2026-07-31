// src/features/products/productSlice.js

import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import {
  apiRequest,
} from "../../lib/api";

/* =========================================================
   HELPERS
========================================================= */

const getProductList = (
  data
) => {
  if (
    Array.isArray(data)
  ) {
    return data;
  }

  if (
    Array.isArray(
      data?.products
    )
  ) {
    return data.products;
  }

  if (
    Array.isArray(
      data?.items
    )
  ) {
    return data.items;
  }

  if (
    Array.isArray(
      data?.results
    )
  ) {
    return data.results;
  }

  if (
    Array.isArray(
      data?.data
    )
  ) {
    return data.data;
  }

  if (
    Array.isArray(
      data?.data?.products
    )
  ) {
    return data.data.products;
  }

  return [];
};

const getProduct = (
  data
) => {
  if (!data) {
    return null;
  }

  if (
    data?.product
  ) {
    return data.product;
  }

  if (
    data?.data?.product
  ) {
    return data.data.product;
  }

  if (
    data?.data &&
    !Array.isArray(
      data.data
    )
  ) {
    return data.data;
  }

  return data;
};

const getErrorMessage = (
  error,
  fallbackMessage
) => {
  if (
    typeof error ===
    "string"
  ) {
    return error;
  }

  return (
    error?.response?.data
      ?.message ||
    error?.data?.message ||
    error?.message ||
    fallbackMessage
  );
};

const getProductId = (
  product
) => {
  return (
    product?._id ||
    product?.id ||
    null
  );
};

const replaceProductInList = (
  products,
  updatedProduct
) => {
  const productId =
    getProductId(
      updatedProduct
    );

  if (!productId) {
    return products;
  }

  const index =
    products.findIndex(
      (product) =>
        String(
          getProductId(
            product
          )
        ) ===
        String(
          productId
        )
    );

  if (index < 0) {
    return [
      updatedProduct,
      ...products,
    ];
  }

  const nextProducts = [
    ...products,
  ];

  nextProducts[index] =
    updatedProduct;

  return nextProducts;
};

/* =========================================================
   FETCH PRODUCTS
========================================================= */

export const fetchProducts =
  createAsyncThunk(
    "product/fetchProducts",

    async (
      params = {},
      {
        rejectWithValue,
      }
    ) => {
      try {
        const query =
          new URLSearchParams();

        if (
          params.search
        ) {
          query.set(
            "search",
            params.search
          );
        }

        if (
          params.status
        ) {
          query.set(
            "status",
            params.status
          );
        }

        if (
          params.category
        ) {
          query.set(
            "category",
            params.category
          );
        }

        if (
          params.page
        ) {
          query.set(
            "page",
            String(
              params.page
            )
          );
        }

        if (
          params.limit
        ) {
          query.set(
            "limit",
            String(
              params.limit
            )
          );
        }

        const queryString =
          query.toString();

        const data =
          await apiRequest(
            `/api/products${
              queryString
                ? `?${queryString}`
                : ""
            }`
          );

        const products =
          getProductList(
            data
          );

        return {
          products,

          pagination:
            data?.pagination ||
            data?.meta ||
            data?.data
              ?.pagination ||
            null,

          total:
            Number(
              data?.total ??
                data?.count ??
                data?.data
                  ?.total ??
                products.length
            ),
        };
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to load products."
          )
        );
      }
    }
  );

/* =========================================================
   FETCH SINGLE PRODUCT
========================================================= */

export const fetchProductById =
  createAsyncThunk(
    "product/fetchProductById",

    async (
      productId,
      {
        rejectWithValue,
      }
    ) => {
      try {
        if (!productId) {
          throw new Error(
            "Product ID is required."
          );
        }

        const data =
          await apiRequest(
            `/api/products/${productId}`
          );

        const product =
          getProduct(
            data
          );

        if (!product) {
          throw new Error(
            "Product not found."
          );
        }

        return product;
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to load product."
          )
        );
      }
    }
  );

/* =========================================================
   CREATE PRODUCT
========================================================= */

export const createProduct =
  createAsyncThunk(
    "product/createProduct",

    async (
      productData,
      {
        rejectWithValue,
      }
    ) => {
      try {
        if (!productData) {
          throw new Error(
            "Product data is required."
          );
        }

        const data =
          await apiRequest(
            "/api/products",
            {
              method: "POST",
              body: productData,
            }
          );

        const product =
          getProduct(
            data
          );

        if (!product) {
          throw new Error(
            "Product was created, but no product data was returned."
          );
        }

        return product;
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to create product."
          )
        );
      }
    }
  );

/* =========================================================
   UPDATE PRODUCT
========================================================= */

export const updateProduct =
  createAsyncThunk(
    "product/updateProduct",

    async (
      payload,
      {
        rejectWithValue,
      }
    ) => {
      try {
        /*
         * Supports both:
         *
         * updateProduct({
         *   productId,
         *   productData,
         * })
         *
         * and:
         *
         * updateProduct({
         *   id,
         *   formData,
         * })
         */

        const productId =
          payload?.productId ||
          payload?.id;

        const productData =
          payload?.productData ||
          payload?.formData ||
          payload?.data;

        if (!productId) {
          throw new Error(
            "Product ID is required."
          );
        }

        if (!productData) {
          throw new Error(
            "Product data is required."
          );
        }

        const data =
          await apiRequest(
            `/api/products/${productId}`,
            {
              method: "PUT",
              body: productData,
            }
          );

        const product =
          getProduct(
            data
          );

        if (!product) {
          throw new Error(
            "Product was updated, but no product data was returned."
          );
        }

        return product;
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to update product."
          )
        );
      }
    }
  );

/* =========================================================
   DELETE PRODUCT
========================================================= */

export const deleteProduct =
  createAsyncThunk(
    "product/deleteProduct",

    async (
      productId,
      {
        rejectWithValue,
      }
    ) => {
      try {
        if (!productId) {
          throw new Error(
            "Product ID is required."
          );
        }

        await apiRequest(
          `/api/products/${productId}`,
          {
            method: "DELETE",
          }
        );

        return productId;
      } catch (error) {
        return rejectWithValue(
          getErrorMessage(
            error,
            "Unable to delete product."
          )
        );
      }
    }
  );

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  products: [],
  selectedProduct: null,

  loading: false,
  detailsLoading: false,
  saving: false,
  deleting: false,

  error: "",
  detailsError: "",
  saveError: "",
  deleteError: "",

  pagination: null,
  total: 0,

  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
};

/* =========================================================
   PRODUCT SLICE
========================================================= */

const productSlice =
  createSlice({
    name: "product",

    initialState,

    reducers: {
      clearProductError: (
        state
      ) => {
        state.error = "";
        state.detailsError = "";
        state.saveError = "";
        state.deleteError = "";
      },

      clearSelectedProduct: (
        state
      ) => {
        state.selectedProduct =
          null;

        state.detailsError =
          "";
      },

      clearProductSuccess: (
        state
      ) => {
        state.createSuccess =
          false;

        state.updateSuccess =
          false;

        state.deleteSuccess =
          false;
      },

      setSelectedProduct: (
        state,
        action
      ) => {
        state.selectedProduct =
          action.payload ||
          null;
      },

      resetProductState: () =>
        ({
          ...initialState,
        }),
    },

    extraReducers: (
      builder
    ) => {
      builder

        /* =====================================================
           FETCH PRODUCTS
        ===================================================== */

        .addCase(
          fetchProducts.pending,
          (state) => {
            state.loading =
              true;

            state.error =
              "";
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
                  ?.products
              )
                ? action.payload
                    .products
                : [];

            state.pagination =
              action.payload
                ?.pagination ||
              null;

            state.total =
              Number(
                action.payload
                  ?.total
              ) ||
              state.products
                .length;
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
        )

        /* =====================================================
           FETCH SINGLE PRODUCT
        ===================================================== */

        .addCase(
          fetchProductById.pending,
          (state) => {
            state.detailsLoading =
              true;

            state.detailsError =
              "";

            state.selectedProduct =
              null;
          }
        )

        .addCase(
          fetchProductById.fulfilled,
          (
            state,
            action
          ) => {
            state.detailsLoading =
              false;

            state.selectedProduct =
              action.payload;

            state.products =
              replaceProductInList(
                state.products,
                action.payload
              );
          }
        )

        .addCase(
          fetchProductById.rejected,
          (
            state,
            action
          ) => {
            state.detailsLoading =
              false;

            state.selectedProduct =
              null;

            state.detailsError =
              action.payload ||
              "Unable to load product.";
          }
        )

        /* =====================================================
           CREATE PRODUCT
        ===================================================== */

        .addCase(
          createProduct.pending,
          (state) => {
            state.saving =
              true;

            state.saveError =
              "";

            state.createSuccess =
              false;

            state.updateSuccess =
              false;
          }
        )

        .addCase(
          createProduct.fulfilled,
          (
            state,
            action
          ) => {
            state.saving =
              false;

            state.createSuccess =
              true;

            if (
              action.payload
            ) {
              const productId =
                getProductId(
                  action.payload
                );

              const alreadyExists =
                state.products.some(
                  (product) =>
                    String(
                      getProductId(
                        product
                      )
                    ) ===
                    String(
                      productId
                    )
                );

              if (
                alreadyExists
              ) {
                state.products =
                  replaceProductInList(
                    state.products,
                    action.payload
                  );
              } else {
                state.products.unshift(
                  action.payload
                );

                state.total +=
                  1;
              }

              state.selectedProduct =
                action.payload;
            }
          }
        )

        .addCase(
          createProduct.rejected,
          (
            state,
            action
          ) => {
            state.saving =
              false;

            state.createSuccess =
              false;

            state.saveError =
              action.payload ||
              "Unable to create product.";
          }
        )

        /* =====================================================
           UPDATE PRODUCT
        ===================================================== */

        .addCase(
          updateProduct.pending,
          (state) => {
            state.saving =
              true;

            state.saveError =
              "";

            state.updateSuccess =
              false;

            state.createSuccess =
              false;
          }
        )

        .addCase(
          updateProduct.fulfilled,
          (
            state,
            action
          ) => {
            state.saving =
              false;

            state.updateSuccess =
              true;

            state.selectedProduct =
              action.payload;

            state.products =
              replaceProductInList(
                state.products,
                action.payload
              );
          }
        )

        .addCase(
          updateProduct.rejected,
          (
            state,
            action
          ) => {
            state.saving =
              false;

            state.updateSuccess =
              false;

            state.saveError =
              action.payload ||
              "Unable to update product.";
          }
        )

        /* =====================================================
           DELETE PRODUCT
        ===================================================== */

        .addCase(
          deleteProduct.pending,
          (state) => {
            state.deleting =
              true;

            state.deleteError =
              "";

            state.deleteSuccess =
              false;
          }
        )

        .addCase(
          deleteProduct.fulfilled,
          (
            state,
            action
          ) => {
            state.deleting =
              false;

            state.deleteSuccess =
              true;

            state.products =
              state.products.filter(
                (product) =>
                  String(
                    getProductId(
                      product
                    )
                  ) !==
                  String(
                    action.payload
                  )
              );

            if (
              String(
                getProductId(
                  state.selectedProduct
                )
              ) ===
              String(
                action.payload
              )
            ) {
              state.selectedProduct =
                null;
            }

            state.total =
              Math.max(
                0,
                state.total - 1
              );
          }
        )

        .addCase(
          deleteProduct.rejected,
          (
            state,
            action
          ) => {
            state.deleting =
              false;

            state.deleteSuccess =
              false;

            state.deleteError =
              action.payload ||
              "Unable to delete product.";
          }
        );
    },
  });

/* =========================================================
   EXPORT ACTIONS
========================================================= */

export const {
  clearProductError,
  clearSelectedProduct,
  clearProductSuccess,
  setSelectedProduct,
  resetProductState,
} = productSlice.actions;

/* =========================================================
   SELECTORS
========================================================= */

export const selectProducts = (
  state
) =>
  state.product
    ?.products || [];

export const selectSelectedProduct = (
  state
) =>
  state.product
    ?.selectedProduct ||
  null;

export const selectProductsLoading = (
  state
) =>
  Boolean(
    state.product
      ?.loading
  );

export const selectProductDetailsLoading = (
  state
) =>
  Boolean(
    state.product
      ?.detailsLoading
  );

export const selectProductSaving = (
  state
) =>
  Boolean(
    state.product
      ?.saving
  );

export const selectProductDeleting = (
  state
) =>
  Boolean(
    state.product
      ?.deleting
  );

export const selectProductListError = (
  state
) =>
  state.product
    ?.error || "";

export const selectProductDetailsError = (
  state
) =>
  state.product
    ?.detailsError || "";

export const selectProductSaveError = (
  state
) =>
  state.product
    ?.saveError || "";

export const selectProductDeleteError = (
  state
) =>
  state.product
    ?.deleteError || "";

/* =========================================================
   EXPORT REDUCER
========================================================= */

export default productSlice.reducer;