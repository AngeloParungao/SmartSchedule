import React, { useState, useEffect } from 'react';
import Sidebar from '../assets/components/sidebar';
import Navbar from '../assets/components/scheduling-navbar';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import '../css/scheduling.css';
import AddItemModal from './AddItemModal';
import DeleteItemModal from './DeleteItemModal';
import EditItemModal from './EditItemModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';


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
  const [selectedGroup, setSelectedGroup] = useState('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('userId'));
  
  useEffect(() => {
    fetchSections();
    fetchSchedules();
  }, []);


  useEffect(() => {
      // Update the default group selection whenever the selectedSection or sections change
      const sectionGroups = sections
      .filter(section => section.section_name === selectedSection)
      .map(section => section.section_group)
      .filter((value, index, self) => self.indexOf(value) === index) // Ensure unique groups

      // Set default group if available
      if (sectionGroups.length > 0) {
      setSelectedGroup(sectionGroups.includes('Group 1') ? 'Group 1' : sectionGroups[0]);
      }
  }, [selectedSection, sections]);


  const fetchSections = async () => {
    try {
      const response = await axios.get(`http://localhost:8082/api/sections/fetch?creator_id=${currentUser}`);
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
      const response = await axios.get(`http://localhost:8082/api/schedule/fetch?creator_id=${currentUser}`);
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
      //FOR ACTIVITY HISTORY
      const number = itemIds.length;
      axios.post("http://localhost:8082/api/activity/adding",{
          user_id : currentUser,
          action : 'Delete',
          details : `${number}`,
          type : 'schedule'
      });

      toast.success('Item/s deleted successfully');
      fetchSchedules(); // Refresh the schedules
      handleCloseDeleteModal(); // Close the modal
    } catch (error) {
      console.error('Error deleting items:', error);
      toast.error('Failed to delete items');
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
    <div>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Sidebar />
      <Navbar />
      <div className="scheduling-container">
        <div className="controls">
          <div>
            <label htmlFor="">Year & Section</label>
            <select className="section-dropdown" value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
              {
                sections.length === 0 ?
                (<option value="Section">Section</option>) :
                (Array.from(new Set(sections.map(section => section.section_name))).map((section, index) => (
                  <option key={index} value={section}>
                    {section}
                  </option>
                )))
              }
            </select>
            <select className="group-dropdown" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
            {
              sections.length === 0 ? 
              (<option value={"Group"}>Group</option>) :
              (sections.map((section, index) => {
                if (section.section_name === selectedSection) {
                  return (
                    <option key={index} value={section.section_group}>
                      {section.section_group}
                    </option>
                  );
                }
                return null;
                }))
            }
            </select>
          </div>
          <div className='scheduling-btns'>
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
                      {time.startTime.slice(0,2) % 12 || 12}:{time.startTime.slice(3,5)} {time.startTime.slice(0, 2)>12? "PM" :  'AM'} - {time.endTime.slice(0, 2) % 12 || 12}:{time.endTime.slice(3,5)} {time.endTime.slice(0, 2) < 12 ? "AM" : "PM"}
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
                      item =>
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
                            <div
                              className='subject-name'
                              style={{ color: isDarkBackground(scheduleItem.background_color) ? 'white' : 'black' }}
                            >
                              {scheduleItem.subject}
                            </div>
                            <div
                              className='instructor-name'
                              style={{ color: isDarkBackground(scheduleItem.background_color) ? 'white' : 'black' }}
                            >
                              {scheduleItem.instructor}
                            </div>
                            <div
                              className='room-name'
                              style={{ color: isDarkBackground(scheduleItem.background_color) ? 'white' : 'black' }}
                            >
                              ({scheduleItem.room})
                            </div>
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
          schedule={schedules.filter(schedule => schedule.section_name === selectedSection && schedule.section_group === selectedGroup)}
          onDeleteItem={handleDeleteItem}
        />
      )}
    </div>
  );
}

function UpdateItemModal({ onClose, schedules, onEditItemClick }) {
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
    <div className="update-screen">
      <div className="update-container">
        <div className="update-header">
          <span>Select Item to Update</span>
          <button onClick={onClose} className="update-close-btn">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="update-body">
          {sortedSchedules.map(schedule => (
            <div
              key={schedule.schedule_id}
              className="schedule-item"
              style={{ background: schedule.background_color }}
              onClick={() => onEditItemClick(schedule)}
            >
              <div className='update-details-left'>
                <span style={{ color: isDarkBackground(schedule.background_color) ? 'white' : 'black' }}>{schedule.instructor}</span>
                <span style={{ color: isDarkBackground(schedule.background_color) ? 'white' : 'black' }}>{schedule.subject}</span>
              </div>
              <div className='update-details-right'>
                <span style={{ color: isDarkBackground(schedule.background_color) ? 'white' : 'black' }}>{schedule.room}</span>
                <span style={{ color: isDarkBackground(schedule.background_color) ? 'white' : 'black' }}>{schedule.day}</span>
                <span style={{ color: isDarkBackground(schedule.background_color) ? 'white' : 'black' }}>({schedule.start_time.slice(0,2) % 12 || 12}:{schedule.start_time.slice(3,5)} {schedule.start_time.slice(0, 2)>12? " PM" :  ' AM'}-{schedule.end_time.slice(0, 2) % 12 || 12}:{schedule.end_time.slice(3,5)} {schedule.end_time.slice(0, 2) < 12 ? " AM" : " PM"})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



export default Scheduling;
