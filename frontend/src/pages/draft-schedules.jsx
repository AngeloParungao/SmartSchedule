import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "../assets/components/sidebar";
import "../css/draft-schedule.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Draft() {
  const url = "http://localhost:8082/";

  const currentUser = JSON.parse(localStorage.getItem("userId"));

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const rowSpans = Array(daysOfWeek.length).fill(0);
  const timesOfDay = [
    { startTime: "07:00:00", endTime: "08:00:00" },
    { startTime: "08:00:00", endTime: "09:00:00" },
    { startTime: "09:00:00", endTime: "10:00:00" },
    { startTime: "10:00:00", endTime: "11:00:00" },
    { startTime: "11:00:00", endTime: "12:00:00" },
    { startTime: "12:00:00", endTime: "13:00:00" },
    { startTime: "13:00:00", endTime: "14:00:00" },
    { startTime: "14:00:00", endTime: "15:00:00" },
    { startTime: "15:00:00", endTime: "16:00:00" },
    { startTime: "16:00:00", endTime: "17:00:00" },
    { startTime: "17:00:00", endTime: "18:00:00" },
    { startTime: "18:00:00", endTime: "19:00:00" },
    { startTime: "19:00:00", endTime: "20:00:00" },
  ];

  const calculateRowSpan = (startTime, endTime) => {
    const startHour = parseInt(startTime.split(":")[0], 10);
    const endHour = parseInt(endTime.split(":")[0], 10);
    return endHour - startHour;
  };

  const [schedules, setSchedules] = useState([]);
  const [sections, setSections] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [category, setCategory] = useState("section");
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  useEffect(() => {
    toast.dismiss();
    fetchSchedules();
    fetchSections();
    fetchInstructors();
  }, []);

  useEffect(() => {
    // Update the default group selection whenever the selectedSection or sections change
    const sectionGroups = sections
      .filter((section) => section.section_name === selectedSection)
      .map((section) => section.section_group)
      .filter((value, index, self) => self.indexOf(value) === index); // Ensure unique groups

    // Set default group if available
    if (sectionGroups.length > 0) {
      setSelectedGroup(
        sectionGroups.includes("Group 1") ? "Group 1" : sectionGroups[0]
      );
    }
  }, [selectedSection, sections]);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(
        `${url}api/schedule/fetch?creator_id=${currentUser}`
      );
      setSchedules(response.data);

      if (response.data.length > 0) {
        setSelectedInstructor(response.data[0].instructor.toString());
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Failed to fetch schedules");
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get(
        `${url}api/sections/fetch?creator_id=${currentUser}`
      );
      setSections(response.data);

      if (response.data.length > 0) {
        setSelectedSection(response.data[0].section_name.toString());
        setSelectedGroup(response.data[0].section_group.toString());
      }
    } catch (error) {
      console.error("Error fetching sections:", error);
      toast.error("Failed to fetch sections");
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await axios.get(
        `${url}api/instructors/fetch?creator_id=${currentUser}`
      );
      setInstructors(response.data);
    } catch (error) {
      console.error("Error fetching instructors:", error);
      toast.error("Failed to fetch instructors");
    }
  };

  const generatePDF = async () => {
    const scheduleContainer = document.querySelector("#scheduleTable");

    if (!scheduleContainer) {
      toast.error("No schedule found to print.");
      return;
    }

    // Temporarily change time color to black
    const timeElements = document.querySelectorAll(".time");
    timeElements.forEach((el) => {
      el.style.color = "black";
    });

    try {
      // Adjust html2canvas settings if needed
      const canvas = await html2canvas(scheduleContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: null, // Adjust as needed
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4"); // Landscape orientation
      const imgWidth = 297; // A4 width in mm for landscape
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 210; // A4 height in mm for landscape
      let heightLeft = imgHeight;
      let position = 0;

      // Add heading based on the selected category
      pdf.setFontSize(18);
      pdf.text("Schedule for:", 14, 20);

      if (category === "instructor") {
        pdf.setFontSize(14);
        pdf.text(`Instructor: ${selectedInstructor}`, 14, 30);
      } else {
        pdf.setFontSize(14);
        pdf.text(
          `Section: ${selectedSection}, Group: ${selectedGroup}`,
          14,
          30
        );
      }

      // Add the schedule table image
      pdf.addImage(imgData, "PNG", 0, 40, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("schedule.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      // Revert time color back to original
      timeElements.forEach((el) => {
        el.style.color = "";
      });
    }
  };

  const generateAllPDFs = async () => {
    try {
      const timeElements = document.querySelectorAll(".time");
      timeElements.forEach((el) => {
        el.style.color = "black";
      });

      const pdf = new jsPDF("l", "mm", "a4"); // Landscape orientation

      let isFirstPage = true; // Flag to check if it's the first page

      pdf.setFontSize(18);

      if (category === "instructor") {
        for (const instructor of instructors) {
          setSelectedInstructor(
            `${instructor.firstname} ${instructor.middlename} ${instructor.lastname}`
          );
          await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for state update
          const scheduleContainer = document.querySelector("#scheduleTable");
          const canvas = await html2canvas(scheduleContainer, {
            scale: 2,
            useCORS: true,
            backgroundColor: null, // Adjust as needed
          });
          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 297; // A4 width in mm for landscape
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          const pageHeight = 210; // A4 height in mm for landscape
          let heightLeft = imgHeight;
          let position = 0;

          if (!isFirstPage) {
            pdf.addPage();
          } else {
            isFirstPage = false; // After the first page, all subsequent pages should be added normally
          }

          pdf.text(
            `Instructor: ${instructor.firstname} ${instructor.lastname}`,
            14,
            20
          );
          pdf.addImage(imgData, "PNG", 0, 40, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
        }
      } else {
        const sectionGroups = [
          ...new Set(
            sections.map(
              (section) => `${section.section_name}-${section.section_group}`
            )
          ),
        ];
        for (const sectionGroup of sectionGroups) {
          const [sectionName, group] = sectionGroup.split("-");
          setSelectedSection(sectionName);
          setSelectedGroup(group);
          await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for state update
          const scheduleContainer = document.querySelector("#scheduleTable");
          const canvas = await html2canvas(scheduleContainer, {
            scale: 2,
            useCORS: true,
            backgroundColor: null, // Adjust as needed
          });
          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 297; // A4 width in mm for landscape
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          const pageHeight = 210; // A4 height in mm for landscape
          let heightLeft = imgHeight;
          let position = 0;

          if (!isFirstPage) {
            pdf.addPage();
          } else {
            isFirstPage = false; // After the first page, all subsequent pages should be added normally
          }

          pdf.text(`Section: ${sectionName}, Group: ${group}`, 14, 20);
          pdf.addImage(imgData, "PNG", 0, 40, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
        }
      }

      pdf.save("all_schedules.pdf");
    } catch (error) {
      console.error("Error generating all PDFs:", error);
      toast.error("Failed to generate all PDFs");
    } finally {
      const timeElements = document.querySelectorAll(".time");
      timeElements.forEach((el) => {
        el.style.color = "";
      });
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
      <Sidebar />
      <div className="draft-container">
        <div className="draft-header">
          <span>Draft Schedules</span>
        </div>
        <div className="draft-controls">
          <div className="category-selector">
            <label htmlFor="category">Schedule for: </label>
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="draft-dropdown"
            >
              <option value="instructor">Instructor</option>
              <option value="section">Section</option>
            </select>
          </div>
          {category === "instructor" ? (
            <div className="category-selector">
              <label htmlFor="instructor">Select Instructor: </label>
              <select
                name="instructor"
                value={selectedInstructor}
                onChange={(e) => setSelectedInstructor(e.target.value)}
                className="draft-dropdown"
              >
                {instructors.map((instructor) => (
                  <option
                    key={instructor.id}
                    value={`${instructor.firstname} ${instructor.middlename} ${instructor.lastname}`}
                  >
                    {`${instructor.firstname} ${instructor.lastname}`}
                  </option>
                ))}
              </select>
              <div className="draft-buttons">
                <button className="print" onClick={() => generatePDF()}>
                  Save as PDF
                </button>
                <button className="print-all" onClick={() => generateAllPDFs()}>
                  Save All as PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="category-selector">
              <label htmlFor="section">Section: </label>
              <select
                name="section"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="draft-dropdown"
              >
                {sections.length === 0 ? (
                  <option value="Section">Section</option>
                ) : (
                  Array.from(
                    new Set(sections.map((section) => section.section_name))
                  ).map((section, index) => (
                    <option key={index} value={section}>
                      {section}
                    </option>
                  ))
                )}
              </select>
              <label htmlFor="group">Group: </label>
              <select
                name="group"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="draft-dropdown"
              >
                {sections.length === 0 ? (
                  <option value={"Group"}>Group</option>
                ) : (
                  sections.map((section, index) => {
                    if (section.section_name === selectedSection) {
                      return (
                        <option key={index} value={section.section_group}>
                          {section.section_group}
                        </option>
                      );
                    }
                    return null;
                  })
                )}
              </select>
              <div className="draft-buttons">
                <button className="print" onClick={() => generatePDF()}>
                  Save as PDF
                </button>
                <button className="print-all" onClick={() => generateAllPDFs()}>
                  Save All as PDF
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="timetable" id="scheduleTable">
          <table>
            <thead>
              <tr>
                <th></th>
                {daysOfWeek.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timesOfDay.map((time) => (
                <tr key={time.startTime}>
                  <td>
                    <span className="time">
                      {time.startTime.slice(0, 2) % 12 || 12}:
                      {time.startTime.slice(3, 5)}{" "}
                      {time.startTime.slice(0, 2) >= 12 ? "PM" : "AM"} -{" "}
                      {time.endTime.slice(0, 2) % 12 || 12}:
                      {time.endTime.slice(3, 5)}{" "}
                      {time.endTime.slice(0, 2) >= 12 ? "PM" : "AM"}
                    </span>
                  </td>
                  {daysOfWeek.map((day, dayIndex) => {
                    if (rowSpans[dayIndex] > 0) {
                      rowSpans[dayIndex]--;
                      return null;
                    }

                    const scheduleItem = schedules.find((item) => {
                      if (category === "instructor") {
                        return (
                          item.start_time === time.startTime &&
                          item.day === day &&
                          item.instructor === selectedInstructor
                        );
                      } else {
                        return (
                          item.start_time === time.startTime &&
                          item.day === day &&
                          item.section_name === selectedSection &&
                          item.section_group === selectedGroup
                        );
                      }
                    });

                    let rowSpan = 1;
                    if (scheduleItem) {
                      rowSpan = calculateRowSpan(
                        scheduleItem.start_time,
                        scheduleItem.end_time
                      );
                      rowSpans[dayIndex] = rowSpan - 1;
                    }

                    return (
                      <td
                        key={`${time.startTime}-${day}`}
                        rowSpan={rowSpan}
                        style={{
                          backgroundColor: scheduleItem?.background_color,
                        }}
                        className="sched"
                      >
                        {scheduleItem && (
                          <>
                            <div
                              className="subject-name"
                              style={{
                                color: isDarkBackground(
                                  scheduleItem.background_color
                                )
                                  ? "white"
                                  : "black",
                              }}
                            >
                              {scheduleItem.subject}
                            </div>
                            <div
                              className="instructor-name"
                              style={{
                                color: isDarkBackground(
                                  scheduleItem.background_color
                                )
                                  ? "white"
                                  : "black",
                              }}
                            >
                              {scheduleItem.instructor}
                            </div>
                            {category === "instructor" && (
                              <div
                                className="section-name"
                                style={{
                                  color: isDarkBackground(
                                    scheduleItem.background_color
                                  )
                                    ? "white"
                                    : "black",
                                }}
                              >{`${
                                scheduleItem.section_name
                              } - ${scheduleItem.section_group.slice(
                                0,
                                1
                              )}${scheduleItem.section_group.slice(
                                6,
                                7
                              )}`}</div>
                            )}
                            <div
                              className="room-name"
                              style={{
                                color: isDarkBackground(
                                  scheduleItem.background_color
                                )
                                  ? "white"
                                  : "black",
                              }}
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
    </div>
  );
}

export default Draft;
