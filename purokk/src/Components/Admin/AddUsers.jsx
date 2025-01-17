import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// IMPORTED IMAGES //
import Ayaka from './images/Ayaka.png';

// ////////////////////////////////////////////////////////////////////
const Addstudent = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState('admindashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [middlename, setStudentMiddleName] = useState('');
  const [studentbirthdate, setStudentBirthdate] = useState('');
  const [studentparentcontact, setStudentParentContact] = useState('');
  const [role, setRole] = useState('resident');
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleAddResident = async () => {
    // Validate fields before submitting
    if (!email || !password || !firstname || !lastname || !studentbirthdate || !studentparentcontact) {
      alert('Oops! You need to fill up all fields.');
      return;
    }

    try {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const data = {
        email,
        password,
        firstname,
        lastname,
        middlename,
        studentbirthdate,
        studentparentcontact,
        role,
      };
     
      const response = await axios.post('http://localhost/purok/addresident.php', data, { headers });

      if (response.data && response.data.success) {
        navigate('/residentlogin');
        // Reset form values on success
        setEmail('');
        setPassword('');
        setFirstname('');
        setLastname('');
        setStudentBirthdate('');
        setStudentMiddleName('');
        setStudentParentContact('');
        setRole('resident');
        console.log(response);
      } else {
        // Display error message and restore input values on failure
        console.error('Error:', response.data.message);
        setUploadError(response.data.message);
        setEmail(data.email);
        setPassword(data.password);
        setFirstname(data.firstname);
        setLastname(data.lastname);
        setStudentMiddleName(data.middlename);
        setStudentBirthdate(data.studentbirthdate);
        setStudentParentContact(data.studentparentcontact);
        setRole(data.role);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setUploadError('An error occurred while adding the resident.');
    }
  };

  const validateField = (fieldName, value) => {
    const errors = { ...formErrors };

    switch (fieldName) {
      case 'email':
        if (!value) {
          errors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(value)) {
          errors.email = 'Invalid email format';
        } else {
          errors.email = '';
        }
        break;
      // Add other cases for other fields

      default:
        break;
    }

    setFormErrors(errors);
  };

  const handleInputChange = (fieldName, value) => {
    // Update the state based on the input field
    switch (fieldName) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'firstname':
        setFirstname(value);
        break;
      case 'lastname':
        setLastname(value);
        break;
      case 'middlename':
        setStudentMiddleName(value);
        break;
      case 'studentbirthdate':
        setStudentBirthdate(value);
        break;
      case 'studentparentcontact':
        setStudentParentContact(value);
        break;
      case 'role':
        setRole(value);
        break;
      // Add other cases for each input field

      default:
        break;
    }

    // Validate the field dynamically
    validateField(fieldName, value);
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className='fordashboard' style={{background:'#9cb576'}}>
      <div className="container">
        <main>
          <div className="dashboardMainContent">
            <div className="dashboardTopContent">
              <div className="residentcontainer">
                <div className="change-password-container">
                  <form className='residentform' action="" onSubmit={(e) => {
                    e.preventDefault();
                  }}>
                    <h1>Add Resident</h1>
                    <p className="text-muted">
                      "In every community, there is work to be done. In every nation, there are wounds to heal. In every heart, there is the power to do it."
                    </p>
                    <div className="box">
                    <input
                        className="input-animated"  style={{
                          borderColor: formErrors.role ? 'red' : role ? 'green' : '',
                        }}
                        type="text"
                        placeholder="Lastname"
                        value={lastname}
                        onChange={(e) => handleInputChange('lastname', e.target.value)}
                        
                      />
                      <input
                        className="input-animated"  style={{
                          borderColor: formErrors.role ? 'red' : role ? 'green' : '',
                        }}
                        type="text"
                        placeholder="Firstname"
                        value={firstname}
                        onChange={(e) => handleInputChange('firstname', e.target.value)}
                        
                      />
                      <input
                        className="input-animated"  style={{
                          borderColor: formErrors.role ? 'red' : role ? 'green' : '',
                        }}
                        type="text"
                        placeholder="Middlename"
                        value={middlename}
                        onChange={(e) => handleInputChange('middlename', e.target.value)}
                        
                      />
                      <input
                        className="input-animated"
                        type="date"
                        placeholder="Birthdate"
                        value={studentbirthdate}
                        onChange={(e) => handleInputChange('studentbirthdate', e.target.value)}
                        max={getTodayDate()} // Setting max date to today
                        style={{
                          borderColor: formErrors.studentbirthdate ? 'red' : studentbirthdate ? 'green' : '',
                        }}
                    
                      />
                      <input
                        className="input-animated"  style={{
                          borderColor: formErrors.role ? 'red' : role ? 'green' : '',
                        }}
                        type="text"
                        placeholder="Contact No."
                        value={studentparentcontact}
                        onChange={(e) => handleInputChange('studentparentcontact', e.target.value)}
                        
                      />
                      <input
                        className="input-animated"  style={{
                          borderColor: formErrors.role ? 'red' : role ? 'green' : '',
                        }}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        
                      />
                      <input
                        className="input-animated"  style={{
                          borderColor: formErrors.role ? 'red' : role ? 'green' : '',
                        }}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        
                      />
                      <br />
                      <select
                        className="input-animated"
                        value={role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        style={{
                          borderColor: formErrors.role ? 'red' : role ? 'green' : '',
                        }}
                      >
                        <option value="resident">Resident</option>
                      </select>
                    </div>
                    <br />
                    <div className="addStudentSubmitDiv">
                      <button onClick={handleAddResident} className="btn" disabled={loading}>
                        {loading ? 'Submitting...' : 'Register'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Addstudent;
