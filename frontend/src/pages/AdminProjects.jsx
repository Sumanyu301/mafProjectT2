// // import { useState, useEffect } from "react";
// // import { projectAPI } from "../services/projectAPI";

// // const mockEmployees = [
// //   {
// //     id: 1,
// //     name: "Alice Johnson",
// //     skills: ["React", "Node.js"],
// //     available: true,
// //   },
// //   {
// //     id: 2,
// //     name: "Bob Smith",
// //     skills: ["Java", "Spring Boot"],
// //     available: false,
// //   },
// //   {
// //     id: 3,
// //     name: "Charlie Brown",
// //     skills: ["Python", "Django", "SQL"],
// //     available: true,
// //   },
// // ];

// // const AdminProjects = () => {
// //   const [title, setTitle] = useState("");
// //   const [description, setDescription] = useState("");
// //   const [priority, setPriority] = useState("LOW");
// //   const [startDate, setStartDate] = useState("");
// //   const [deadline, setDeadline] = useState("");
// //   const [search, setSearch] = useState("");
// //   const [selectedEmployees, setSelectedEmployees] = useState([]);

// //   const [filteredEmployees, setFilteredEmployees] = useState(mockEmployees);

// //   useEffect(() => {
// //     setFilteredEmployees(
// //       mockEmployees.filter(
// //         (emp) =>
// //           emp.name.toLowerCase().includes(search.toLowerCase()) ||
// //           emp.skills.some((skill) =>
// //             skill.toLowerCase().includes(search.toLowerCase())
// //           )
// //       )
// //     );
// //   }, [search]);

// //   const toggleEmployeeSelection = (id) => {
// //     setSelectedEmployees((prev) =>
// //       prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
// //     );
// //   };

// //   // Create project
// //   const handleCreateProject = async () => {
// //     try {
// //       const payload = { title, description, priority, startDate, deadline };
// //       const newProject = await projectAPI.create(payload);
// //       console.log("Project created:", newProject);
// //          console.log("Project Created:", {
// //           title,
// //           description,
// //           priority,
// //           startDate,
// //           deadline,
// //           employees: selectedEmployees,
// //         });
// //         alert("Project Created! (check console for details)");
// //     } catch (err) {
// //       console.error("Error creating project:", err);
// //     }
// //   };

// //   // Fetch project details
// //   useEffect(() => {
// //     const fetchProject = async () => {
// //       const data = await projectAPI.getById(id);
// //       setProject(data);
// //     };
// //     fetchProject();
// //   }, [id]);

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <div className="p-8 max-w-6xl mx-auto">
// //         <h1 className="text-3xl font-bold mb-6 text-blue-900">Admin - Create Project</h1>

// //         {/* Project Form */}
// //         <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
// //           <h2 className="text-xl font-semibold mb-4 text-blue-900">Project Details</h2>
// //           <div className="grid grid-cols-2 gap-4">
// //             <input
// //               type="text"
// //               placeholder="Project Title"
// //               value={title}
// //               onChange={(e) => setTitle(e.target.value)}
// //               className="p-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
// //             />
// //             <select
// //               value={priority}
// //               onChange={(e) => setPriority(e.target.value)}
// //               className="p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
// //             >
// //               <option value="LOW">Low Priority</option>
// //               <option value="MEDIUM">Medium Priority</option>
// //               <option value="HIGH">High Priority</option>
// //               <option value="CRITICAL">Critical Priority</option>
// //             </select>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
// //               <input
// //                 type="date"
// //                 value={startDate}
// //                 onChange={(e) => setStartDate(e.target.value)}
// //                 className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
// //               />
// //             </div>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
// //               <input
// //                 type="date"
// //                 value={deadline}
// //                 onChange={(e) => setDeadline(e.target.value)}
// //                 className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
// //               />
// //             </div>
// //           </div>
// //           <textarea
// //             placeholder="Project Description"
// //             value={description}
// //             onChange={(e) => setDescription(e.target.value)}
// //             className="w-full p-3 border-2 border-gray-200 rounded-lg mt-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
// //             rows="3"
// //           />
// //         </div>

// //         {/* Employee Selection */}
// //         <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
// //           <h2 className="text-xl font-semibold mb-4 text-blue-900">Assign Employees</h2>
// //           <input
// //             type="text"
// //             placeholder="Search by name or skill..."
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //             className="w-full p-3 border-2 border-gray-200 rounded-lg mb-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
// //           />

// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             {filteredEmployees.map((emp) => (
// //               <div
// //                 key={emp.id}
// //                 className={`p-4 border-2 rounded-lg flex justify-between items-center cursor-pointer transition-all duration-200 hover:shadow-md ${
// //                   selectedEmployees.includes(emp.id)
// //                     ? "bg-blue-50 border-blue-900 shadow-md"
// //                     : "bg-white border-gray-200 hover:border-gray-300"
// //                 }`}
// //                 onClick={() => toggleEmployeeSelection(emp.id)}
// //               >
// //                 <div>
// //                   <h3 className="font-semibold text-blue-900">{emp.name}</h3>
// //                   <p className="text-sm text-gray-600 mb-1">
// //                     Skills: {emp.skills.join(", ")}
// //                   </p>
// //                   <p
// //                     className={`text-sm font-medium ${
// //                       emp.available ? "text-green-600" : "text-red-600"
// //                     }`}
// //                   >
// //                     {emp.available ? "✓ Available" : "✗ Busy"}
// //                   </p>
// //                 </div>
// //                 {selectedEmployees.includes(emp.id) && (
// //                   <div className="bg-blue-900 text-white rounded-full w-6 h-6 flex items-center justify-center">
// //                     <span className="text-sm font-bold">✓</span>
// //                   </div>
// //                 )}
// //               </div>
// //             ))}
// //           </div>

// //           {selectedEmployees.length > 0 && (
// //             <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
// //               <p className="text-blue-900 font-medium">
// //                 {selectedEmployees.length} employee(s) selected
// //               </p>
// //             </div>
// //           )}
// //         </div>

// //         <div className="flex justify-between items-center">
// //           <button
// //             onClick={() => window.history.back()}
// //             className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
// //           >
// //             Cancel
// //           </button>
// //           <button
// //             onClick={handleCreateProject}
// //             className="bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
// //           >
// //             Create Project
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminProjects;

// import { useState, useEffect } from "react";
// import { projectAPI } from "../services/projectAPI";

// const mockEmployees = [
//   { id: 1, name: "Alice Johnson", skills: ["React", "Node.js"], available: true },
//   { id: 2, name: "Bob Smith", skills: ["Java", "Spring Boot"], available: false },
//   { id: 3, name: "Charlie Brown", skills: ["Python", "Django", "SQL"], available: true },
// ];

// const AdminProjects = () => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [priority, setPriority] = useState("LOW");
//   const [startDate, setStartDate] = useState("");
//   const [deadline, setDeadline] = useState("");
//   const [search, setSearch] = useState("");
//   const [selectedEmployees, setSelectedEmployees] = useState([]);

//   const [filteredEmployees, setFilteredEmployees] = useState(mockEmployees);

//   // 🔍 Search filter
//   useEffect(() => {
//     setFilteredEmployees(
//       mockEmployees.filter(
//         (emp) =>
//           emp.name.toLowerCase().includes(search.toLowerCase()) ||
//           emp.skills.some((skill) =>
//             skill.toLowerCase().includes(search.toLowerCase())
//           )
//       )
//     );
//   }, [search]);

//   // ✅ Toggle selection
//   const toggleEmployeeSelection = (id) => {
//     setSelectedEmployees((prev) =>
//       prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
//     );
//   };

//   // ✅ Create project
//   const handleCreateProject = async () => {
//     try {
//       const payload = {
//         title,
//         description,
//         priority,
//         startDate,
//         deadline,
//         employees: selectedEmployees, // pass selected employees
//       };

//       const newProject = await projectAPI.create(payload);
//       console.log("✅ Project created:", newProject);

//       alert("Project Created Successfully!");
//       // You can redirect to details page if needed:
//       navigate(`/`);
//     } catch (err) {
//       console.error("❌ Error creating project:", err);
//       alert(err.response?.data?.error || "Failed to create project");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="p-8 max-w-6xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6 text-blue-900">Admin - Create Project</h1>

//         {/* Project Form */}
//         <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
//           <h2 className="text-xl font-semibold mb-4 text-blue-900">Project Details</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <input
//               type="text"
//               placeholder="Project Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="p-3 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
//             />
//             <select
//               value={priority}
//               onChange={(e) => setPriority(e.target.value)}
//               className="p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
//             >
//               <option value="LOW">Low Priority</option>
//               <option value="MEDIUM">Medium Priority</option>
//               <option value="HIGH">High Priority</option>
//               <option value="CRITICAL">Critical Priority</option>
//             </select>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
//               <input
//                 type="date"
//                 value={deadline}
//                 onChange={(e) => setDeadline(e.target.value)}
//                 className="w-full p-3 border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
//               />
//             </div>
//           </div>
//           <textarea
//             placeholder="Project Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full p-3 border-2 border-gray-200 rounded-lg mt-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
//             rows="3"
//           />
//         </div>

