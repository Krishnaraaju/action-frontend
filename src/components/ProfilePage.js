import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    // TODO: Fetch user data from API
    const fetchUserData = async () => {
      try {
        // Mock user data for now
        const mockUser = {
          id: 1,
          fullName: 'John Doe',
          email: 'john@example.com',
          role: 'both',
          joinedDate: '2024-01-01',
          totalBids: 15,
          wonAuctions: 3,
          createdAuctions: 5,
        };
        setUser(mockUser);
        setFormData({
          fullName: mockUser.fullName,
          email: mockUser.email,
          role: mockUser.role,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to update user profile
      console.log('Updating profile:', formData);
      setUser({ ...user, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Profile Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-600 hover:text-blue-700"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid gap-4">
              <div>
                <h3 className="text-gray-600">Full Name</h3>
                <p className="text-lg">{user.fullName}</p>
              </div>
              <div>
                <h3 className="text-gray-600">Email</h3>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <h3 className="text-gray-600">Role</h3>
                <p className="text-lg capitalize">{user.role}</p>
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Total Bids</h3>
            <p className="text-3xl font-bold text-blue-600">{user.totalBids}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Won Auctions</h3>
            <p className="text-3xl font-bold text-green-600">{user.wonAuctions}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Created Auctions</h3>
            <p className="text-3xl font-bold text-purple-600">{user.createdAuctions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 