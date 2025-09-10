// // import { useParams, useNavigate } from "react-router-dom";
// // import { useState, useEffect } from "react";
// // import { 
// //   Pencil, 
// //   Users, 
// //   Calendar, 
// //   Clock, 
// //   ArrowLeft, 
// //   Plus, 
// //   Trash2, 
// //   User,
// //   CheckCircle,
// //   AlertCircle,
// //   Target
// // } from "lucide-react";

// // function ProjectDetailsPage({ userRole = "ADMIN" }) {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const [project, setProject] = useState(null);

// //   useEffect(() => {
// //     const fetchProject = async () => {
// //       try {
// //         const data = await getProjectByIdAPI(id);
// //         setProject(data);
// //       } catch (err) {
// //         console.error("Error fetching project:", err);
// //       }
// //     };

// //     fetchProject();
// //   }, [id]);

// //   useEffect(() => {
// //     // Mock data (later: fetch(`/api/projects/${id}`))
// //     const mockProjects = [
// //       {
// //         id: 1,
// //         name: "E-Commerce Platform",
// //         description: "Building a scalable online store with modern technologies, user-friendly interface, and robust payment processing capabilities.",
// //         status: "In Progress",
// //         priority: "High",
// //         startDate: "2024-01-15",
// //         deadline: "2024-06-30",
// //         progress: 75,
// //         createdBy: "Dana Wilson",
// //         client: "TechCorp Solutions",
// //         employees: [
// //           { id: 101, name: "Alice Johnson", task: "Frontend UI Development", status: "Active", avatar: "AJ" },
// //           { id: 102, name: "Bob Smith", task: "Backend APIs", status: "Active", avatar: "BS" },
// //           { id: 105, name: "Eva Martinez", task: "Database Design", status: "Completed", avatar: "EM" },
// //         ],
// //       },
// //       {
// //         id: 2,
// //         name: "HR Management System",
// //         description: "Internal system for HR operations including employee management, payroll processing, and performance tracking.",
// //         status: "Planning",
// //         priority: "Medium",
// //         startDate: "2024-02-01",
// //         deadline: "2024-08-15",
// //         progress: 25,
// //         createdBy: "Bob Smith",
// //         client: "Internal Project",
// //         employees: [
// //           { id: 103, name: "Charlie Brown", task: "Database Architecture", status: "Active", avatar: "CB" },
// //           { id: 104, name: "Dana Wilson", task: "Authentication System", status: "Active", avatar: "DW" },
// //         ],
// //       },
// //     ];
// //     setProject(mockProjects.find((p) => p.id === parseInt(id)));
// //   }, [id]);

// //   const getStatusColor = (status) => {
// //     switch (status) {
// //       case "Completed":
// //         return "bg-green-100 text-green-800 border-green-200";
// //       case "In Progress":
// //         return "bg-blue-100 text-blue-800 border-blue-200";
// //       case "Planning":
// //         return "bg-yellow-100 text-yellow-800 border-yellow-200";
// //       default:
// //         return "bg-gray-100 text-gray-800 border-gray-200";
// //     }
// //   };

// //   const getPriorityColor = (priority) => {
// //     switch (priority) {
// //       case "High":
// //         return "bg-red-100 text-red-800 border-red-200";
// //       case "Medium":
// //         return "bg-yellow-100 text-yellow-800 border-yellow-200";
// //       case "Low":
// //         return "bg-green-100 text-green-800 border-green-200";
// //       default:
// //         return "bg-gray-100 text-gray-800 border-gray-200";
// //     }
// //   };

// //   const getProgressColor = (progress) => {
// //     if (progress >= 80) return "bg-green-500";
// //     if (progress >= 50) return "bg-blue-600";
// //     if (progress >= 25) return "bg-yellow-500";
// //     return "bg-red-500";
// //   };

