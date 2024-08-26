import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Ayaka from '../Admin/images/Ayaka.png';
import Residentsidebar from '../Sidebar/Residentsidebar';
import axios from 'axios';

const Residentprofile = () => {
  const location = useLocation();
  const [firstName, setFirstName] = useState('');
  const { currentUser, getToken } = useAuth();
  const token = getToken();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Authorization': `Bearer ${token}`,
        };

        const response = await axios.get('http://localhost/purok/UserDetails.php', {
          headers: headers,
        });

        if (response.data && response.data.success) {
          if (response.data.userDetails) {
            const userDetails = JSON.parse(response.data.userDetails);
            setUserDetails(userDetails);
          } else {
            console.error('Failed to fetch user details: "userDetails" property is missing in the response');
          }
        } else {
          console.error('Failed to fetch user details: "success" property is missing in the response');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const name = location.state?.firstName || userData?.firstName || '';
    setFirstName(name || (currentUser ? currentUser.firstName : ''));
  }, [location.state, currentUser]);

  return (
    <div className='fordashboard'>
      <div className='container'>
        <aside>
          {/* Sidebar component */}
          <Residentsidebar />
        </aside>

        <main>
          <div className='dashboardMainContent'>
            <div className="profileDivMain">
              <h1>Profile of Resident <span style={{ color: 'green' }}>{firstName}</span></h1>
            </div>
          </div>
          <div className="recent-orders">
            {userDetails && userDetails.success ? (
              userDetails.userDetails ? (
                <table className='userDetailsTable'>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{userDetails.userDetails.firstName}</td>
                      <td>{userDetails.userDetails.email}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p>No user details available</p>
              )
            ) : (
              <p>No user details available</p>
            )}
          </div>
        </main>

        <div className='right-section'>
          <div className='nav'>
            <div className='profile'>
              <div className='info'>
                <p>Hey, <b>{firstName}</b></p>
                <small className='text-muted'>Resident</small>
              </div>
              <div className='profile-photo'>
                <img src={Ayaka} alt='Profile 1' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Residentprofile;
