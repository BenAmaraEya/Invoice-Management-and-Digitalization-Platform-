import React, { useEffect, useState } from 'react';

const ProfilTT = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:3006/user/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("Failed to fetch user profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div>
      <h1>User Profile</h1>
      {userData && (
        <div>
          <p>User ID: {userData.id}</p>
          <p>Username: {userData.username}</p>
          <p>Email: {userData.email}</p>
          {/* Add other profile details as needed */}
        </div>
      )}
    </div>
  );
};

export default ProfilTT;
