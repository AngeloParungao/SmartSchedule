// src/components/ActivityLog.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../assets/components/sidebar';
import "../css/activityLogs.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPerson, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';

function ActivityLog() {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const response = await axios.get("http://localhost:8082/api/activity/fetch");
      setActivity(response.data);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'instructor':
        return <FontAwesomeIcon icon={faPerson} />;
      case 'section':
        return <FontAwesomeIcon icon={faSearch} />;
      case 'subject':
        return <FontAwesomeIcon icon={faSearch} />;
      case 'rooms':
        return <FontAwesomeIcon icon={faSearch} />;
      default:
        return null;
    }
  };

  const getBackgroundColor = (action) => {
    switch (action) {
      case 'Add':
        return '#ccffcc';
      case 'Update':
        return '#ffffcc';
      case 'Delete':
        return '#ffcccc';
      default:
        return 'white';
    }
  };

  const getActionMessage = (log) => {
    switch (log.action) {
      case 'Add':
        if(log.type == "instructor"){
          return `${log.details} has been added to ${log.type}`;
        }
        else if(log.type == "section"){
          return `Section ${log.details} has been created`;
        }
        else if(log.type == "subject"){
          return `${log.details} has been added to ${log.type}`;
        }
        else if(log.type == "room"){
          return `${log.details} has been added to ${log.type}`;
        }
        else if(log.type == "schedule"){
          return `Schedule added for ${log.details}`;
        }
      case 'Update':
        if(log.type == "instructor"){
          return `Instructor ${log.details} has been updated`;
        }
        else if(log.type == "section"){
          return `Section ${log.details} has been updated`;
        }
        else if(log.type == "subject"){
          return `Subject ${log.details} has been updated`;
        }
        else if(log.type == "room"){
          return `Room ${log.details} has been updated`;
        }
        else if(log.type == "schedule"){
          return `Schedule added for ${log.details}`;
        }
      case 'Delete':
        return `${log.details} ${log.type} has been deleted`;
      default:
        return log.details;
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="activity-log-container">
        <div className="activity-log-header">
          Activity Logs
        </div>
        <div className="activity-log">
          <div className='activity-log-wrapper'>
            <div className='list'>
              {activity.map((log, index) => (
                <div
                  key={index}
                  className="activity-log-item"
                  style={{ backgroundColor: getBackgroundColor(log.action) }}
                >
                  <div className="activity-log-icon">
                    {getIcon(log.type)}
                  </div>
                  <div className="activity-log-content">
                    <div className="activity-log-action">
                      {getActionMessage(log)}
                    </div>
                    <div className="activity-log-timestamp">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityLog;
