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
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem("students");
    return savedStudents ? JSON.parse(savedStudents) : [];
  });
  const [edit, setEdit] = useState(null);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (
      name.trim() === "" ||
      course === "" ||
      department === "" ||
      year === "" ||
      email.trim() === "" ||
      phone.trim() === ""
    ) {
      setError("Please enter the details");
      return;
    }


    if (edit === null) {
      const newId =
        students.length === 0 ? 1 : Math.max(...students.map((student) => student.id)) + 1;
      const newStudent = {
        id: newId,
        name: name,
        course: course,
        department: department,
        year: year,
        email: email,
        phone: phone,
      }
      setStudents([...students, newStudent]);
    } else {
      const updatedStudents = students.map((student) =>
        student.id === edit
          ? {
            ...student,
            name: name,
            course: course,
            department: department,
            year: year,
            email: email,
            phone: phone,
          }
          : student
      )
      setStudents(updatedStudents);
    }

    setName("");
    setCourse("");
    setDepartment("");
    setYear("");
    setEmail("");
    setPhone("");
    setEdit(null);
    setError("");
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

  function handleDelete(id) {
    const updateStudents = students.filter(
      (student) => student.id !== id
    )
    setStudents(updateStudents);
  }

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);


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