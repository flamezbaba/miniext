import { createSlice } from "@reduxjs/toolkit";
import { getStudent } from "./recordThunk";
import { StudentType } from "../../types";

interface RecordState {
  studentRecord: StudentType | object;
  errorMessage: string | undefined;
}

const initialState: RecordState = {
  studentRecord: {},
  errorMessage: "",
};

export const recordSlice = createSlice({
  name: "records",
  initialState: initialState,
  reducers: {
    logOutAction(state) {
      state.studentRecord = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStudent.fulfilled, (state, { payload }) => {
      state.errorMessage = "";
      state.studentRecord = payload;

      console.log("fulfilled", state.studentRecord);
    });
    builder.addCase(getStudent.rejected, (state, { payload }) => {
      state.errorMessage = payload?.message;
    });
  },
});

export const { logOutAction } = recordSlice.actions;
export default recordSlice.reducer;
