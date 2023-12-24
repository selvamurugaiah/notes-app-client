// Import necessary libraries
import React, { useEffect, useState } from "react";
import { Button, Form, Col, Container, Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditNoteForm = () => {
  const { id } = useParams(); // Get the note ID from the URL params
  const navigate = useNavigate();

  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
    deadline: "",
    completed: false,
  });

  const userInfoString = localStorage.getItem("userInfo");
  const userId = userInfoString ? JSON.parse(userInfoString).userId : null;
  const token = userInfoString ? JSON.parse(userInfoString).token : null;

  useEffect(() => {
    // Fetch note data based on the ID when the component mounts
    const fetchNoteData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/notes/get-note/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNoteData(response.data); // Set the fetched data to the state
      } catch (error) {
        console.error("Error fetching note data:", error.message);
      }
    };

    fetchNoteData();
  }, [id, token]);

  const handleInputChange = (e) => {
    setNoteData({
      ...noteData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateNote = async () => {
    try {
      // Make a PUT request to update the note data
      await axios.put(
        `http://localhost:4000/notes/update-note/${id}`,
        noteData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Redirect to the note list page after successful update
      navigate("/profile");
    } catch (error) {
      console.error("Error updating note:", error.message);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <div>
            <h1>Edit Note</h1>
            <Form>
              <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  name="title"
                  value={noteData.title}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formContent">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter content"
                  name="content"
                  value={noteData.content}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDeadline">
                <Form.Label>Deadline</Form.Label>
                <Form.Control
                  type="date"
                  name="deadline"
                  value={noteData.deadline}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCompletion">
                <Form.Check
                  type="checkbox"
                  label="Completed"
                  name="completed"
                  checked={noteData.completed}
                  onChange={(e) =>
                    setNoteData({
                      ...noteData,
                      completed: e.target.checked,
                    })
                  }
                />
              </Form.Group>

              <Button variant="primary" onClick={handleUpdateNote}>
                Update Note
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EditNoteForm;

