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
  const [instructors, setInstructors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  useEffect(() => {
    fetchSections();
    fetchInstructors();
    fetchSubjects();
    fetchRooms();
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

  const fetchInstructors = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/instructors/fetch');
      setInstructors(response.data);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      toast.error('Failed to fetch instructors');
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/subjects/fetch');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to fetch subjects');
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/rooms/fetch');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to fetch rooms');
    }
  };

  const handleAddItemClick = () => {
    setShowAddItemModal(true);
  };

  const handleCloseModal = () => {
    setShowAddItemModal(false);
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
            <button className="add-item-btn" onClick={handleAddItemClick}>Add Item</button>
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
      {showAddItemModal && (
        <AddItemModal
          onClose={handleCloseModal}
          instructors={instructors}
          subjects={subjects}
          rooms={rooms}
        />
      )}
    </div>
  );
}

function AddItemModal({ onClose, instructors, subjects, rooms }) {
  const [subjectName, setSubjectName] = useState('');
  const [instructorName, setInstructorName] = useState('');

  const [currentInstructorPage, setCurrentInstructorPage] = useState(1);
  const [currentSubjectPage, setCurrentSubjectPage] = useState(1);
  const [currentRoomPage, setCurrentRoomPage] = useState(1);
  const itemsPerPage = 5;

  const handleClickSubject = (subjectName) => {  
    setSubjectName(subjectName);
  };

  const handleClickInstructor = (instructorName) => {  
    setInstructorName(instructorName);
  };

  const paginate = (array, pageNumber) => {
    const start = (pageNumber - 1) * itemsPerPage;
    return array.slice(start, start + itemsPerPage);
  };

  const handleNextPage = (setter, currentPage, itemsArray) => {
    if (currentPage * itemsPerPage < itemsArray.length) {
      setter(currentPage + 1);
    }
  };

  const handlePreviousPage = (setter, currentPage) => {
    if (currentPage > 1) {
      setter(currentPage - 1);
    }
  };

  const pageCount = (array) => {
    return Math.ceil(array.length / itemsPerPage);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className='upper'>
          <h2>Add Item</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="lists">
          <div className="list-container">
            <h3>Instructors</h3>
            <ul>
              {paginate(instructors, currentInstructorPage).map(instructor => (
                <li key={instructor.id} onClick={() => handleClickInstructor(instructor.firstname + ' ' + instructor.middlename + ' ' + instructor.lastname)}>
                  {instructor.firstname + ' ' + instructor.lastname}
                </li>
              ))}
            </ul>
            <button onClick={() => handlePreviousPage(setCurrentInstructorPage, currentInstructorPage)}>Previous</button>
            <p>Page {currentInstructorPage} of {pageCount(instructors)}</p>
            <button onClick={() => handleNextPage(setCurrentInstructorPage, currentInstructorPage, instructors)}>Next</button>
          </div>
          <div className="list-container">
            <h3>Subjects</h3>
            <ul>
              {paginate(subjects, currentSubjectPage).map(subject => (
                <li key={subject.id} onClick={() => handleClickSubject(subject.subject_name)}>
                  {subject.subject_name}
                </li>
              ))}
            </ul>
            <button onClick={() => handlePreviousPage(setCurrentSubjectPage, currentSubjectPage)}>Previous</button>
            <p>Page {currentSubjectPage} of {pageCount(subjects)}</p>
            <button onClick={() => handleNextPage(setCurrentSubjectPage, currentSubjectPage, subjects)}>Next</button>
          </div>
          <div className="list-container">
            <h3>Rooms</h3>
            <ul>
              {paginate(rooms, currentRoomPage).map(room => (
                <li key={room.id}>{room.room_name}</li>
              ))}
            </ul>
            <button onClick={() => handlePreviousPage(setCurrentRoomPage, currentRoomPage)}>Previous</button>
            <p>Page {currentRoomPage} of {pageCount(rooms)}</p>
            <button onClick={() => handleNextPage(setCurrentRoomPage, currentRoomPage, rooms)}>Next</button>
          </div>
        </div>
        <form>
          <div>
            <label>Course Title</label>
            <input
              type="text"
              name="subjectName"
              placeholder="Subject Name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Instructor</label>
            <input
              type="text"
              name="instructorName"
              placeholder="Instructor Name"
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Room #</label>
            <select>
              {rooms.map(room => (
                <option key={room.id}>{room.room_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Course Type</label>
            <select>
              <option>Lecture</option>
              <option>Laboratory</option>
            </select>
          </div>
          <div>
            <label>Color</label>
            <input type="color" />
          </div>
          <div>
            <label>Meeting Day</label>
            <div className="days-checkboxes">
              <label><input type="checkbox" value="M" /> M</label>
              <label><input type="checkbox" value="T" /> T</label>
              <label><input type="checkbox" value="W" /> W</label>
              <label><input type="checkbox" value="TH" /> TH</label>
              <label><input type="checkbox" value="F" /> F</label>
              <label><input type="checkbox" value="S" /> S</label>
            </div>
          </div>
          <div>
            <label>Start time</label>
            <input type="time" />
          </div>
          <div>
            <label>End time</label>
            <input type="time" />
          </div>
          <button type="submit">Add Item</button>
        </form>
      </div>
    </div>
  );
}


export default Scheduling;
