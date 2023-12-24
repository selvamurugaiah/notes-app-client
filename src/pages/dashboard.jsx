// components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Card, Container, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import emailjs from '@emailjs/browser';

const Dashboard = () => {
  const [noteList, setNoteList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

   const userEmail = useSelector(state => state.users.auth.email);
   console.log(userEmail)

  const userInfoString = localStorage.getItem("userInfo");
  const userId = userInfoString ? JSON.parse(userInfoString).userId : null;
  const token = userInfoString ? JSON.parse(userInfoString).token : null;
  
 

  const handleIsMatchingDate = (tasks, dateComparisonFunction) => {
    // Check if any task satisfies the provided date comparison function
    return tasks.some((item) => dateComparisonFunction(item));
  };

  const isCurrentDateMatch = (item) => {
    const currentDate = new Date();
    const providedDate = new Date(item.deadline);
    const yearMatch = providedDate.getFullYear() === currentDate.getFullYear();
    const monthMatch = providedDate.getMonth() === currentDate.getMonth();
    const dayMatch = providedDate.getDate() === currentDate.getDate();

    return yearMatch && monthMatch && dayMatch;
  };

  useEffect(() => {
    const fetchNoteList = async () => {
      try {
        setLoading(true);

        if (!userId) {
          console.error("UserId is not defined");
          return;
        }

        const response = await axios.get(
          `https://notes-app-blof.onrender.com/notes/get-note?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);

        if (response.data && Array.isArray(response.data)) {
          // Filter notes for the signed-in user
          const userNotes = response.data.filter(
            (note) => note.user._id === userId
          );

          // Check if the current date matches the deadline of any task
          const isCurrentDate = handleIsMatchingDate(
            userNotes,
            isCurrentDateMatch
          );

          if (isCurrentDate) {
            console.log("Date's same");
            handleEmailRemainder();
          }
          setNoteList(userNotes);
        } else {
          console.error("Invalid API response format:", response.data);
          setError("Invalid API response format");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchNoteList();
  }, [userId, token]);

  //Delete notes

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await axios.delete(
        `https://notes-app-blof.onrender.com/notes/delete-note/${noteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the deletion was successful
      if (response.status === 200) {
        // Remove the deleted note from the state
        setNoteList((prevNoteList) =>
          prevNoteList.filter((note) => note._id !== noteId)
        );

        toast.success(`Note deleted successfully.`, {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error(`Error deleting note. Please try again.`, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.error("Error deleting note:", error.message);
      toast.error(`Error deleting note. Please try again.`, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const handleToggleComplete = async (noteId, completed) => {
    try {
      const response = await axios.put(
        `https://notes-app-blof.onrender.com/notes/update-note/${noteId}`,
        { completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the update was successful
      if (response.status === 200) {
        // Update the note in the state with the new completion status
        setNoteList((prevNoteList) =>
          prevNoteList.map((note) =>
            note._id === noteId ? { ...note, completed } : note
          )
        );

        toast.success(`Note marked as ${completed ? "completed" : "not completed"}.`, {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error(`Error updating note. Please try again.`, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.error("Error updating note:", error.message);
      toast.error(`Error updating note. Please try again.`, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  //send remainder mail

  const handleEmailRemainder = () => {
    const serviceID = "service_8xvrioq";
    const templateID = "template_t031d9d";
    const publicKey = "GtO9YcLjJuRKvwayR";

    const storedUsername = userEmail;
   
    const recipient = storedUsername;
    const templateParams = {
      from_name: "Guvi Team",
      to_name: "Dear User",
      reply_to: "mselva@gmail.com",
      to_email: recipient,
    };

    emailjs.send(serviceID, templateID, templateParams, publicKey).then(
      (result) => {
        console.log(result.text);
        console.log(result);
        console.log("Email've sent successfully...");
      },
      (error) => {
        console.log(error.text);
      }
    );
  };



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const formattedDate = (date) => date.toISOString().slice(0, 10);

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Notes List</h1>

      <div className="card-container">
        {noteList.map((note) => (
          <Card
            key={note._id}
            className={`mb-3 ${note.completed ? 'border-success' : 'border-danger'}`}
            style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: 'lightgray' }}
          >
            <Card.Body>
              <Card.Title>{note.title}</Card.Title>
              <Card.Text>{note.content}</Card.Text>
              <Card.Text>
                Deadline: {formattedDate(new Date(note.deadline))}
              </Card.Text>
              <Card.Text>
                Completed: {note.completed ? "Yes" : "No"}
              </Card.Text>
              <Form.Check
                type="switch"
                id={`completed-switch-${note._id}`}
                label="Completed"
                checked={note.completed}
                onChange={() => handleToggleComplete(note._id, !note.completed)}
              />
              <div className="card-icons d-flex justify-content-end align-items-center">
                <Link to={`/edit-note/${note._id}`}>
                  <FaEdit className="edit-icon text-success" />
                </Link>
                <FaTrash
                  onClick={() => handleDeleteNote(note._id)}
                  className="delete-icon text-danger ms-2"
                />
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default Dashboard;

