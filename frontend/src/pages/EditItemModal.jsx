import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faWarning , faLightbulb, faUser, faDoorOpen, faBook } from '@fortawesome/free-solid-svg-icons';
import '../css/scheduling.css';

function EditItemModal({ onClose, item, onItemUpdated }) {
  const [schedules, setSchedules] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);

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
    fetchInstructors();
    fetchSubjects();
    fetchRooms();
  }, []);

  useEffect(() => {
      setSubjectName(item.subject);
      setInstructorName(item.instructor);
      setRoomName(item.room);
      setSelectedColor(item.background_color);
      setMeetingDay(item.day);
      setStartTime(item.start_time);
      setEndTime(item.end_time);
      setCourseType(item.class_type);
  }, [item]);

  useEffect(() => {
    if (instructorName && subjectName && roomName && courseType && meetingDay && startTime && endTime) {
      generateRecommendations(schedules);
    }
  }, [instructorName, subjectName, roomName, courseType, meetingDay, startTime, endTime, schedules]);


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

  const generateRecommendations = (schedules) => {
    if (!instructorName || !roomName || !meetingDay || !startTime || !endTime || !item) {
      setRecommendations([]);
      return;
    }
  
    const duration = courseType === 'Lecture' ? 2 : 3;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const availableSlots = [];
  
    days.forEach(day => {
      for (let hour = 7; hour <= 20 - duration; hour++) {
        const start = `${hour.toString().padStart(2, '0')}:00:00`;
        const end = `${(hour + duration).toString().padStart(2, '0')}:00:00`;
  
        const isConflict = (schedule, start, end) => {
          const scheduleStart = schedule.start_time;
          const scheduleEnd = schedule.end_time;
          return (
            (start >= scheduleStart && start < scheduleEnd) ||
            (end > scheduleStart && end <= scheduleEnd) ||
            (start <= scheduleStart && end >= scheduleEnd)
          );
        };
  
        const instructorAvailable = !schedules.some(schedule =>
          schedule.instructor === item.instructor &&
          schedule.instructor === instructorName &&
          schedule.day === day &&
          isConflict(schedule, start, end)
        );
  
        const roomAvailable = !schedules.some(schedule =>
          schedule.room === item.room &&
          schedule.room === roomName &&
          schedule.day === day &&
          isConflict(schedule, start, end)
        );
  
        const sectionAvailable = !schedules.some(schedule =>
          schedule.section_name === item.section_name &&
          schedule.section_group === item.section_group &&
          schedule.day === day &&
          isConflict(schedule, start, end)
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
    if (schedule.schedule_id === item.schedule_id) return false; // Exclude the current schedule

    const newStartTimeInMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    const newEndTimeInMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
    const start = parseInt(schedule.start_time.split(':')[0]) * 60 + parseInt(schedule.start_time.split(':')[1]);
    const end = parseInt(schedule.end_time.split(':')[0]) * 60 + parseInt(schedule.end_time.split(':')[1]);

    // Check if the schedule matches the selected section and group
    if (
      schedule.section_name === item.section &&
      schedule.section_group === item.group &&
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
    schedule.schedule_id !== item.schedule_id &&
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
    schedule.schedule_id !== item.schedule_id &&
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
    schedule.schedule_id !== item.schedule_id && // Exclude the current schedule
    schedule.subject === subjectName &&
    schedule.section_name === item.section &&
    schedule.section_group === item.group
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

  const alreadyExists = (
    (courseType === 'Lecture' && (hasLecture || item.class_type === 'Laboratory')) || 
    (courseType === 'Laboratory' && (hasLaboratory || item.class_type === 'Lecture'))
  );
  setCourseError(alreadyExists);
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (instructorError || roomError || subjectError || courseError || timeError) {
      toast.error("Error in updating");
      return;
    }

    const updatedItem = {
      subjectName,
      instructorName,
      roomName,
      selectedColor,
      meetingDay,
      startTime,
      endTime,
      courseType,
    };

    try {
      const response = await axios.put(`http://localhost:8082/api/schedule/update/${item.schedule_id}`, updatedItem);
      if (response.status === 200) {
        toast.success('Item updated successfully!');
        onItemUpdated(updatedItem);
        onClose();
      } else {
        toast.error('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };


  //------FILTERING------//

    //------instructors-------//
    const [selectedTag, setSelectedTag] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleTagChange = (e) => {
      setSelectedTag(e.target.value);
      setCurrentInstructorPage(0); // Reset pagination when filter changes
    };
  
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
      setCurrentInstructorPage(0); // Reset pagination when search query changes
    };
  
    const filteredInstructors = instructors.filter(instructor => {
      const matchesTag = selectedTag === '' || instructor.tags === selectedTag;
      const matchesSearch = instructor.firstname.toLowerCase().includes(searchQuery.toLowerCase()) || instructor.lastname.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTag && matchesSearch;
    });


    //------subject-------//
    const handleLevelChange = (e) => {
      setSelectedLevel(e.target.value);
      setCurrentInstructorPage(0); // Reset pagination when filter changes
    }

    const filteredSubjects = subjects.filter(subject => {
      const matchesLevel = selectedLevel === '' || subject.year_lvl === selectedLevel;
      const specialized = selectedTag === '' || subject.subject_tags === selectedTag;
      return matchesLevel && specialized;
    });


    //------rooms-------//
    const filteredRooms = rooms.filter(room => room.room_type === courseType);

  return (
    <div className="modal">
      <div className="modal-content">
        <div className='upper'>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <form className='schedule-form' onSubmit={handleSubmit}>
          <div className='recommendation'>
              <span>
                <FontAwesomeIcon icon={faLightbulb} className='lightbulb' />
                Recommendation
              </span>
                {recommendations.length > 0 ? (
                  recommendations.map((rec, index) => (
                    <div key={index} onClick={() => {
                      setMeetingDay(rec.day);
                      setStartTime(rec.start);
                      setEndTime(rec.end);
                    }}>
                      <span id='day'>
                        {rec.day}
                      </span>
                       : 
                      <span id='time'>
                      {`${rec.start.slice(0, 2) % 12 || 12}:${rec.start.slice(3, 5)} ${rec.start.slice(0, 2) >= 12 ? 'PM' : 'AM'} - ${rec.end.slice(0, 2) % 12 || 12}:${rec.end.slice(3, 5)} ${rec.end.slice(0, 2) >= 12 ? 'PM' : 'AM'}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <p>No recommendations available</p>
                )}
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
                  name="selectedColor"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  required
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
                <label>Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  placeholder="Start Time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div></div>
            </div>
            <div className='form-content'>
              <div>
                <label>End Time</label>
                <input
                  type="time"
                  name="endTime"
                  placeholder="End Time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
              <div>
                {timeError && <p className="error-message">
                  <FontAwesomeIcon icon={faWarning} className='warning-icon' />
                  The class overlaps with another class</p>}
              </div>
            </div>
            <button type="submit" className='add-sched'>Save</button>
          </div>
        </form>
        <div className="lists">
            <div className="list-container">
              <div>
                <h4>
                  <FontAwesomeIcon icon={faUser} className='instructor-icon' />
                  Instructors
                </h4>
                <select name="instructorTags" id="instructorTags" value={selectedTag} onChange={handleTagChange}>
                  <option value="">All</option>
                  {Array.from(new Set(instructors.map(instructor => instructor.tags))).map((tag, index) => (
                    <option key={index} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className='search-bar'
                  placeholder='Search'
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <ul>
                {filteredInstructors.slice(currentInstructorPage * itemsPerPage, (currentInstructorPage + 1) * itemsPerPage).map(instructor => (
                  <li key={instructor.id} onClick={() => setInstructorName(`${instructor.firstname} ${instructor.middlename} ${instructor.lastname}`)}>
                    {instructor.firstname} {instructor.lastname}
                  </li>
                ))}
              </ul>
              <ReactPaginate
                previousLabel={<FontAwesomeIcon icon={faAngleLeft} className='previous-icon' />}
                nextLabel={<FontAwesomeIcon icon={faAngleRight} className='previous-icon' />}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={Math.ceil(filteredInstructors.length / itemsPerPage)}
                onPageChange={({ selected }) => setCurrentInstructorPage(selected)}
                containerClassName={'pagination'}
                activeClassName={'active-page'}
              />
            </div>
            <div className="list-container">
              <h4>
                <FontAwesomeIcon icon={faBook} className='subject-icon' />
                Subjects
              </h4>
              <select name="yearLevel" id="yearLevel" value={selectedLevel} onChange={handleLevelChange}>
                  <option value="">All</option>
                  {Array.from(new Set(subjects.map(subject => subject.year_lvl))).map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              <ul>
                {filteredSubjects.slice(currentSubjectPage * itemsPerPage, (currentSubjectPage + 1) * itemsPerPage).map(subject => (
                  <li key={subject.id} onClick={() => setSubjectName(subject.subject_name)}>
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
              <h4>
                <FontAwesomeIcon icon={faDoorOpen} className='room-icon' />
                Rooms
              </h4>
              <ul>
                {filteredRooms.slice(currentRoomPage * itemsPerPage, (currentRoomPage + 1) * itemsPerPage).map(room => (
                  <li key={room.id} onClick={() => setRoomName(room.room_name)}>{room.room_name}</li>
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

export default EditItemModal;
