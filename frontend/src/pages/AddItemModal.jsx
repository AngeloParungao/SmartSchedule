import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import '../css/scheduling.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faWarning } from '@fortawesome/free-solid-svg-icons';

function AddItemModal({ onClose, instructors, subjects, rooms, section, group, onItemAdded }) {
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
    const [courseError, setCourseError] = useState(false);
    const [subjectError, setSubjectError] = useState(false);
    const [timeError, setTimeError] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
  
    useEffect(() => {
      fetchSchedules();
    }, []);
  
    useEffect(() => {
      if (instructorName && subjectName && roomName && courseType) {
        generateRecommendations(schedules);
      }
    }, [instructorName, subjectName, roomName, courseType]);
  
    useEffect(() => {
      checkRealTimeErrors();
    }, [instructorName, subjectName, roomName, meetingDay, startTime, endTime, courseType]);
  
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
        if (!instructorName || !roomName) {
          setRecommendations([]); // Clear recommendations if instructor or room is not selected
          return;
        }
      
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
      
  
      const checkRealTimeErrors = () => {
        const timeConflict = (schedule) => {
          const newStartTimeInMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
          const newEndTimeInMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
          const start = parseInt(schedule.start_time.split(':')[0]) * 60 + parseInt(schedule.start_time.split(':')[1]);
          const end = parseInt(schedule.end_time.split(':')[0]) * 60 + parseInt(schedule.end_time.split(':')[1]);
      
          // Check if the schedule matches the selected section and group
          if (
            schedule.section_name === section &&
            schedule.section_group === group &&
            schedule.day === meetingDay
          ) {
            return (
              (newStartTimeInMinutes >= start && newStartTimeInMinutes < end) ||
              (newEndTimeInMinutes > start && newEndTimeInMinutes <= end) ||
              (newStartTimeInMinutes <= start && newEndTimeInMinutes >= end)
            );
          }
          return false;
        };
      
        const hasTimeConflict = schedules.some(timeConflict);
        setTimeError(hasTimeConflict);
      
        const instructorAvailability = schedules.some(schedule =>
          schedule.instructor === instructorName &&
          schedule.day === meetingDay &&
          (
            (startTime >= schedule.start_time.slice(0, -3) && startTime < schedule.end_time.slice(0, -3)) ||
            (endTime > schedule.start_time.slice(0, -3) && endTime <= schedule.end_time.slice(0, -3)) ||
            (startTime <= schedule.start_time.slice(0, -3) && endTime >= schedule.end_time.slice(0, -3))
          )
        );
        setInstructorError(instructorAvailability);
      
        const roomAvailability = schedules.some(schedule =>
          schedule.room === roomName &&
          schedule.day === meetingDay &&
          (
            (startTime >= schedule.start_time.slice(0, -3) && startTime < schedule.end_time.slice(0, -3)) ||
            (endTime > schedule.start_time.slice(0, -3) && endTime <= schedule.end_time.slice(0, -3)) ||
            (startTime <= schedule.start_time.slice(0, -3) && endTime >= schedule.end_time.slice(0, -3))
          )
        );
        setRoomError(roomAvailability);
      
        const startTimeInMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
        const endTimeInMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
        const newDuration = (endTimeInMinutes - startTimeInMinutes) / 60;
      
        const subjectSectionSchedules = schedules.filter(schedule =>
          schedule.subject === subjectName &&
          schedule.section_name === section &&
          schedule.section_group === group
        );
      
        const totalHours = subjectSectionSchedules.reduce((sum, schedule) => {
          const start = parseInt(schedule.start_time.split(':')[0]) * 60 + parseInt(schedule.start_time.split(':')[1]);
          const end = parseInt(schedule.end_time.split(':')[0]) * 60 + parseInt(schedule.end_time.split(':')[1]);
          return sum + (end - start) / 60;
        }, 0);
      
        const numberOfMeetings = subjectSectionSchedules.length;
      
        const exceedsLimits = totalHours + newDuration > 5 || numberOfMeetings >= 2;
        setSubjectError(exceedsLimits);
      
        const hasLecture = subjectSectionSchedules.some(schedule => schedule.class_type === 'Lecture');
        const hasLaboratory = subjectSectionSchedules.some(schedule => schedule.class_type === 'Laboratory');
      
        const alreadyExists = (courseType === 'Lecture' && hasLecture) || (courseType === 'Laboratory' && hasLaboratory);
        setCourseError(alreadyExists);
      };
      
      
      
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (instructorError || roomError || subjectError || courseError || timeError) {toast.error("Error in adding"); return;}
      else{
  
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
    }
    };
  
    const filteredRooms = rooms.filter(room => room.room_type === courseType);
  
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
            <div className='form'>
              <div className='form-content'>
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
                </div>
                <div>
                  {instructorError && <p className="error-message">
                    <FontAwesomeIcon icon={faWarning} className='warning-icon' />
                    Instructor is not available during this time slot.</p>}
                </div>
              </div>
              <div className='form-content'>
                <div>
                  <label>Course Title</label>
                  <input
                    type="text"
                    name="subjectName"
                    placeholder="Subject Name"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className={subjectError ? 'error-border' : ''}
                    required
                  />
                </div>
                <div>
                  {subjectError && <p className="error-message">
                    <FontAwesomeIcon icon={faWarning} className='warning-icon' />
                    Subject has reached meeting quota</p>}
                </div>
              </div>
              <div className='form-content'>
                <div>
                  <label>Course Type</label>
                  <select value={courseType} className={courseError ? 'error-border' : ''} onChange={(e) => setCourseType(e.target.value)} >
                    <option>Lecture</option>
                    <option>Laboratory</option>
                  </select>
                </div>
                <div>
                  {courseError && <p className="error-message">
                    <FontAwesomeIcon icon={faWarning} className='warning-icon' />
                    This course type is already created</p>}
                </div>
              </div>
              <div className='form-content'>
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
                </div>
                <div>
                  {roomError && <p className="error-message">
                    <FontAwesomeIcon icon={faWarning} className='warning-icon' />
                    Room is not available during this time slot.</p>}
                </div>
              </div>
              <div className='form-content'>
                <div>
                  <label>Color</label>
                  <input 
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                  />
                </div>
                <div></div>
              </div>
              <div className='form-content'>
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
                <div></div>
              </div>
              <div className='form-content'>
                <div>
                  <label>Start time</label>
                  <input 
                    type="time" 
                    value={startTime} 
                    className={timeError ? 'error-border' : ''}
                    onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div>
                  {timeError && <p className="error-message">
                    <FontAwesomeIcon icon={faWarning} className='warning-icon' />
                    Time not available for this section</p>}
                </div>
              </div>
              <div className='form-content'>
                <div>
                  <label>End time</label>
                  <input 
                    type="time" 
                    value={endTime} 
                    className={timeError ? 'error-border' : ''}
                    onChange={(e) => setEndTime(e.target.value)} />
                </div>
                <div></div>
              </div>
              <button className="add-sched" type="submit">Add Item</button>
            </div>
            {/*<div className='right'>
              {instructorError && <p className="error-message">The selected instructor is not available during this time slot.</p>}
              {roomError && <p className="error-message">The selected room is not available during this time slot.</p>}
              <div className='preview' style={{ backgroundColor: selectedColor, height: '100px', width: '100px' }}>
                  <h6>{subjectName}</h6>
                  <h6>{instructorName}</h6>
                  <h6>{roomName}</h6>
              </div>
            </div>*/}
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
                {filteredRooms.slice(currentRoomPage * itemsPerPage, (currentRoomPage + 1) * itemsPerPage).map(room => (
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
                pageCount={Math.ceil(filteredRooms.length / itemsPerPage)}
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

export default AddItemModal;