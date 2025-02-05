import React from 'react';

const ProfileCard = ({ userData }) => {
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-12">
      <div className="flex flex-col items-center mb-6">
        {/* Initials Avatar */}
        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center mb-4">
          <span className="text-3xl font-bold text-white">
            {getInitials(userData.firstName, userData.lastName)}
          </span>
        </div>
        
        {/* Name */}
        <h2 className="text-2xl font-bold text-gray-800">
          {userData.firstName} {userData.lastName}
        </h2>
        <p className="text-gray-600 mt-1">{userData.College || 'Student'}</p>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Email</p>
          <p className="font-medium text-gray-800">{userData.email}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Contact Number</p>
          <p className="font-medium text-gray-800">{userData.contactNumber}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Age</p>
          <p className="font-medium text-gray-800">{userData.age || 'Not specified'}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">College</p>
          <p className="font-medium text-gray-800">{userData.College || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;