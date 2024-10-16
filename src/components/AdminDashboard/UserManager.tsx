import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import UserDetailsModal from "./UserDetailsModal";
import { Badge } from "@/components/ui/badge";

const UserManager = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    });

    return () => unsubscribe();
  }, []);

  const handleApproveUser = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { isApproved: true, status: "approved" });
  };

  const handleDenyUser = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { isApproved: false, status: "denied" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Godkänd</Badge>;
      case "denied":
        return <Badge className="bg-red-100 text-red-800">Nekad</Badge>;
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Väntande</Badge>
        );
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Hantera Användare</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr>
              <th className="text-left p-3 border-b">Företag</th>
              <th className="text-left p-3 border-b">Status</th>
              <th className="text-left p-3 border-b">Bilder kvar</th>
              <th className="text-left p-3 border-b">Valda bakgrunder</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td
                  className="p-3 cursor-pointer text-blue-600 hover:underline"
                  onClick={() => setSelectedUserId(user.id)}
                >
                  {user.companyName}
                </td>
                <td className="p-3">
                  {getStatusBadge(user.status || "pending")}
                </td>
                <td className="p-3">
                  {user.uploadLimit - (user.uploadCount || 0)}
                </td>
                <td className="p-3">
                  {user.selectedBackgrounds?.length || 0} /{" "}
                  {user.backgroundLimit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUserId && (
        <UserDetailsModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onApprove={handleApproveUser}
          onDeny={handleDenyUser}
        />
      )}
    </div>
  );
};

export default UserManager;
