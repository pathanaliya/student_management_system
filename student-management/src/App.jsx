import "./App.css";
import { useState } from "react";
import { useEffect } from "react";

function App() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [year, setYear] = useState("");
  const [students, setStudents] = useState([]);
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();


    try {
      const studentData = {
        name: name.trim(),
        course,
        department,
        year,
        email: email.trim(),
        phone: phone.trim(),
      };

      const isEditing = edit !== null;

      const response = await fetch(
        isEditing
          ? `http://localhost:5000/api/students/${edit}`
          : "http://localhost:5000/api/students",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to save student");
      }

      if (isEditing) {
        setStudents((current) =>
          current.map((student) =>
            student.id === edit ? result : student
          )
        );
      } else {
        setStudents((current) => [...current, result]);
      }

      setName("");
      setCourse("");
      setDepartment("");
      setYear("");
      setEmail("");
      setPhone("");
      setEdit(null);
      setError("");
    } catch (error) {
      setError(error.message || "Could not connect to the server");
    }

  }

  function handleEdit(student) {
    setName(student.name);
    setCourse(student.course);
    setEdit(student.id);
    setDepartment(student.department);
    setYear(student.year);
    setEmail(student.email);
    setPhone(student.phone);
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}`,
        { method: "DELETE" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to delete student");
      }

      setStudents((current) =>
        current.filter((student) => student.id !== id)
      );
    } catch (error) {
      setError(error.message || "Could not delete student");
    }
  }

  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/students"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      }
    }
    fetchStudents();
  }, [])


  return (
    <div className="container">
      <h1>Student Management System</h1>

      <h2>Add Student details</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)} />

        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}>
          <option value="">Select Course</option>
          <option value="BCA">BCA</option>
          <option value="BSc Computer Sciece">BSc Computer Science</option>
          <option value="BTech">BTech</option>
          <option value="BE">BE</option>
          <option value="BCom">BCom</option>
          <option value="BA">BA</option>
        </select>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}>
          <option value="">Select Department</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Commerce">Commerce</option>
          <option value="Arts">Arts</option>
          <option value="Science">Science</option>
          <option value="Management">Management</option>
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Enter the phone"
          value={phone}
          maxLength={10}
          onChange={(e) => setPhone(e.target.value)} />

        {error && <p className="error">{error}</p>}

        <button type="submit">
          {edit === null ? "Add Student" : "Update student"}
        </button>

      </form>

      <h2>Student List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Course</th>
            <th>Department</th>
            <th>Year</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>

          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.course}</td>
              <td>{student.department}</td>
              <td>{student.year}</td>
              <td>{student.email}</td>
              <td>{student.phone}</td>
              <td>
                <button
                  type="button"
                  onClick={() => handleEdit(student)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(student.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div >
  )
}

export default App;