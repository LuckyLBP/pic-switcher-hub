import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  HomeIcon,
  PhotoIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const SidebarNavigation = () => {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.role === "admin");
        }
      }
    };
    checkUserRole();
  }, [user]);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="bg-white h-screen w-64 shadow-lg fixed top-0 left-0 z-50 flex flex-col justify-between py-6 px-4">
      <div>
        <div className="mb-6">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-800">BilAppen</span>
          </Link>
        </div>
        <div className="space-y-4">
          <NavItem
            to="/dashboard"
            icon={<HomeIcon className="h-6 w-6" />}
            label="Dashboard"
            currentPath={location.pathname}
          />
          <NavItem
            to="/gallery"
            icon={<PhotoIcon className="h-6 w-6" />}
            label="Galleri"
            currentPath={location.pathname}
          />
          <NavItem
            to="/profile"
            icon={<UserCircleIcon className="h-6 w-6" />}
            label="Profil"
            currentPath={location.pathname}
          />
          {isAdmin && (
            <NavItem
              to="/admin"
              icon={<Cog6ToothIcon className="h-6 w-6" />}
              label="Admin"
              currentPath={location.pathname}
            />
          )}
        </div>
      </div>
      <div className="space-y-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          <span>Logga ut</span>
        </button>
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  currentPath: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, currentPath }) => {
  const isActive = currentPath.startsWith(to);

  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
        isActive
          ? "bg-blue-100 text-blue-600"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default SidebarNavigation;
