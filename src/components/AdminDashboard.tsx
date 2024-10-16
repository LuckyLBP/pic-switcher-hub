import RegistrationLinkCreator from "./AdminDashboard/RegistrationLinkCreator";
import BackgroundImageManager from "./AdminDashboard/BackgroundImageManager";
import UserManager from "./AdminDashboard/UserManager";

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <RegistrationLinkCreator />
      <UserManager />
      <BackgroundImageManager />
    </div>
  );
};

export default AdminDashboard;
