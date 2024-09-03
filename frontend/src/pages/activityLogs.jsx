import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../assets/components/sidebar";
import "../css/activityLogs.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faChalkboardTeacher,
  faBook,
  faDoorClosed,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

function ActivityLog() {
  const url = "http://localhost:8082/";

  const [activity, setActivity] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("userId"));

  useEffect(() => {
    toast.dismiss();
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const response = await axios.get(
        `${url}api/activity/fetch?user_id=${currentUser}`
      );
      setActivity(response.data);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "instructor":
        return <FontAwesomeIcon icon={faUser} />;
      case "section":
        return <FontAwesomeIcon icon={faChalkboardTeacher} />;
      case "subject":
        return <FontAwesomeIcon icon={faBook} />;
      case "room":
        return <FontAwesomeIcon icon={faDoorClosed} />;
      case "schedule":
        return <FontAwesomeIcon icon={faCalendar} />;
      default:
        return null;
    }
  };

  const getBackgroundColor = (action) => {
    switch (action) {
      case "Add":
        return "#ccffcc";
      case "Update":
        return "#ffffcc";
      case "Delete":
        return "#ffcccc";
      default:
        return "white";
    }
  };

  const getActionMessage = (log) => {
    switch (log.action) {
      case "Add":
        if (log.type === "instructor") {
          return `${log.details} has been added to ${log.type}`;
        } else if (log.type === "section") {
          return `Section ${log.details} has been created`;
        } else if (log.type === "subject") {
          return `${log.details} has been added to ${log.type}`;
        } else if (log.type === "room") {
          return `${log.details} has been added to ${log.type}`;
        } else if (log.type === "schedule") {
          return `Schedule added for ${log.details}`;
        }
      case "Update":
        if (log.type === "instructor") {
          return `Instructor ${log.details} has been updated`;
        } else if (log.type === "section") {
          return `Section ${log.details} has been updated`;
        } else if (log.type === "subject") {
          return `Subject ${log.details} has been updated`;
        } else if (log.type === "room") {
          return `Room ${log.details} has been updated`;
        } else if (log.type === "schedule") {
          return `Schedule added for ${log.details}`;
        }
      case "Delete":
        return `${log.details} ${log.type} has been deleted`;
      default:
        return log.details;
    }
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const filteredActivity = selectedDate
    ? activity.filter(
        (log) =>
          new Date(log.timestamp).toISOString().split("T")[0] === selectedDate
      )
    : activity;

  // Sort the filteredActivity by timestamp in descending order
  const sortedActivity = filteredActivity.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div>
      <Sidebar />
      <div className="activity-log-container">
        <div className="activity-log-header">
          <span>Activity Logs</span>
        </div>
        <div className="activity-log">
          <div className="activity-log-wrapper">
            <div className="list-header">
              History
              <div>
                <label htmlFor="date" className="date-label">
                  Date:{" "}
                </label>
                <input
                  className="date"
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              </div>
            </div>
            <div className="list">
              {sortedActivity.map((log, index) => (
                <div
                  key={index}
                  className="activity-log-item"
                  style={{ backgroundColor: getBackgroundColor(log.action) }}
                >
                  <div className="activity-log-icon">{getIcon(log.type)}</div>
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
