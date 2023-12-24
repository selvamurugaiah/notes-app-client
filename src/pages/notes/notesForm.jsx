import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { postNote } from "../../redux/slices/notes/notesSlices";

const AddNote = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    deadline: "",
    user: "",
    completed: false,
  });

  const [errors, setErrors] = useState({});

  // Retrieve the token from local storage
  const userInfoString = localStorage.getItem("userInfo");
  const token = userInfoString ? JSON.parse(userInfoString).token : null;

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
  
    // Handle boolean values for completion status
    const newValue = type === 'checkbox' ? e.target.checked : value;
  
    setFormData({ ...formData, [name]: newValue });
  };
  

  const handleBlur = (e) => {
    const { name } = e.target;
    validateField(name);
  };

  const validateField = (fieldName) => {
    const fieldErrors = {};
    switch (fieldName) {
      case "title":
      case "content":
      case "deadline":
      case "userEmail":
        fieldErrors[fieldName] = formData[fieldName]
          ? ""
          : `${fieldName} is required`;
        break;
      default:
        break;
    }
    setErrors({ ...errors, ...fieldErrors });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate all fields on submission
    Object.keys(formData).forEach((fieldName) => validateField(fieldName));
  
    // Check if there are any errors
    const hasErrors = Object.values(errors).some((error) => error);
  
    if (!hasErrors) {
      const userInfoString = localStorage.getItem('userInfo');
  
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
  
        // Include the user ID and completion status in the formData
        const updatedFormData = {
          ...formData,
          user: userInfo.userId,
        };
  
        // Dispatch addNote action
        dispatch(postNote(updatedFormData, userInfo.token));
  
        // Reset the form data
        setFormData({
          title: '',
          content: '',
          deadline: '',
          user: '',
          completed: false, // Reset completion status
        });
  
        toast.success('Note added successfully!', {
          position: toast.POSITION.TOP_CENTER,
        });
  
        // Redirect to the profile page after successful submission
        navigate('/profile');
      } else {
        console.error('User information not found. Please log in');
        toast.error('Error adding note. Please try again.', {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };
  

  return (
    <>
    <Container className="mt-4">
      
      <h1 className="text-center mb-4">Create New Note</h1>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={handleBlur}
                isInvalid={errors.title}
              />
              <Form.Control.Feedback type="invalid">
                {errors.title}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formContent" className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Enter content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                onBlur={handleBlur}
                isInvalid={errors.content}
              />
              <Form.Control.Feedback type="invalid">
                {errors.content}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formDeadline" className="mb-3">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                onBlur={handleBlur}
                isInvalid={errors.deadline}
              />
              <Form.Control.Feedback type="invalid">
                {errors.deadline}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formCompleted" className="mb-3">
              <Form.Label>Completed</Form.Label>
              <Form.Control
                as="select"
                name="completed"
                value={formData.completed}
                onChange={handleInputChange}
              >
                <option value={false}>Not Completed</option>
                <option value={true}>Completed</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Note
            </Button>
          </Form>
        </Col>
        <ToastContainer/>
      </Row>
      
    </Container>
      
    </>
  );
};

export default AddNote;
