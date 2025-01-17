import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext'; 
import axios from 'axios';
import Ayaka from '../Admin/images/Ayaka.png'
import Residentsidebard from '../Sidebar/Residentsidebar'

const Residentannouncement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const { currentUser} = useAuth(); 
  const [selectedItem, setSelectedItem] = useState('admindashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0); // State to store unread announcements count

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
    
  }, [location.state, currentUser]);
 
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Fetch documents from the server
        const response = await axios.get('http://localhost/purok/Residentfetchrequest.php', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (response.data && response.data.success) {
          if (response.data.documents) {
            // Filter out documents that are not confirmed by the president
            const filteredDocuments = response.data.documents.filter(document => document.confirm_by_president);
            // Update the documents state with the filtered data
            setDocuments(filteredDocuments);
          } else {
            console.error('Failed to fetch documents: "documents" property is missing in the response');
          }
        } else {
          console.error('Failed to fetch documents: Server response does not indicate success');
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
  
    fetchDocuments();
  }, []);

  useEffect(() => {
    const fetchUnreadAnnouncementsCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost/purok/Fetchresidentannouncement.php', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.data && response.data.success) {
          setUnreadAnnouncements(response.data.unreadAnnouncements || 0);
        } else {
          console.error('Failed to fetch unread announcements:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching unread announcements:', error);
      }
    };
  
    fetchUnreadAnnouncementsCount();
  }, []);

  return (
    <div className='fordashboard'>
      <div className="container">
        <aside className={isMenuOpen ? 'open' : ''}>
          <div className="toggle">
            <div className="logo">
              <span className="material-icons-sharp">home</span>
              <h2>Purok</h2>
            </div>
            <div className="close" id="close-btn" onClick={handleCloseMenu}>
              <span className="material-icons-sharp">close</span>
            </div>
          </div>
          <Residentsidebard selectedItem={selectedItem} handleSelectItem={handleSelectItem} />
        </aside>

        <main>
          <div className="dashboardMainContent">
            <div className="dashboardTopContent"></div>
            <div className="recent-orders">
              <h1>Announcements</h1>
              {documents.length > 0 ? (
                <table className="announcement-table">
                  <thead>
                    <tr>
                      <th>Document Type</th>
                      <th>Reason</th>
                      <th>Approved at</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((document, index) => (
                      <tr key={index}>
                        <td>{document.document_type}</td>
                        <td>{document.reason}</td>
                        <td>{new Date(document.confirm_by_president).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No announcements today</p>
              )}
              {unreadAnnouncements > 0 && <span className="badge"></span>} {/* Render dots if there are unread announcements */}
            </div>
          </div>
        </main>

        <div className="right-section">
          <div className="nav">
            <button id="menu-btn" onClick={handleToggleMenu}>
              <span className="material-icons-sharp">menu</span>
            </button>
            <div className="profile">
              <div className="info">
                <p>Hey, <b>{firstName}</b></p>
                <small className="text-muted">Resident</small>
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

export default Residentannouncement;
