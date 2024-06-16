import React, { useState, useEffect } from 'react';
import Sidebar from '../assets/components/sidebar';
import Navbar from '../assets/components/scheduling-navbar';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import '../css/scheduling.css';

function Scheduling() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timesOfDay = ['7:00 - 8:00', '8:00 - 9:00', '9:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00'];
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/sections/fetch');
      setSections(response.data);
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to fetch sections');
    }
  };


  return (
    <div>
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      <Sidebar />
      <Navbar />
      <div className="scheduling-container">
        <div className="controls">
          <div>
            <label htmlFor="">Year & Section</label>
            <select className="section-dropdown">
              {sections.map(section => (
                <option key={section.section_id}>
                  {section.section_name} - {section.section_group}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button className="add-item-btn" onClick={openModal}>Add Item</button>
            <button className="edit-item-btn">Edit Item</button>
            <button className="delete-item-btn">Delete Item</button>
          </div>
        </div>
        <div className="timetable">
          <table>
            <thead>
              <tr>
                <th></th>
                {daysOfWeek.map(day => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timesOfDay.map(time => (
                <tr key={time}>
                  <td>{time}</td>
                  {daysOfWeek.map(day => (
                    <td key={`${day}-${time}`}></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="actions">
          <button className="discard-changes-btn">Discard Changes</button>
          <button className="apply-changes-btn">Apply Changes</button>
        </div>
      </div>
    </div>
  );
}

export default Scheduling;
