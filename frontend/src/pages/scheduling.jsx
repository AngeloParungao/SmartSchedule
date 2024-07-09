import React, { useState, useEffect } from 'react';
import Sidebar from '../assets/components/sidebar';
import Navbar from '../assets/components/scheduling-navbar';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import '../css/scheduling.css';
import AddItemModal from './AddItemModal';
import DeleteItemModal from './DeleteItemModal';
import EditItemModal from './EditItemModal';

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
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('Group 1');
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  useEffect(() => {
    fetchSections();
    fetchSchedules();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await axios.get('http://localhost:8082/api/sections/fetch');
      setSections(response.data);
      if (response.data.length > 0) {
        setSelectedSection(response.data[0].section_name.toString());
        setSelectedGroup(response.data[0].section_group.toString());
      } else {
        console.log('No sections fetched.');
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to fetch sections');
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



  //---------UPDATE----------//
  const [showUpdateItemModal, setShowUpdateItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const handleUpdateItemClick = () => {
    setShowUpdateItemModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateItemModal(false);
  };

  const handleEditItemClick = (item) => {
    setItemToEdit(item);
    setShowUpdateItemModal(false);
    setShowEditItemModal(true);
  };
  
  const handleCloseEditModal = () => {
    setShowEditItemModal(false);
  };


  const handleItemUpdated = async () => {
    await fetchSchedules();
  };


  //---------DELETE----------//
  const [showDeleteItemModal, setShowDeleteItemModal] = useState(false); // State for delete modal

  const handleDeleteItemClick = () => {
    setShowDeleteItemModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteItemModal(false);
  };

  const handleDeleteItem = async (itemIds) => {
    try {
      for (const id of itemIds) {
        await axios.delete(`http://localhost:8082/api/schedule/delete/${id}`);
      }
      toast.success('Items deleted successfully');
      fetchSchedules(); // Refresh the schedules
      handleCloseDeleteModal(); // Close the modal
    } catch (error) {
      console.error('Error deleting items:', error);
      toast.error('Failed to delete items');
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
            <select className="section-dropdown" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
              {sections.map(section => (
                <option key={section.section_id} value={section.section_name}>
                  {section.section_name}
                </option>
              ))}
            </select>
            <select className="group-dropdown" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
              <option value="Group 1">Group 1</option>
              <option value="Group 2">Group 2</option>
            </select>
          </div>
          <div>
            <button className="add-item-btn" onClick={handleAddItemClick}>Add Item</button>
            <button className="edit-item-btn" onClick={handleUpdateItemClick}>Edit Item</button>
            <button className="delete-item-btn" onClick={handleDeleteItemClick}>Delete Item</button>
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
              {timesOfDay.map((time) => (
                <tr key={time.startTime}>
                  <td>
                    <span className='time'>
                      {`${time.startTime.slice(0, -6)<12 ? time.startTime.slice(0, -3)+" AM" : time.startTime.slice(0, -3)+" PM"} - ${time.endTime.slice(0, -6)<12 ? time.endTime.slice(0, -3)+" AM" : time.endTime.slice(0, -3)+" PM"}`}
                    </span>
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
          section={selectedSection}
          group={selectedGroup}
          onItemAdded={handleItemAdded}
        />        
      )}
      {showUpdateItemModal && (
        <UpdateItemModal
          onClose={handleCloseUpdateModal}
          schedules={schedules.filter(schedule => schedule.section_name === selectedSection && schedule.section_group === selectedGroup)}
          onEditItemClick={handleEditItemClick}
        />
      )}
      {showEditItemModal && (
        <EditItemModal
          onClose={handleCloseEditModal}
          item={itemToEdit}
          onItemUpdated={handleItemUpdated}
        />
      )}
      {showDeleteItemModal && (
        <DeleteItemModal
          onClose={handleCloseDeleteModal}
          schedules={schedules.filter(schedule => schedule.section_name === selectedSection && schedule.section_group === selectedGroup)}
          onDeleteItem={handleDeleteItem}
        />
      )}
    </div>
  );
}

function UpdateItemModal({ onClose, schedules, onEditItemClick }) {
  return (
    <div className="update-screen">
      <div className="update-container">
        <div className="update-header">
          <span>Select Item to Update</span>
          <button onClick={onClose} className="update-close-btn">X</button>
        </div>
        <div className="update-body">
          {schedules.map(schedule => (
            <div
              key={schedule.schedule_id}
              className="schedule-item"
              style={{ background: schedule.background_color }}
              onClick={() => onEditItemClick(schedule)}
            >
              <span>{schedule.instructor}</span>
              <span>{schedule.subject}</span> - <span>{schedule.room}</span>
              <span>({schedule.start_time} - {schedule.end_time})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



export default Scheduling;