//         {/* Employee Selection */}
//         <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
//           <h2 className="text-xl font-semibold mb-4 text-blue-900">Assign Employees</h2>
//           <input
//             type="text"
//             placeholder="Search by name or skill..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full p-3 border-2 border-gray-200 rounded-lg mb-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
//           />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {filteredEmployees.map((emp) => (
//               <div
//                 key={emp.id}
//                 className={`p-4 border-2 rounded-lg flex justify-between items-center cursor-pointer transition-all duration-200 hover:shadow-md ${
//                   selectedEmployees.includes(emp.id)
//                     ? "bg-blue-50 border-blue-900 shadow-md"
//                     : "bg-white border-gray-200 hover:border-gray-300"
//                 }`}
//                 onClick={() => toggleEmployeeSelection(emp.id)}
//               >
//                 <div>
//                   <h3 className="font-semibold text-blue-900">{emp.name}</h3>
//                   <p className="text-sm text-gray-600 mb-1">
//                     Skills: {emp.skills.join(", ")}
//                   </p>
//                   <p
//                     className={`text-sm font-medium ${
//                       emp.available ? "text-green-600" : "text-red-600"
//                     }`}
//                   >
//                     {emp.available ? "✓ Available" : "✗ Busy"}
//                   </p>
//                 </div>
//                 {selectedEmployees.includes(emp.id) && (
//                   <div className="bg-blue-900 text-white rounded-full w-6 h-6 flex items-center justify-center">
//                     <span className="text-sm font-bold">✓</span>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {selectedEmployees.length > 0 && (
//             <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//               <p className="text-blue-900 font-medium">
//                 {selectedEmployees.length} employee(s) selected
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="flex justify-between items-center">
//           <button
//             onClick={() => window.history.back()}
//             className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleCreateProject}
//             className="bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
//           >
//             Create Project
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminProjects;

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectAPI } from "../services/projectAPI";
import { employeeAPI } from "../services/employeeAPI";

const mockEmployees = [
  { id: 1, name: "Alice Johnson", skills: ["React", "Node.js"], available: true },
  { id: 2, name: "Bob Smith", skills: ["Java", "Spring Boot"], available: false },
  { id: 3, name: "Charlie Brown", skills: ["Python", "Django", "SQL"], available: true },
];

