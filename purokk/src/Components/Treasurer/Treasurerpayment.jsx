import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import Ayaka from '../Admin/images/Ayaka.png';
import Treasurersidebar from '../Sidebar/Treasurersidebar';
import axios from 'axios';
const Treasurerpayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const { currentUser,getToken } = useAuth();
  const [selectedItem, setSelectedItem] = useState('admindashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const token = getToken();

  const handleSelectItem = (item) => {
    if (item === selectedItem) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const name = location.state?.firstName || userData?.firstName || '';
    setFirstName(name || (currentUser ? currentUser.firstName : ''));

    // Fetch announcements here
    fetchAnnouncements();
  }, [location.state, currentUser]);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost/purok/Fetchpendingpayment.php', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.documents || []);
      } else {
        console.error('Failed to fetch announcements:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handlepayment = async (announcement) => {
    try {
        if (!announcement) {
            console.error('No announcement selected for unconfirmation');
            return;
        }

        console.log('Selected Payment:', announcement);

        const token = getToken();
        console.log('Token:', token); // Log the token contents

        const user_id = announcement.id;
        const Payment = +announcement.Payment; // Convert to number

        console.log('Confirm payment for user_id:', user_id);

        const formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('Payment', Payment);

        const response = await axios.post('http://localhost/purok/Confirmpayment.php', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('Server Response:', response); // Log the entire response

        if (response.data.success) {
            console.log('Announcement unconfirmed successfully');
            fetchAnnouncements();
        } else {
            console.error('Failed to unconfirm announcement:', response.data.message);
        }
    } catch (error) {
        console.error('Error unconfirming announcement:', error);
    }
};

  return (
    <div className='fordashboard'>
      <div className="container" >
        <aside className={isMenuOpen ? 'open' : ''}>
          <div className="toggle">
            <div className="logo">
              <span className="material-icons-sharp">
                home
              </span>
              <h2>Purok</h2>
            </div>
            <div className="close" id="close-btn" onClick={handleCloseMenu}>
              <span className="material-icons-sharp">
                close
              </span>
            </div>
          </div>
          <Treasurersidebar selectedItem={selectedItem} handleSelectItem={handleSelectItem} />
        </aside>

        <main>
          <div className="dashboardMainContent">
            <div className="dashboardTopContent"></div>
            <div className="recent-orders">
              <h2>Announcements</h2>
              {Array.isArray(announcements) && announcements.length > 0 ? (
  <table className='residentsTable'>
    <thead>
      <tr>
        <th>Resident ID</th>
        <th>Fullname</th>
        <th>Document Type</th>
        <th>Reason</th>
        <th>Payment Status</th>
        <th>Requested At</th>

      </tr>
    </thead>
    <tbody>
      {announcements.map((announcement) => (
        <tr key={announcement.id}>
          <td>{announcement.resident_id}</td>
          <td>{announcement.Fullname}</td>
          <td>{announcement.document_type}</td>
          <td>{announcement.reason}</td>
          <td>{announcement.Payment}</td>
          <td>{announcement.requested_at}</td>
          <td>
          <button className='btn unconfirm' onClick={() => handlepayment(announcement)}>
              Paid
            </button>
          </td>
          
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>No pending payments</p>
)}
            </div>
          </div>
        </main>

        <div className="right-section">
          <div className="nav">
            <button id="menu-btn" onClick={handleToggleMenu}>
              <span className="material-icons-sharp">
                menu
              </span>
            </button>
            <div className="profile">
              <div className="info">
                <p>Hey, <b>{firstName}</b></p>
                <small className="text-muted">Admin</small>
              </div>
              <div className="profile-photo">
                <img src={Ayaka} alt="Profile 1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Treasurerpayment;
