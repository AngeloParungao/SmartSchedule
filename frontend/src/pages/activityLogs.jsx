// src/components/ActivityLog.js
import React from 'react';
import Sidebar from '../assets/components/sidebar';
import "../css/activityLogs.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCheck, faTrash} from '@fortawesome/free-solid-svg-icons';


const activities = [
  { id: 1, message: 'BSIT 3D - G1 Schedule has been added to the draft.', type: 'draft' },
  { id: 2, message: 'BSIT 1A - G1 Schedule has been published successfully.', type: 'success' },
  { id: 3, message: 'BSIT 2B - G2 Schedule has been deleted successfully.', type: 'delete' },
  { id: 4, message: 'BSIT 3A - G1 Schedule has been deleted successfully.', type: 'delete' },
  { id: 5, message: 'BSIT 1A - G1 Schedule has been published successfully.', type: 'success' },
  { id: 6, message: 'BSIT 3D - G1 Schedule has been added to the draft.', type: 'draft' },
  { id: 7, message: 'BSIT 1A - G2 Schedule has been published successfully.', type: 'success' },
  { id: 8, message: 'BSIT 1B - G1 Schedule has been published successfully.', type: 'success' }
];

const ActivityLog = () => {
  const getIcon = (type) => {
    switch (type) {
      case 'draft':
        return <FontAwesomeIcon icon={faSearch} className='calendar'/>;
      case 'success':
        return <FontAwesomeIcon icon={faCheck} className='calendar'/>;
      case 'delete':
        return <FontAwesomeIcon icon={faTrash} className='calendar'/>;
      default:
        return null;
    }
  };

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'draft':
        return '#ffffcc';
      case 'success':
        return '#ccffcc';
      case 'delete':
        return '#ffcccc';
      default:
        return 'white';
    }
  };

  return (
    <div>
        <Sidebar/>
        <div className="activity-log-container">
            <div className="activity-log-header">
                Activity Logs
            </div>
            <div className="activity-log-list">
                
            </div>
        </div>
    </div>
  );
};

export default ActivityLog;
