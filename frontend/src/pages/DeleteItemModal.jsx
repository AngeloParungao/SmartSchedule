import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import '../css/scheduling.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function DeleteItemModal({ onClose, schedules, onDeleteItem }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Define the order of days
  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Function to get the index of the day
  const getDayIndex = (day) => {
    return daysOrder.indexOf(day);
  };

  // Sort schedules by day and then by start time
  const sortedSchedules = [...schedules].sort((a, b) => {
    const dayComparison = getDayIndex(a.day) - getDayIndex(b.day);
    if (dayComparison !== 0) {
      return dayComparison;
    }
    // Compare by start time if days are the same
    return a.start_time.localeCompare(b.start_time);
  });

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allScheduleIds = sortedSchedules.map(schedule => schedule.schedule_id);
      setSelectedItems(allScheduleIds);
    }
    setSelectAll(prev => !prev);
  };

  const handleSelectItem = (scheduleId) => {
    setSelectedItems(prevSelected => 
      prevSelected.includes(scheduleId)
        ? prevSelected.filter(id => id !== scheduleId)
        : [...prevSelected, scheduleId]
    );
  };

  const handleDelete = () => {
    if (selectedItems.length === 0) {
      toast.error("None is selected");
    } else if (window.confirm("Are you sure you want to delete selected items?")) {
      onDeleteItem(selectedItems);
    }
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
                <span>{schedule.instructor}</span>
                <span>{schedule.subject}</span>
              </div>
              <div className='delete-details-right'>
                <span>{schedule.room}</span>
                <span>{schedule.day}</span>
                <span>({schedule.start_time.slice(0, 2) % 12 || 12}:{schedule.start_time.slice(3, 5)} {schedule.start_time.slice(0, 2) > 12 ? " PM" : ' AM'} - {schedule.end_time.slice(0, 2) % 12 || 12}:{schedule.end_time.slice(3, 5)} {schedule.end_time.slice(0, 2) < 12 ? " AM" : " PM"})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DeleteItemModal;
