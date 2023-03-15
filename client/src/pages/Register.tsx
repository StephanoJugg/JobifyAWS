import { useState, useEffect } from "react";

import Wrapper from "../assets/wrappers/RegisterPage";
import { Logo, FormRow, Alert } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";

type User = {
  name: string;
  email: string;
  password: string;
  isMember: boolean;
};

const initialState: User = {
  name: "",
  email: "",
  password: "",
  isMember: true,
};

export default function Register() {
  const [values, setValues] = useState(initialState);
  const {
    isLoading,
    showAlert,
    user,
    displayAlert,
    registerUser,
    loginUser,
    setupUser,
  } = useAppContext();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;

    if (!isMember && (!name || !email || !password)) {
      displayAlert();
      return;
    }

    const currentUser = { name, email, password };

    if (isMember) {
      console.log(currentUser + " is a member");
      setupUser(currentUser, "login", "User logged in successfully");
    } else {
      setupUser(currentUser, "register", "User registered successfully");
    }
  };

  const toggleMember = () => {
    setValues({
      ...values,
      isMember: !values.isMember,
    });
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [user, navigate]);

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={handleSubmit}>
        <Logo></Logo>
        {values.isMember ? <h3>Login</h3> : <h3>Register</h3>}
        {showAlert && <Alert />}
        {!values.isMember && (
          <FormRow
            type="text"
            label="name"
            value={values.name}
            name="name"
            handleChange={handleChange}
          ></FormRow>
        )}
        <FormRow
          type="email"
          value={values.email}
          name="email"
          handleChange={handleChange}
        ></FormRow>
        <FormRow
          type="password"
          value={values.password}
          name="password"
          handleChange={handleChange}
        ></FormRow>
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          submit
        </button>
        <p>
          {values.isMember ? "Not a member yet ?" : "Already a member?"}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  );
}
