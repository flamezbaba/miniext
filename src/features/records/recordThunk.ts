import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiError, StudentType } from "../../types";
import baseAPI from "../../api";


export const getStudent = createAsyncThunk<
  StudentType,
  string | undefined,
  { rejectValue: ApiError }
>("records/getStudent", async (sn, thunkApi) => {
  try {
    // get the student
    const studentRes = await baseAPI.get(
      `/Students?filterByFormula={Name}+%3D+'${sn}'&api_key=${process.env.REACT_APP_API_KEY}`
    );

    if (studentRes.data.records.length < 1) {
      return thunkApi.rejectWithValue({ message: "student not found" });
    }

    // get his classes
    const hisClasses: [] = studentRes.data.records[0].fields.Classes;

    let cQuery = "OR(logic)";

    let theFilter = "";

    studentRes.data.records[0].fields.Classes.forEach(
      (item: string, index: number) => {
        if (index === hisClasses.length - 1) {
          theFilter = theFilter + `(RECORD_ID()+%3D+"${item}")`;
        } else {
          theFilter = theFilter + `(RECORD_ID()+%3D+"${item}")%2C`;
        }
      }
    );

    cQuery = cQuery.replace("logic", theFilter);

    const ClassRes = await baseAPI.get(
      `/Classes?filterByFormula=${cQuery}&api_key=${process.env.REACT_APP_API_KEY}`
    );

    let allStudent: string[] = [];
    ClassRes.data.records.forEach((item: any) => {
      item.fields.Students.forEach((s: string) => {
        if (!allStudent.includes(s)) allStudent.push(s);
      });
    });

    // get all student names
    theFilter = "";
    cQuery = "OR(logic)";
    allStudent.forEach((item: string, index: number) => {
      if (index === allStudent.length - 1) {
        theFilter = theFilter + `(RECORD_ID()+%3D+"${item}")`;
      } else {
        theFilter = theFilter + `(RECORD_ID()+%3D+"${item}")%2C`;
      }
    });

    cQuery = cQuery.replace("logic", theFilter);

    const namesRes = await baseAPI.get(
      `/Students?filterByFormula=${cQuery}&api_key=${process.env.REACT_APP_API_KEY}`
    );

    // prepare all records for return
    let pc: any = [];
    ClassRes.data.records.forEach((item: any) => {
      let kx: any = {};
      kx.id = item.id;
      kx.name = item.fields.Name;
      kx.students = [];

      item.fields.Students.forEach((l: any) => {
        kx.students.push(filNames(namesRes.data.records ,l));
      });

      pc.push(kx);

    });

    const together = {
      id: studentRes.data.records[0].id,
      studentName: studentRes.data.records[0].fields.Name,
      classes: pc,
    };

    return together as StudentType;
  } catch (err: any) {
    console.log("err", err.message);
    return thunkApi.rejectWithValue({ message: "error from api" });
  }
});

const filNames = (records: [], id: string): string => {
  let xx = "";
  records.forEach((item: any) => {
    if(item.id === id){
      xx = item.fields.Name; 
    }
  });

  return xx;
};