// //   if (!project) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-900 border-t-transparent mx-auto mb-4"></div>
// //           <p className="text-gray-700 text-lg">Loading project details...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <div className="p-8 max-w-6xl mx-auto">
// //         {/* Header Section */}
// //         <div className="mb-8">
// //           <button
// //             onClick={() => navigate(-1)}
// //             className="flex items-center text-blue-900 hover:text-blue-700 mb-4 transition-colors"
// //           >
// //             <ArrowLeft className="h-5 w-5 mr-2" />
// //             Back to Projects
// //           </button>

// //           <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
// //             <div className="flex justify-between items-start mb-6">
// //               <div>
// //                 <h1 className="text-3xl font-bold text-blue-900 mb-2">{project.name}</h1>
// //                 <p className="text-gray-700 text-lg leading-relaxed">{project.description}</p>
// //               </div>
// //               {userRole === "admin" && (
// //                 <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all duration-200 border border-gray-300">
// //                   <Pencil size={16} />
// //                   Edit Project
// //                 </button>
// //               )}
// //             </div>

// //             {/* Status and Priority Badges */}
// //             <div className="flex flex-wrap gap-3 mb-6">
// //               <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
// //                 {project.status}
// //               </span>
// //               <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(project.priority)}`}>
// //                 {project.priority} Priority
// //               </span>
// //             </div>

// //             {/* Progress Bar */}
// //             <div className="mb-6">
// //               <div className="flex justify-between items-center mb-2">
// //                 <span className="text-sm font-medium text-gray-700">Project Progress</span>
// //                 <span className="text-sm font-semibold text-blue-900">{project.progress}%</span>
// //               </div>
// //               <div className="w-full bg-gray-200 rounded-full h-3">
// //                 <div
// //                   className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
// //                   style={{ width: `${project.progress}%` }}
// //                 ></div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Project Info Grid */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //           <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
// //             <div className="flex items-center mb-2">
// //               <Calendar className="h-5 w-5 text-blue-900 mr-2" />
// //               <span className="text-sm font-medium text-gray-700">Start Date</span>
// //             </div>
// //             <p className="text-blue-900 font-semibold">{new Date(project.startDate).toLocaleDateString()}</p>
// //           </div>

// //           <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
// //             <div className="flex items-center mb-2">
// //               <Clock className="h-5 w-5 text-red-600 mr-2" />
// //               <span className="text-sm font-medium text-gray-700">Deadline</span>
// //             </div>
// //             <p className="text-blue-900 font-semibold">{new Date(project.deadline).toLocaleDateString()}</p>
// //           </div>

// //           <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
// //             <div className="flex items-center mb-2">
// //               <Target className="h-5 w-5 text-blue-900 mr-2" />
// //               <span className="text-sm font-medium text-gray-700">Created By</span>
// //             </div>
// //             <p className="text-blue-900 font-semibold">{project.createdBy}</p>
// //           </div>

// //           <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
// //             <div className="flex items-center mb-2">
// //               <Users className="h-5 w-5 text-blue-900 mr-2" />
// //               <span className="text-sm font-medium text-gray-700">Team Size</span>
// //             </div>
// //             <p className="text-blue-900 font-semibold">{project.employees.length} Members</p>
// //           </div>
// //         </div>

