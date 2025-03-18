import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../style/teacher/activityItems.css"; 
import StudentAMNavigationBarComponent from "../student/StudentAMNavigationBarComponent";
import { getActivityItemsByStudent } from "../api/API"; // ✅ Import API function

const StudentActivityItemsComponent = () => {
  const { classID, actID } = useParams(); // Get actID and classID from URL
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null); // Store activity details
  const [items, setItems] = useState([]); // Store activity items (questions)
  const [loading, setLoading] = useState(true);

  // Fetch activity data on mount
  useEffect(() => {
    fetchActivityData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchActivityData = async () => {
    try {
      const response = await getActivityItemsByStudent(actID);
      if (!response.error) {
        // Expect the backend to return: activityName, actDesc, maxPoints, questions
        setActivity({
          name: response.activityName,
          description: response.actDesc, // store description here
          maxPoints: response.maxPoints,
        });
        setItems(response.questions || []);
      }
    } catch (error) {
      console.error("❌ Error fetching activity data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-items">
      <StudentAMNavigationBarComponent />

      {/* Display activity details */}
      {activity && (
        <ActivityHeader 
          name={activity.name}
          description={activity.description}  // Pass description to header
          actQuestionPoints={activity.maxPoints}
        />
      )}

      <TableComponent items={items} loading={loading} />

      {/* "Answer The Activity" Button - Always Enabled */}
      <div 
        className="answer-item-btn active"
        onClick={() => navigate(`/student/class/${classID}/activity/${actID}/assessment`)}
      >
        <i className="bi bi-pencil-square"></i> Answer The Activity
      </div>
    </div>
  );
};

/** Activity Header Component */
const ActivityHeader = ({ name, description, actQuestionPoints }) => (
  <header className="activity-header">
    <div className="header-content">
      {/* Red vertical line on the left */}
      <div className="left-indicator"></div>

      {/* Container for Title + Description */}
      <div className="activity-info">
        <h2 className="activity-title">
          {name} <span className="points">({actQuestionPoints} points)</span>
        </h2>
        {description && (
          <p className="activity-description">{description}</p>
        )}
      </div>

      <div className="menu-icon">
        <i className="bi bi-three-dots"></i>
      </div>
    </div>
  </header>
);

/** Table Component (Dynamic Data) */
const TableComponent = ({ items, loading }) => {
  return (
    <div className="table-wrapper">
      <table className="item-table">
        <thead>
          <tr>
            <th>Question Name</th>
            <th>Difficulty</th>
            <th>Item Type</th>
            <th>Student Score</th>
            <th>Time Spent</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="loading-text">Loading...</td>
            </tr>
          ) : items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index}>
                <td>{item.questionName}</td>
                <td>{item.questionDifficulty}</td>
                <td>{item.itemType}</td>
                <td>
                  {item.studentScore !== null 
                    ? `${item.studentScore} / ${item.actQuestionPoints}`
                    : `- / ${item.actQuestionPoints}`}
                </td>
                <td>{item.studentTimeSpent !== "-" ? item.studentTimeSpent : "-"}</td>
                <td>{item.submissionStatus}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="loading-text">No items found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentActivityItemsComponent;