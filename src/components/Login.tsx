import * as React from "react";

import { useAppDispatch, useAppSelector } from "../features/store";
import { getStudent } from "../features/records/recordThunk";
import { logOutAction } from "../features/records/recordSlice";
import { HisClassTypes } from "../types";
import "../App.css";

type LoginProps = {};

const Login: React.FunctionComponent<LoginProps> = () => {
  const nameRef = React.useRef<HTMLInputElement | null>(null);
  const [loginError, setLoginError] = React.useState<string>("");
  const dispatch = useAppDispatch();

  const errorMessage: string | undefined = useAppSelector(
    (state) => state.records.errorMessage
  );
  const studentRecord: any = useAppSelector(
    (state) => state.records.studentRecord
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (nameRef.current?.value === "") {
      setLoginError("Student Name is Mandatory");
    } else {
      setLoginError("");
      dispatch(getStudent(nameRef.current?.value));
    }
  };

  const logOut = (): void => {
    dispatch(logOutAction());
  };
  return (
    <>
      {studentRecord.id ? (
        <div className="user-wrapper">
          <div className="lg">
            <button onClick={() => logOut()}>Log out</button>
          </div>

          <div className="record-wrapper">
            {studentRecord.classes.map((item: HisClassTypes, index: number) => (
              <div className="record" key={index}>
                <h3>Name</h3>
                <span>{item.name}</span>
                <h3>Students</h3>
                <span>{item.students.join(", ")} </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="login-wrapper">
          <div>
            <form onSubmit={(e) => handleSubmit(e)}>
              <p className="red-error">{loginError || errorMessage}</p>
              Student Name: <input type="text" ref={nameRef} />
              <br />
              <button>Login</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
