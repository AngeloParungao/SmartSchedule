import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PasswordPrompt from '../assets/components/password-prompt';
import { toast } from 'react-hot-toast';
import '../css/scheduling.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function DeleteItemModal({ onClose, schedule, onDeleteItem }) {
  const [user, setUser] = useState([]);
  const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [schedules, setSchedules] = useState([]);

  // Fetch the current user ID from local storage
  const currentUser = JSON.parse(localStorage.getItem("userId"));

  //VALIDATION OF USER
  useEffect(() => {
    axios.get("http://localhost:8082/api/auth/fetch")
        .then(res => {
            const foundUser = res.data.find(user => user.user_id === currentUser);
            if (foundUser) {
                setUser(foundUser);
            }
        })
        .catch(err => {
            console.error('Failed to fetch users:', err);
            toast.error("Failed to fetch users");
        });
}, []);


  // Fetch subjects when the component mounts
  useEffect(() => {
    fetchSubjects();
    fetchSchedules();
  }, []);



  // Function to fetch subjects
  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/api/subjects/fetch?creator_id=${currentUser}`);
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to fetch subjects');
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/api/schedule/fetch?creator_id=${currentUser}`);
      setSchedules(response.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to fetch schedules');
    }
  };

  // Define the order of days
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Get index of the day
  const getDayIndex = (day) => {
    return daysOrder.indexOf(day);
  };

  // Sort schedules by day and start time
  const sortedSchedules = [...schedule].sort((a, b) => {
    const dayComparison = getDayIndex(a.day) - getDayIndex(b.day);
    if (dayComparison !== 0) return dayComparison;
    return a.start_time.localeCompare(b.start_time);
  });

  // Toggle select all items
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allScheduleIds = sortedSchedules.map(schedule => schedule.schedule_id);
      setSelectedItems(allScheduleIds);
    }
    setSelectAll(prev => !prev);
  };

  // Handle individual item selection
  const handleSelectItem = (scheduleId) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(scheduleId)
        ? prevSelected.filter(id => id !== scheduleId)
        : [...prevSelected, scheduleId]
    );
  };


  const handleDelete = () => {
    if(selectedItems.length === 0){
      toast.error("None is selected")
      return;
    }
    setIsPasswordPromptOpen(true);
  };

  const handlePasswordSubmit = (password) => {
    if (password === user.password) {
      // Prepare items to delete
      const itemsToDelete = new Set(selectedItems);

      // Loop through each selected item
      selectedItems.forEach(selectedId => {
        const selectedSchedule = schedules.find(schedule => schedule.schedule_id === selectedId);

        if (selectedSchedule) {
          const subject = subjects.find(subject => subject.subject_name === selectedSchedule.subject);

          if (subject) {
            const { section_name, section_group } = selectedSchedule;
            const isMinor = subject.subject_type === 'Minor';

            if (isMinor) {
              // Determine the alternate group
              const alternateGroup = section_group === 'Group 1' ? 'Group 2' : 'Group 1';

              // Add schedules from the alternate group
              schedules.forEach(schedule => {
                if (
                  schedule.subject === subject.subject_name &&
                  schedule.section_name === section_name &&
                  (schedule.section_group === section_group || schedule.section_group === alternateGroup)
                ) {
                  if (!itemsToDelete.has(schedule.schedule_id)) {
                    itemsToDelete.add(schedule.schedule_id);
                  }
                }
              });
            }
          }
        }
      });

      // Convert Set to Array and log the IDs to be deleted
      const itemsToDeleteArray = Array.from(itemsToDelete);
      console.log('Items to delete:', itemsToDeleteArray);

      // Call the delete function with all items
      onDeleteItem(itemsToDeleteArray);
    }
    else{
        toast.error("Incorrect password");
    }
  };

  const isDarkBackground = (backgroundColor) => {
    // Convert hex to RGB
    let r = parseInt(backgroundColor.slice(1, 3), 16);
    let g = parseInt(backgroundColor.slice(3, 5), 16);
    let b = parseInt(backgroundColor.slice(5, 7), 16);
    
    // Using luminance formula to determine if color is dark
    let luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    
    return luminance < 0.5;
  };

  return (
    <div className="delete-screen">
      <div className="delete-container">
        <div className="delete-header">
          <input
            type="checkbox"
            className='checkAll'
            checked={selectAll}
            onChange={toggleSelectAll}
          />
          <button onClick={handleDelete} className='delete'>Delete</button>
          <span>Select Item to Delete</span>
          <button onClick={onClose} className="delete-close-btn">
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <PasswordPrompt 
            isOpen={isPasswordPromptOpen} 
            onRequestClose={() => setIsPasswordPromptOpen(false)}
            onSubmit={handlePasswordSubmit} 
          />
        </div>
        <div className="delete-body">
          {sortedSchedules.map(schedule => (
            <div key={schedule.schedule_id} className="schedule-item" style={{ background: schedule.background_color }}>
              <input 
                type="checkbox" 
                checked={selectedItems.includes(schedule.schedule_id)} 
                onChange={() => handleSelectItem(schedule.schedule_id)} 
              />
              <div className='delete-details-left'>
                <span style={{ color: isDarkBackground(schedule.background_color) ? 'white' : 'black' }}>{schedule.instructor}</span>
                <span style={{ color: isDarkBackground(schedule.background_color) ? 'white' : 'black' }}>{schedule.subject}</span>
              </div>
              <div className='delete-details-right'>
                <span style={{ color: isDarkBackground(schedule.background_color) ? 'white' : 'black' }}>{schedule.room}</span>
                <span style={{ color: isDarkBackground(schedule.background_color) ? 'white' : 'black' }}>{schedule.day}</span>
                <span style={{ color: isDarkBackground(schedule.background_color) ? 'white' : 'black' }}>({schedule.start_time.slice(0, 2) % 12 || 12}:{schedule.start_time.slice(3, 5)} {schedule.start_time.slice(0, 2) >= 12 ? " PM" : ' AM'} - {schedule.end_time.slice(0, 2) % 12 || 12}:{schedule.end_time.slice(3, 5)} {schedule.end_time.slice(0, 2) >= 12 ? " PM" : " AM"})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DeleteItemModal;
