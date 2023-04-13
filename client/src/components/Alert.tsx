import React from 'react';
import { useAuthContext } from '../context/AuthContext/AuthContext';

export default function Alert() {
  const { alert } = useAuthContext();

  console.log('ALERT' + alert);

  return (
    <div className={`alert alert-${alert.alertType}`}>{alert.alertMessage}</div>
  );
}