const AdminProjects = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // if id exists → edit mode

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [search, setSearch] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState(mockEmployees);
  const [allEmployees, setAllEmployees] = useState([]);

  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(id);

  // 🔍 Search filter
  // useEffect(() => {
  //   setFilteredEmployees(
  //     mockEmployees.filter(
  //       (emp) =>
  //         emp.name.toLowerCase().includes(search.toLowerCase()) ||
  //         emp.skills.some((skill) =>
  //           skill.toLowerCase().includes(search.toLowerCase())
  //         )
  //     )
  //   );
  // }, [search]);

  // ✅ Prefill form if editing
  // useEffect(() => {
  //   if (isEditMode) {
  //     const fetchProject = async () => {
  //       try {
  //         const project = await projectAPI.getById(id);
  //         setTitle(project.title);
  //         setDescription(project.description);
  //         setPriority(project.priority);
  //         setStartDate(project.startDate);
  //         setDeadline(project.deadline);
  //         setSelectedEmployees(project.employees || []);
  //       } catch (err) {
  //         console.error("❌ Error fetching project:", err);
  //       }
  //     };
  //     fetchProject();
  //   }
  // }, [id, isEditMode]);

  // 🔍 Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const employees = await employeeAPI.getAll(); // fetch all employees

        // Map backend structure and filter role at the same time
        const mapped = employees
          .filter(emp => emp.user.systemRole === "EMPLOYEE") // ✅ filter by role
          .map((emp) => ({
            id: emp.id,
            name: emp.name,
            skills: emp.skills.map((s) => s.skill.name),
            available: emp.availability === "AVAILABLE",
            role: emp.user.systemRole, // save role if needed
          }));

        setAllEmployees(mapped);
        setFilteredEmployees(mapped);
      } catch (err) {
        console.error("❌ Failed to fetch employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // 🔍 Search filter
  useEffect(() => {
    setFilteredEmployees(
      allEmployees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(search.toLowerCase()) ||
          emp.skills.some((skill) =>
            skill.toLowerCase().includes(search.toLowerCase())
          )
      )
    );
  }, [search, allEmployees]);

    // ✅ Prefill form if editing
  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        try {
          const project = await projectAPI.getById(id);
          setTitle(project.title);
          setDescription(project.description);
          setPriority(project.priority);
          setStartDate(project.startDate);
          setDeadline(project.deadline);
          setSelectedEmployees(project.employees?.map(emp => emp.id) || []);
        } catch (err) {
          console.error("❌ Error fetching project:", err);
        }
      };
      fetchProject();
    }
  }, [id, isEditMode]);


  // ✅ Toggle selection
  const toggleEmployeeSelection = (empId) => {
    setSelectedEmployees((prev) =>
      prev.includes(empId)
        ? prev.filter((id) => id !== empId)
        : [...prev, empId]
    );
  };

  // ✅ Submit handler
  // const handleSubmit = async () => {
  //   try {
  //     const payload = {
  //       title,
  //       description,
  //       priority,
  //       startDate,
  //       deadline,
  //       employees: selectedEmployees,
  //     };

  //     if (isEditMode) {
  //       await projectAPI.update(id, payload);
  //       alert("Project updated successfully!");
  //     } else {
  //       await projectAPI.create(payload);
  //       alert("Project created successfully!");
  //     }

  //     navigate("/"); // redirect to projects list
  //   } catch (err) {
  //     console.error("❌ Error saving project:", err);
  //     alert(err.response?.data?.error || "Failed to save project");
  //   }
  // };

  // ✅ Submit handler
  const handleSubmit = async () => {
    try {
      const payload = {
        title,
        description,
        priority,
        startDate,
        deadline,
        employees: selectedEmployees, // pass selected employee IDs
      };

      if (isEditMode) {
        await projectAPI.update(id, payload);
        alert("Project updated successfully!");
        navigate(-1); // go back to previous page
      } else {
        await projectAPI.create(payload);
        alert("Project created successfully!");
        navigate(-1); // go back to previous page
      }

      navigate("/"); // redirect back to project list
    } catch (err) {
      console.error("❌ Error saving project:", err);
      alert(err.response?.data?.error || "Failed to save project");
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">
          {isEditMode ? "Edit Project" : "Create Project"}
        </h1>

        {/* Project Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Project Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 border-2 border-gray-200 rounded-lg"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="p-3 border-2 border-gray-200 rounded-lg"
            >
              <option value="LOW">Low Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="CRITICAL">Critical Priority</option>
            </select>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg"
              />
            </div>
          </div>
          <textarea
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg mt-4"
            rows="3"
          />
        </div>

        {/* Employee Selection */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Assign Employees</h2>
          <input
            type="text"
            placeholder="Search by name or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg mb-4"
          />

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className={`p-4 border-2 rounded-lg flex justify-between items-center cursor-pointer ${
                  selectedEmployees.includes(emp.id)
                    ? "bg-blue-50 border-blue-900"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => toggleEmployeeSelection(emp.id)}
              >
                <div>
                  <h3 className="font-semibold text-blue-900">{emp.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Skills: {emp.skills.join(", ")}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      emp.available ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {emp.available ? "✓ Available" : "✗ Busy"}
                  </p>
                </div>
                {selectedEmployees.includes(emp.id) && (
                  <div className="bg-blue-900 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-full min-h-[150px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-900 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-700 text-lg">Loading employees...</p>
                </div>
              </div>
            ) : filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className={`p-4 border-2 rounded-lg flex justify-between items-center cursor-pointer ${
                    selectedEmployees.includes(emp.id)
                      ? "bg-blue-50 border-blue-900"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleEmployeeSelection(emp.id)}
                >
                  <div>
                    <h3 className="font-semibold text-blue-900">{emp.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Skills: {emp.skills.join(", ")}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        emp.available ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {emp.available ? "✓ Available" : "✗ Busy"}
                    </p>
                  </div>
                  {selectedEmployees.includes(emp.id) && (
                    <div className="bg-blue-900 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">No employees found.</p>
            )}
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-900 text-white px-8 py-3 rounded-lg hover:bg-blue-800"
          >
            {isEditMode ? "Update Project" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;
