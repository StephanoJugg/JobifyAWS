import { useState } from "react";
import { useAppContext } from "../../context/appContext";
import { FormRow, Alert } from "../../components";
import Wrapper from "../../assets/wrappers/DashboardFormPage";

export default function Profile() {
  const {
    user,
    showAlert,
    alertType,
    alertText,
    isLoading,
    displayAlert,
    updateUser,
  } = useAppContext();
  const [name, setName] = useState(user?.name ?? " ");
  const [email, setEmail] = useState(user?.email ?? " ");
  const [location, setLocation] = useState(user?.userLocation ?? " ");
  const [lastName, setLastName] = useState(user?.lastName ?? " ");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !location || !lastName) {
      displayAlert();
      return;
    }

    updateUser({
      _id: user?._id!,
      name,
      email,
      lastName,
      userLocation: location,
      jobLocation: location,
    });
  };
  return (
    <Wrapper>
      <h3>Profile</h3>
      <form className="form" onSubmit={handleSubmit}>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            type="text"
            name="name"
            value={name}
            handleChange={(e) => setName(e.target.value)}
          ></FormRow>
          <FormRow
            type="text"
            name="email"
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
          ></FormRow>

          <FormRow
            type="text"
            name="lastName"
            value={lastName}
            handleChange={(e) => setLastName(e.target.value)}
          ></FormRow>
          <FormRow
            type="text"
            name="location"
            value={location}
            handleChange={(e) => setLocation(e.target.value)}
          ></FormRow>
          <button className="btn btn-block" type="submit" disabled={isLoading}>
            {isLoading ? "Please wait..." : "save changes"}
          </button>
        </div>
      </form>
    </Wrapper>
  );
}
