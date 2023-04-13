import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext/appContext';
import { FormRow, Alert } from '../../components';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { useAuthContext } from '../../context/AuthContext/AuthContext';

export default function Profile() {
  const { showAlert, alertType, alertText, displayAlert } = useAppContext();
  const { user, updateUser, getUserAttributes, isLoading } = useAuthContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [lastName, setLastName] = useState('');
  useEffect(() => {
    user?.getUserAttributes((err, data) => {
      if (err) {
        console.log(err);
      } else {
        setName(data![3].Value);
        setEmail(data![5].Value);
        setLastName(data![1].Value);
        setLocation(data![4].Value);
      }
    });
    const userAtt = async () => {
      const data = await getUserAttributes(user!);
    };
    userAtt();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !location || !lastName) {
      displayAlert();
      return;
    }

    updateUser({ name, email, userLocation: location, lastName });
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
            {isLoading ? 'Please wait...' : 'save changes'}
          </button>
        </div>
      </form>
    </Wrapper>
  );
}
