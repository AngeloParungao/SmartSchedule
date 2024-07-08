// DeleteItemModal.jsx
import React, { useState } from 'react';
import '../css/scheduling.css'; // Import any necessary styles

function DeleteItemModal({ onClose, schedules, onDeleteItem }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);


  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allScheduleIds = schedules.map(schedule => schedule.schedule_id);
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
    if(window.confirm("Are you sure you want to delete selected items?")){
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
          <span>Select Item to Delete</span>
          <button onClick={onClose} className="delete-close-btn">X</button>
        </div>
        <div className="delete-body">
          {schedules.map(schedule => (
            <div key={schedule.schedule_id} className="schedule-item" style={{background:schedule.background_color}}>
              <input 
                type="checkbox" 
                checked={selectedItems.includes(schedule.schedule_id)} 
                onChange={() => handleSelectItem(schedule.schedule_id)} 
              />
              <span>{schedule.instructor}</span>
              <span>{schedule.subject}</span> - <span>{schedule.room}</span>
              <span>({schedule.start_time} - {schedule.end_time})</span>
            </div>
          ))}
        </div>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default DeleteItemModal;
