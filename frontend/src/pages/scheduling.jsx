import React, { useState, useEffect } from 'react';
import Sidebar from '../assets/components/sidebar';
import Navbar from '../assets/components/scheduling-navbar';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft , faAngleRight } from '@fortawesome/free-solid-svg-icons';
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
  const [roomName, setRoomName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  const [currentInstructorPage, setCurrentInstructorPage] = useState(0);
  const [currentSubjectPage, setCurrentSubjectPage] = useState(0);
  const [currentRoomPage, setCurrentRoomPage] = useState(0);
  const itemsPerPage = 5;

  const handleClickSubject = (subjectName) => {  
    setSubjectName(subjectName);
  };

  const handleClickInstructor = (instructorName) => {  
    setInstructorName(instructorName);
  };

  const handleClickRoom = (roomName) => {  
    setRoomName(roomName);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className='upper'>
          <h3>Add Item</h3>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <form className='schedule-form'>
          <div className='recommendation'>

          </div>
          <div className='left'>
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
              <input
                type="text"
                name="roomrName"
                placeholder="Room"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
              />
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
              <input 
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              />
            </div>
            <div>
              <label>Meeting Day</label>
              <div className="days-checkboxes">
                <label>M<input type="radio" value="M" name='day'/></label>
                <label>T<input type="radio" value="T" name='day'/></label>
                <label>W<input type="radio" value="W" name='day'/></label>
                <label>Th<input type="radio" value="TH" name='day'/></label>
                <label>F<input type="radio" value="F" name='day'/></label>
                <label>S<input type="radio" value="S" name='day'/></label>
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
          </div>
          <div className='right'>
            <div className='preview'style={{ backgroundColor: selectedColor, height: '100px', width: '100px' }}>
                <h6>{subjectName}</h6>
                <h6>{instructorName}</h6>
                <h6>{roomName}</h6>
            </div>
            <button type="submit">Add Item</button>
          </div>
        </form>
        <div className="lists">
          <div className="list-container">
            <h3>Instructors</h3>
            <ul>
              {instructors.slice(currentInstructorPage * itemsPerPage, (currentInstructorPage + 1) * itemsPerPage).map(instructor => (
                <li key={instructor.id} onClick={() => handleClickInstructor(instructor.firstname + ' ' + instructor.middlename + ' ' + instructor.lastname)}>
                  {instructor.firstname + ' ' + instructor.lastname}
                </li>
              ))}
            </ul>
            <ReactPaginate
              previousLabel={
                <FontAwesomeIcon icon={faAngleLeft} className='previous-icon' />
              }
              nextLabel={
                <FontAwesomeIcon icon={faAngleRight} className='previous-icon' />
              }
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={Math.ceil(instructors.length / itemsPerPage)}
              onPageChange={({ selected }) => setCurrentInstructorPage(selected)}
              containerClassName={'pagination'}
              activeClassName={'active-page'}
            />
          </div>
          <div className="list-container">
            <h3>Subjects</h3>
            <ul>
              {subjects.slice(currentSubjectPage * itemsPerPage, (currentSubjectPage + 1) * itemsPerPage).map(subject => (
                <li key={subject.id} onClick={() => handleClickSubject(subject.subject_name)}>
                  {subject.subject_name}
                </li>
              ))}
            </ul>
            <ReactPaginate
              previousLabel={
                <FontAwesomeIcon icon={faAngleLeft} className='previous-icon' />
              }
              nextLabel={
                <FontAwesomeIcon icon={faAngleRight} className='previous-icon' />
              }
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={Math.ceil(subjects.length / itemsPerPage)}
              onPageChange={({ selected }) => setCurrentSubjectPage(selected)}
              containerClassName={'pagination'}
              activeClassName={'active-page'}
            />
          </div>
          <div className="list-container">
            <h3>Rooms</h3>
            <ul>
              {rooms.slice(currentRoomPage * itemsPerPage, (currentRoomPage + 1) * itemsPerPage).map(room => (
                <li key={room.id} onClick={() => handleClickRoom(room.room_name)}>{room.room_name}</li>
              ))}
            </ul>
            <ReactPaginate
              previousLabel={
                <FontAwesomeIcon icon={faAngleLeft} className='previous-icon' />
              }
              nextLabel={
                <FontAwesomeIcon icon={faAngleRight} className='previous-icon' />
              }
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={Math.ceil(rooms.length / itemsPerPage)}
              onPageChange={({ selected }) => setCurrentRoomPage(selected)}
              containerClassName={'pagination'}
              activeClassName={'active-page'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scheduling;
