import React from 'react';
import RegistrationLinkCreator from './AdminDashboard/RegistrationLinkCreator';
import BackgroundImageManager from './AdminDashboard/BackgroundImageManager';
import UserManager from './AdminDashboard/UserManager';

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <RegistrationLinkCreator />
      <BackgroundImageManager />
      <UserManager />
    </div>
  );
};

export default AdminDashboard;