// //         {/* Team Members Section */}
// //         <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
// //           <div className="flex justify-between items-center mb-6">
// //             <h2 className="text-xl font-semibold text-blue-900">Team Members</h2>
// //             {userRole === "admin" && (
// //               <button className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-200">
// //                 <Plus size={16} />
// //                 Add Member
// //               </button>
// //             )}
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             {project.employees.map((emp) => (
// //               <div
// //                 key={emp.id}
// //                 className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
// //               >
// //                 <div className="flex items-center">
// //                   <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-semibold text-sm mr-3">
// //                     {emp.avatar}
// //                   </div>
// //                   <div>
// //                     <span className="font-medium text-blue-900">{emp.name}</span>
// //                     <p className="text-sm text-gray-600">{emp.task}</p>
// //                   </div>
// //                 </div>
// //                 <div className="flex items-center">
// //                   {emp.status === "Completed" ? (
// //                     <CheckCircle className="h-5 w-5 text-green-600" />
// //                   ) : (
// //                     <AlertCircle className="h-5 w-5 text-yellow-600" />
// //                   )}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Admin Actions */}
// //         {userRole === "admin" && (
// //           <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
// //             <h3 className="text-lg font-semibold text-blue-900 mb-4">Admin Actions</h3>
// //             <div className="flex flex-wrap gap-4">
// //               <button className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium">
// //                 <Plus size={16} />
// //                 Add Employee
// //               </button>
// //               <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg transition-all duration-200 font-medium">
// //                 <Pencil size={16} />
// //                 Edit Details
// //               </button>
// //               <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium">
// //                 <Trash2 size={16} />
// //                 Delete Project
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default ProjectDetailsPage;

// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { 
//   Pencil, 
//   Users, 
//   Calendar, 
//   Clock, 
//   ArrowLeft, 
//   Plus, 
//   Trash2, 
//   Target,
//   CheckCircle,
//   AlertCircle
// } from "lucide-react";
// import { authAPI } from "../services/authAPI";
// import { employeeAPI } from "../services/employeeAPI";
// import { projectAPI } from "../services/projectAPI";

// function ProjectDetailsPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [project, setProject] = useState(null);
//   const [userRole, setUserRole] = useState(""); // store logged-in role

//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Get logged-in user role
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const data = await authAPI.verify();
//         setUserRole(data.role); // "ADMIN" or "EMPLOYEE"
//       } catch (err) {
//         console.error("Failed to verify user:", err);
//         setUserRole(""); // fallback
//       }
//     };
//     fetchUser();
//   }, []);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const data = await employeeAPI.getAll();
//         setEmployees(data);  // backend returns array of employees
//       } catch (err) {
//         console.error("Error fetching employees:", err);
//       }
//     };
//     fetchEmployees();
//   }, []);


//   // ✅ Load project details (mock for now)
//   // useEffect(() => {
//   //   const mockProjects = [
//   //     {
//   //       id: 1,
//   //       name: "E-Commerce Platform",
//   //       description: "Building a scalable online store with modern technologies, user-friendly interface, and robust payment processing capabilities.",
//   //       status: "In Progress",
//   //       priority: "High",
//   //       startDate: "2024-01-15",
//   //       deadline: "2024-06-30",
//   //       progress: 75,
//   //       createdBy: "Dana Wilson",
//   //       client: "TechCorp Solutions",
//   //       employees: [
//   //         { id: 101, name: "Alice Johnson", task: "Frontend UI Development", status: "Active", avatar: "AJ" },
//   //         { id: 102, name: "Bob Smith", task: "Backend APIs", status: "Active", avatar: "BS" },
//   //         { id: 105, name: "Eva Martinez", task: "Database Design", status: "Completed", avatar: "EM" },
//   //       ],
//   //     },
//   //     {
//   //       id: 2,
//   //       name: "HR Management System",
//   //       description: "Internal system for HR operations including employee management, payroll processing, and performance tracking.",
//   //       status: "Planning",
//   //       priority: "Medium",
//   //       startDate: "2024-02-01",
//   //       deadline: "2024-08-15",
//   //       progress: 25,
//   //       createdBy: "Bob Smith",
//   //       client: "Internal Project",
//   //       employees: [
//   //         { id: 103, name: "Charlie Brown", task: "Database Architecture", status: "Active", avatar: "CB" },
//   //         { id: 104, name: "Dana Wilson", task: "Authentication System", status: "Active", avatar: "DW" },
//   //       ],
//   //     },
//   //   ];
//   //   setProject(mockProjects.find((p) => p.id === parseInt(id)));
//   // }, [id]);

//   // ✅ Load project details from backend
//   useEffect(() => {
//     const fetchProject = async () => {
//       try {
//         const data = await projectAPI.getById(id);
//         setProject(data);
//       } catch (err) {
//         console.error("Error fetching project:", err);
//       }
//     };
//     fetchProject();
//   }, [id]);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Completed":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "In Progress":
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       case "Planning":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case "High":
//         return "bg-red-100 text-red-800 border-red-200";
//       case "Medium":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "Low":
//         return "bg-green-100 text-green-800 border-green-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const getProgressColor = (progress) => {
//     if (progress >= 80) return "bg-green-500";
//     if (progress >= 50) return "bg-blue-600";
//     if (progress >= 25) return "bg-yellow-500";
//     return "bg-red-500";
//   };

//   if (!project) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-900 border-t-transparent mx-auto mb-4"></div>
//           <p className="text-gray-700 text-lg">Loading project details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="p-8 max-w-6xl mx-auto">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-blue-900 hover:text-blue-700 mb-4 transition-colors"
//         >
//           <ArrowLeft className="h-5 w-5 mr-2" />
//           Back to Projects
//         </button>

//         {/* Project Card */}
//         <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 mb-8">
//           <h1 className="text-3xl font-bold text-blue-900 mb-2">{project.title}</h1>
//           <p className="text-gray-700 text-lg leading-relaxed">{project.description}</p>

//           {/* Status + Priority */}
//           <div className="flex flex-wrap gap-3 my-6">
//             <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
//               {project.status}
//             </span>
//             <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(project.priority)}`}>
//               {project.priority} Priority
//             </span>
//           </div>

//           {/* Progress Bar */}
//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <span className="text-sm font-medium text-gray-700">Project Progress</span>
//               <span className="text-sm font-semibold text-blue-900">{project.progress ?? 0}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-3">
//               <div
//                 className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
//                 style={{ width: `${project.progress}%` }}
//               ></div>
//             </div>
//           </div>
//         </div>

//         {/* Project Info Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//             <div className="flex items-center mb-2">
//               <Calendar className="h-5 w-5 text-blue-900 mr-2" />
//               <span className="text-sm font-medium text-gray-700">Start Date</span>
//             </div>
//             <p className="text-blue-900 font-semibold">{new Date(project.startDate).toLocaleDateString()}</p>
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//             <div className="flex items-center mb-2">
//               <Clock className="h-5 w-5 text-red-600 mr-2" />
//               <span className="text-sm font-medium text-gray-700">Deadline</span>
//             </div>
//             <p className="text-blue-900 font-semibold">{new Date(project.deadline).toLocaleDateString()}</p>
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//             <div className="flex items-center mb-2">
//               <Target className="h-5 w-5 text-blue-900 mr-2" />
//               <span className="text-sm font-medium text-gray-700">Created By</span>
//             </div>
//             <p className="text-blue-900 font-semibold">{project.createdBy}</p>
//           </div>

//           <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
//             <div className="flex items-center mb-2">
//               <Users className="h-5 w-5 text-blue-900 mr-2" />
//               <span className="text-sm font-medium text-gray-700">Team Size</span>
//             </div>
//             <p className="text-blue-900 font-semibold">{project.employees?.length ?? 0} Members</p>
//           </div>
//         </div>

//         {/* Team Members */}
//         <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">

//           {/* <h2 className="text-xl font-semibold text-blue-900 mb-6">Team Members</h2> */}

//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold text-blue-900">Team Members</h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {employees
//               .filter((emp) => emp.user.systemRole === "EMPLOYEE") // only non-admins
//               .map((emp) => (
//                 <div
//                   key={emp.id}
//                   className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
//                 >
//                 <div className="flex items-center">
//                   <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-semibold text-sm mr-3">
//                     {emp.name
//                       .split(" ")       // split by space
//                       .map((n) => n[0]) // take first letter of each part
//                       .join("")         // join together
//                       .toUpperCase()}   {/* e.g. "Alice Johnson" → AJ */}
//                   </div>
//                   <div>
//                     <span className="font-medium text-blue-900">{emp.name}</span>
//                     <p className="text-sm text-gray-600">{emp.task}</p>
//                   </div>
//                 </div>
//                 {emp.status === "Completed" ? (
//                   <CheckCircle className="h-5 w-5 text-green-600" />
//                 ) : (
//                   <AlertCircle className="h-5 w-5 text-yellow-600" />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>


//         {/* Admin Actions (only visible for admin) */}
//         {userRole === "ADMIN" && (
//           <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
//             <h3 className="text-lg font-semibold text-blue-900 mb-4">Admin Actions</h3>
//             <div className="flex flex-wrap gap-4">
//               <button 
//                 className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg transition-all duration-200 font-medium"
//                 onClick={() => navigate(`/edit-project/${project.id}`)}>
//                 <Pencil size={16} />
//                 Edit Project
//               </button>
//               <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium">
//                 <Trash2 size={16} />
//                 Delete Project
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProjectDetailsPage;

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Pencil, 
  Users, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Trash2, 
  Target,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { authAPI } from "../services/authAPI";
import { projectAPI } from "../services/projectAPI";

function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [userRole, setUserRole] = useState(""); 
  const [loading, setLoading] = useState(true);

  // ✅ Get logged-in user role
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authAPI.verify();
        setUserRole(data.role); // "ADMIN" or "EMPLOYEE"
      } catch (err) {
        console.error("Failed to verify user:", err);
      }
    };
    fetchUser();
  }, []);

  // ✅ Load project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectAPI.getById(id);
        setProject(data);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 border-green-200";
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Planning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-600";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-red-500";
  };

  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await projectAPI.delete(id); // ✅ call API
      alert("Project deleted successfully!");
      navigate("/"); // go back to projects list
    } catch (err) {
      console.error("❌ Error deleting project:", err);
      alert(err.response?.data?.error || "Failed to delete project");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-900 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        Project not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-900 hover:text-blue-700 mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Projects
        </button>

        {/* Project Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">{project.title}</h1>
          <p className="text-gray-700 text-lg leading-relaxed">{project.description}</p>

          {/* Status + Priority */}
          <div className="flex flex-wrap gap-3 my-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(project.priority)}`}>
              {project.priority} Priority
            </span>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Project Progress</span>
              <span className="text-sm font-semibold text-blue-900">{project.progress ?? 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Project Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-blue-900 mr-2" />
              <span className="text-sm font-medium text-gray-700">Start Date</span>
            </div>
            <p className="text-blue-900 font-semibold">{new Date(project.startDate).toLocaleDateString()}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Deadline</span>
            </div>
            <p className="text-blue-900 font-semibold">{new Date(project.deadline).toLocaleDateString()}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <Target className="h-5 w-5 text-blue-900 mr-2" />
              <span className="text-sm font-medium text-gray-700">Created By</span>
            </div>
            <p className="text-blue-900 font-semibold">{project.createdBy}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-blue-900 mr-2" />
              <span className="text-sm font-medium text-gray-700">Team Size</span>
            </div>
            <p className="text-blue-900 font-semibold">{project.members?.length ?? 0} Members</p>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-blue-900">Team Members</h2>
          </div>

          {project.members?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.members?.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-semibold text-sm mr-3">
                      {emp.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <span className="font-medium text-blue-900">{emp.name}</span>
                      <p className="text-sm text-gray-600">{emp.task}</p>
                    </div>
                  </div>
                  {emp.status === "Completed" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 italic">No team members assigned yet.</p>
          )}
        </div>

        {/* Admin Actions */}
        {userRole === "ADMIN" && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Admin Actions</h3>
            <div className="flex flex-wrap gap-4">

              <button 
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg transition-all duration-200 font-medium"
                onClick={() => navigate(`/edit-project/${project.id}`)}
              >
                <Pencil size={16} />
                Edit Project
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Trash2 size={16} />
                {isDeleting ? "Deleting..." : "Delete Project"}
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetailsPage;
