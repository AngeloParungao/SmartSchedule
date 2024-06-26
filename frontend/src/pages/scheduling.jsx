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
  const rowSpans = Array(daysOfWeek.length).fill(0);
  const timesOfDay = [
    { startTime: '07:00:00', endTime: '08:00:00' },
    { startTime: '08:00:00', endTime: '09:00:00' },
    { startTime: '09:00:00', endTime: '10:00:00' },
    { startTime: '10:00:00', endTime: '11:00:00' },
    { startTime: '11:00:00', endTime: '12:00:00' },
    { startTime: '12:00:00', endTime: '13:00:00' },
    { startTime: '13:00:00', endTime: '14:00:00' },
    { startTime: '14:00:00', endTime: '15:00:00' },
    { startTime: '15:00:00', endTime: '16:00:00' },
    { startTime: '16:00:00', endTime: '17:00:00' },
    { startTime: '17:00:00', endTime: '18:00:00' },
    { startTime: '18:00:00', endTime: '19:00:00' },
    { startTime: '19:00:00', endTime: '20:00:00' },
  ];
  
  const [schedules, setSchedules] = useState([]);
  const [sections, setSections] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  useEffect(() => {
    fetchSections();
    fetchInstructors();
    fetchSubjects();
    fetchRooms();
    fetchSchedules();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/sections/fetch');
      setSections(response.data);

      // Set selectedSection and selectedGroup to the first item in sections
      if (response.data.length > 0) {
        setSelectedSection(response.data[0].section_name.toString());
        setSelectedGroup(response.data[0].section_group.toString());
      }


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

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/schedule/fetch');
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to fetch schedules');
    }
  };

  const handleAddItemClick = () => {
    setShowAddItemModal(true);
  };

  const handleCloseModal = () => {
    setShowAddItemModal(false);
  };

  const handleItemAdded = async (newItem) => {
    // Fetch schedules again after adding a new item
    await fetchSchedules();

    // Check if the new item's section and group match the currently selected ones
    if (newItem.section_name === selectedSection && newItem.section_group === selectedGroup) {
      setSchedules((prevSchedules) => [...prevSchedules, newItem]);
    }
  };

  const calculateRowSpan = (startTime, endTime) => {
    const startHour = parseInt(startTime.split(':')[0], 10);
    const endHour = parseInt(endTime.split(':')[0], 10);
    return endHour - startHour;
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
            <select className="section-dropdown" onChange={(e) => setSelectedSection(e.target.value)}>
              {sections.map(section => (
                <option key={section.section_id} value={section.section_name}>
                  {section.section_name}
                </option>
              ))}
            </select>
            <select className="group-dropdown" onChange={(e) => setSelectedGroup(e.target.value)}>
              {sections.map(section => (
                <option key={section.section_id} value={section.section_group}>
                  {section.section_group}
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
              {timesOfDay.map((time, timeIndex) => (
                <tr key={time.startTime}>
                  <td>
                    {time.startTime.slice(0, -6)<12 ? time.startTime.slice(0, -3)+" AM" : time.startTime.slice(0, -3)+" PM"}
                  </td>
                  {daysOfWeek.map((day, dayIndex) => {
                    // Decrease the remaining rowSpan count for each column
                    if (rowSpans[dayIndex] > 0) {
                      rowSpans[dayIndex]--;
                      return null;
                    }

                    // Find the schedule item for the current time and day
                    const scheduleItem = schedules.find(
                      (item) =>
                        item.start_time === time.startTime &&
                        item.day === day &&
                        item.section_name === selectedSection &&
                        item.section_group === selectedGroup
                    );

                    // Calculate rowSpan if there's a schedule item
                    let rowSpan = 1;
                    if (scheduleItem) {
                      rowSpan = calculateRowSpan(scheduleItem.start_time, scheduleItem.end_time);
                      rowSpans[dayIndex] = rowSpan - 1; // Set the remaining rowSpan for this column
                    }

                    return (
                      <td key={`${time.startTime}-${day}`} rowSpan={rowSpan} style={{ backgroundColor: scheduleItem?.background_color }} className='sched'>
                        {scheduleItem && (
                          <>
                            <div className='instructor-name'>{scheduleItem.instructor}</div>
                            <div className='subject-name'>{scheduleItem.subject}</div>
                            <div className='room-name'>({scheduleItem.room})</div>
                          </>
                        )}
                      </td>
                    );
                  })}
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
          section={selectedSection}
          group={selectedGroup}
          onItemAdded={handleItemAdded}
        />        
      )}
    </div>
  );
}

function AddItemModal({ onClose ,instructors, subjects, rooms, section , group , onItemAdded}) {
  const [schedules, setSchedules] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [meetingDay, setMeetingDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [courseType, setCourseType] = useState('Lecture');

  const [currentInstructorPage, setCurrentInstructorPage] = useState(0);
  const [currentSubjectPage, setCurrentSubjectPage] = useState(0);
  const [currentRoomPage, setCurrentRoomPage] = useState(0);
  const itemsPerPage = 5;

  const [instructorError, setInstructorError] = useState(false);
  const [roomError, setRoomError] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    if (instructorName && subjectName && courseType) {
      generateRecommendations(schedules);
    }
  }, [instructorName, subjectName, courseType]);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/schedule/fetch');
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to fetch schedules');
    }
  };

  const handleClickSubject = (subjectName) => {  
    setSubjectName(subjectName);
  };

  const handleClickInstructor = (instructorName) => {  
    setInstructorName(instructorName);
  };

  const handleClickRoom = (roomName) => {  
    setRoomName(roomName);
  };

  const generateRecommendations = (schedules) => {
    if (!instructorName || !roomName) return;

    const duration = courseType === 'Lecture' ? 2 : 3;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const availableSlots = [];

    days.forEach(day => {
      for (let hour = 7; hour <= 20 - duration; hour++) {
        const start = `${hour.toString().padStart(2, '0')}:00:00`;
        const end = `${(hour + duration).toString().padStart(2, '0')}:00:00`;

        const instructorAvailable = !schedules.some(schedule =>
          schedule.instructor === instructorName &&
          schedule.day === day &&
          (
            (start >= schedule.start_time && start < schedule.end_time) ||
            (end > schedule.start_time && end <= schedule.end_time) ||
            (start <= schedule.start_time && end >= schedule.end_time)
          )
        );

        const roomAvailable = !schedules.some(schedule =>
          schedule.room === roomName &&
          schedule.day === day &&
          (
            (start >= schedule.start_time && start < schedule.end_time) ||
            (end > schedule.start_time && end <= schedule.end_time) ||
            (start <= schedule.start_time && end >= schedule.end_time)
          )
        );

        const sectionAvailable = !schedules.some(schedule =>
          schedule.section_name === section &&
          schedule.section_group === group &&
          schedule.day === day &&
          (
            (start >= schedule.start_time && start < schedule.end_time) ||
            (end > schedule.start_time && end <= schedule.end_time) ||
            (start <= schedule.start_time && end >= schedule.end_time)
          )
        );

        if (instructorAvailable && roomAvailable && sectionAvailable) {
          availableSlots.push({ day, start, end });
        }
      }
    });

    setRecommendations(availableSlots);
  };

// Form submission handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the instructor is available
    const instructorAvailability = schedules.some(schedule =>
      schedule.instructor === instructorName &&
      schedule.day === meetingDay &&
      (
        (startTime >= schedule.start_time.slice(0, -3) && startTime < schedule.end_time.slice(0, -3)) ||
        (endTime > schedule.start_time.slice(0, -3) && endTime <= schedule.end_time.slice(0, -3)) ||
        (startTime <= schedule.start_time.slice(0, -3) && endTime >= schedule.end_time.slice(0, -3))
      )
    );

    if (instructorAvailability) {
      toast.error('The selected instructor is not available during this time slot.');
      setInstructorError(true); 
      return;
    }
    else {
      setInstructorError(false);
    }

    // Check if the room is available
    const roomAvailability = schedules.some(
      (schedule) =>
        schedule.room === roomName &&
        schedule.day === meetingDay &&
        ((startTime >= schedule.start_time.slice(0, -3) && startTime < schedule.end_time.slice(0, -3)) ||
          (endTime > schedule.start_time.slice(0, -3) && endTime <= schedule.end_time.slice(0, -3)) ||
          (startTime <= schedule.start_time.slice(0, -3) && endTime >= schedule.end_time.slice(0, -3)))
    );

    if (roomAvailability) {
      toast.error('The selected room is not available during this time slot.');
      setRoomError(true); 
      return;
    } 
    else {
      setRoomError(false);
    }

    const newItem = {
      subjectName,
      instructorName,
      roomName,
      selectedColor,
      meetingDay,
      startTime,
      endTime,
      courseType,
      section,
      group,
    };

    try {
      const response = await axios.post('http://localhost:8082/api/schedule/adding', newItem);
      if (response.status === 200) {
        toast.success('Item added successfully!');
        onItemAdded(newItem);
        onClose();
      } else {
        toast.error('Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className='upper'>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <form className='schedule-form' onSubmit={handleSubmit}>
          <div className='recommendation'>
            <h5>Recommendation</h5>
            <div className='recommended'>
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <div key={index} onClick={() => {
                    setMeetingDay(rec.day);
                    setStartTime(rec.start);
                    setEndTime(rec.end);
                  }}>
                    {rec.day}: {rec.start} - {rec.end}
                  </div>
                ))
              ) : (
                <p>No recommendations available</p>
              )}
            </div>
          </div>
          <div className='left'>
            <div>
              <label>Instructor</label>
              <input
                type="text"
                name="instructorName"
                placeholder="Instructor Name"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                className={instructorError ? 'error-border' : ''}
                required
              />
              {instructorError && <p className="error-message">The selected instructor is not available during this time slot.</p>}
            </div>
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
              <label>Course Type</label>
              <select value={courseType} onChange={(e) => setCourseType(e.target.value)}>
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
              <label>Room #</label>
              <input
                type="text"
                name="roomName"
                placeholder="Room"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className={roomError ? 'error-border' : ''}
                required
              />
              {roomError && <p className="error-message">The selected room is not available during this time slot.</p>}
            </div>
            <div>
              <label>Meeting Day</label>
              <div className="days-checkboxes">
                <label>M<input type="radio" value="Monday" name='day' checked={meetingDay === 'Monday'} onChange={(e) => setMeetingDay(e.target.value)} /></label>
                <label>T<input type="radio" value="Tuesday" name='day' checked={meetingDay === 'Tuesday'} onChange={(e) => setMeetingDay(e.target.value)} /></label>
                <label>W<input type="radio" value="Wednesday" name='day' checked={meetingDay === 'Wednesday'} onChange={(e) => setMeetingDay(e.target.value)} /></label>
                <label>Th<input type="radio" value="Thursday" name='day' checked={meetingDay === 'Thursday'} onChange={(e) => setMeetingDay(e.target.value)} /></label>
                <label>F<input type="radio" value="Friday" name='day' checked={meetingDay === 'Friday'} onChange={(e) => setMeetingDay(e.target.value)} /></label>
                <label>S<input type="radio" value="Saturday" name='day' checked={meetingDay === 'Saturday'} onChange={(e) => setMeetingDay(e.target.value)} /></label>
              </div>
            </div>
            <div>
              <label>Start time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <label>End time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
          <div className='right'>
            <div className='preview' style={{ backgroundColor: selectedColor, height: '100px', width: '100px' }}>
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
