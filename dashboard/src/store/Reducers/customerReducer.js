import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const get_customers = createAsyncThunk(
  "auth/get_customers",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/get-users?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        {
          withCredentials: true,
        }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const set_status = createAsyncThunk(
  "auth/status_customers",
  async (obj, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/customer/status", obj);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const customerReducer = createSlice({
  name: "customer",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    totalCustomers: 0,
    customer: [],
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    [get_customers.pending]: (state, _) => {
      state.loader = true;
    },
    [get_customers.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.customer = payload.customers;
    },
    [set_status.pending]: (state, _) => {
      state.loader = true;
    },
    [set_status.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [set_status.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
    },
  },
});
export const { messageClear } = customerReducer.actions;
export default customerReducer.reducer;
