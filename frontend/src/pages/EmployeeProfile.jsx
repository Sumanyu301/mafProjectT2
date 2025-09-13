import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { employeeAPI } from "../services/employeeAPI";

// import EmployeeSkeleton from "../components/EmployeeSkeleton"; 
import { authAPI } from "../services/authAPI";
import { ProfileSkeleton, SkillsSkeleton, ProjectsSkeleton } from "../components/skeletons";


export default function EmployeeProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Edit form state - using fields available in current schema
  const [editForm, setEditForm] = useState({
    name: "",
    contact: "",
    addSkills: [],
    removeSkills: []
  });

  const [newSkill, setNewSkill] = useState({ skillId: "", yearsOfExperience: 1 });

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  useEffect(() => {
    checkAuthAndFetchData();
  }, [id]);

  const checkAuthAndFetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First check if user is authenticated
      console.log("Checking authentication...");
      await authAPI.verify();
      console.log("Authentication successful, proceeding to fetch profile data");
      
      // If authentication passes, fetch the profile data
      await fetchData();
    } catch (authError) {
      console.error("Authentication failed:", authError);
      if (authError.response?.status === 401) {
        setError("You need to log in to view this profile. Please go to the login page.");
        setLoading(false);
        return;
      } else {
        setError("Authentication error. Please try logging in again.");
        setLoading(false);
        return;
      }
    }
  };

  const fetchData = async () => {
    try {
      console.log("Fetching employee data for id:", id);
      let employeeData;

      if (id === "me" || !id) {
        // Get current user's profile
        console.log("Fetching my profile...");
        employeeData = await employeeAPI.getMyProfile();
        setIsCurrentUser(true);
      } else {
        // Get specific employee profile
        console.log("Fetching specific employee profile for id:", id);
        employeeData = await employeeAPI.getById(id);
        // Check if this is current user
        const myProfile = await employeeAPI.getMyProfile();
        setIsCurrentUser(myProfile.id === parseInt(id));
      }

      console.log("Employee data received:", employeeData);
      setEmployee(employeeData);

      // Initialize edit form with current data
      setEditForm({
        name: employeeData.name || "",
        contact: employeeData.contact || "",
        addSkills: [],
        removeSkills: []
      });

      // Fetch all skills for the dropdown
      try {
        const skillsData = await employeeAPI.getAllSkills();
        console.log('Loaded skills:', skillsData);
        setAllSkills(skillsData);
      } catch (skillsError) {
        console.error('Failed to load skills:', skillsError);
        setAllSkills([]); // Fallback to empty array
      }

    } catch (err) {
      console.error("Error fetching employee data:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Full error object:", err);
      
      if (err.response?.status === 401) {
        setError("You need to log in to view this profile. Redirecting to login...");
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError(err.response?.data?.message || err.message || "Failed to fetch employee data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset form when entering edit mode
      setEditForm({
        name: employee.name || "",
        contact: employee.contact || "",
        addSkills: [],
        removeSkills: []
      });
    }
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const addSkillToList = async () => {
    if (newSkill.skillId && newSkill.yearsOfExperience) {
      setIsAddingSkill(true);
      try {
        const skill = allSkills.find(s => s.id === parseInt(newSkill.skillId));
        if (skill) {
          setEditForm({
            ...editForm,
            addSkills: [...editForm.addSkills, {
              skillId: parseInt(newSkill.skillId),
              skillName: skill.name,
              yearsOfExperience: parseInt(newSkill.yearsOfExperience)
            }]
          });
          setNewSkill({ skillId: "", yearsOfExperience: 1 });
        }
      } finally {
        setIsAddingSkill(false);
      }
    }
  };

  const removeSkillFromAddList = (skillId) => {
    setEditForm({
      ...editForm,
      addSkills: editForm.addSkills.filter(s => s.skillId !== skillId)
    });
  };

  const markSkillForRemoval = (skillId) => {
    if (!editForm.removeSkills.includes(skillId)) {
      setEditForm({
        ...editForm,
        removeSkills: [...editForm.removeSkills, skillId]
      });
    }
  };

  const unmarkSkillForRemoval = (skillId) => {
    setEditForm({
      ...editForm,
      removeSkills: editForm.removeSkills.filter(id => id !== skillId)
    });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        name: editForm.name,
        contact: editForm.contact,
        addSkills: editForm.addSkills,
        removeSkills: editForm.removeSkills
      };

      await employeeAPI.updateProfile(employee.id, updateData);
      
      // Refresh data
      await fetchData();
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!employee) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              {/* Avatar with initials */}
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {employee?.name ? employee.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {employee?.name || "Loading..."}
                </h1>
                <p className="text-lg text-gray-600 mt-2">{employee?.user?.email || ""}</p>
              </div>
            </div>
            {isCurrentUser && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSaving && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleEditToggle}
                      disabled={isSaving}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={editForm.contact}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (readonly)
                  </label>
                  <input
                    type="email"
                    value={employee?.user?.email || ""}
                    disabled
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-600"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-900">{employee?.name || "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{employee?.user?.email || "N/A"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Contact:</span>
                  <span className="ml-2 text-gray-900">{employee?.contact || "Not provided"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Max Tasks:</span>
                  <span className="ml-2 text-gray-900">{employee?.maxTasks || 0}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Current Workload:</span>
                  <span className="ml-2 text-gray-900">{employee?.currentWorkload || 0}</span>
                </div>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {employee.statistics?.totalTasks || 0}
                </div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {employee.statistics?.completedTasks || 0}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {employee.statistics?.ownedProjects || 0}
                </div>
                <div className="text-sm text-gray-600">Owned Projects</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {employee.statistics?.memberProjects || 0}
                </div>
                <div className="text-sm text-gray-600">Member Projects</div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
          
          {isEditing && isCurrentUser && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Add New Skill</h3>
              <div className="mb-2 text-sm text-gray-600">
                Available skills: {allSkills.length} loaded
              </div>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skill
                  </label>
                  <select
                    value={newSkill.skillId}
                    onChange={(e) => setNewSkill({...newSkill, skillId: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a skill</option>
                    {allSkills
                      .filter(skill => 
                        !(employee?.skills || []).some(es => es.skill.id === skill.id) &&
                        !editForm.addSkills.some(as => as.skillId === skill.id)
                      )
                      .map(skill => (
                        <option key={skill.id} value={skill.id}>
                          {skill.name}
                        </option>
                      ))
                    }
                  </select>
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newSkill.yearsOfExperience}
                    onChange={(e) => setNewSkill({...newSkill, yearsOfExperience: e.target.value})}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={addSkillToList}
                  disabled={isAddingSkill || !newSkill.skillId}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAddingSkill && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {isAddingSkill ? "Adding..." : "Add"}
                </button>
              </div>

              {/* Skills to be added */}
              {editForm.addSkills.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Skills to be added:</h4>
                  <div className="flex flex-wrap gap-2">
                    {editForm.addSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill.skillName} ({skill.yearsOfExperience} years)
                        <button
                          onClick={() => removeSkillFromAddList(skill.skillId)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Current Skills */}
          <div className="space-y-3">
            {employee.skills && employee.skills.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {employee.skills.map((employeeSkill) => (
                  <div
                    key={employeeSkill.id}
                    className={`inline-flex items-center px-3 py-2 rounded-full text-sm ${
                      editForm.removeSkills.includes(employeeSkill.skill.id)
                        ? "bg-red-100 text-red-800 line-through"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    <span className="font-medium">{employeeSkill.skill.name}</span>
                    <span className="ml-1 text-xs">
                      ({employeeSkill.yearsExperience} years)
                    </span>
                    {isEditing && isCurrentUser && (
                      <button
                        onClick={() => {
                          if (editForm.removeSkills.includes(employeeSkill.skill.id)) {
                            unmarkSkillForRemoval(employeeSkill.skill.id);
                          } else {
                            markSkillForRemoval(employeeSkill.skill.id);
                          }
                        }}
                        className={`ml-2 hover:scale-110 ${
                          editForm.removeSkills.includes(employeeSkill.skill.id)
                            ? "text-gray-600"
                            : "text-red-600"
                        }`}
                      >
                        {editForm.removeSkills.includes(employeeSkill.skill.id) ? "↻" : "×"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No skills added yet</p>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Owned Projects */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
              Owned Projects
            </h2>
            {employee.ownedProjects && employee.ownedProjects.length > 0 ? (
              <div className="max-h-64 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {employee.ownedProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleProjectClick(project.id)}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {project.description || "No description available"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === "ACTIVE" || project.status === "IN_PROGRESS"
                              ? "bg-green-100 text-green-800"
                              : project.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-800"
                              : project.status === "PLANNING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {project.status}
                        </span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    {project.deadline && (
                      <div className="mt-2 text-xs text-gray-500">
                        Deadline: {new Date(project.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p>No owned projects yet</p>
              </div>
            )}
          </div>

          {/* Assigned Projects */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
              Working On
            </h2>
            {employee.projectMembers && employee.projectMembers.length > 0 ? (
              <div className="max-h-64 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {employee.projectMembers.map((projectMember) => (
                  <div
                    key={projectMember.project.id}
                    onClick={() => handleProjectClick(projectMember.project.id)}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {projectMember.project.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {projectMember.project.description || "No description available"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            projectMember.project.status === "ACTIVE" || projectMember.project.status === "IN_PROGRESS"
                              ? "bg-green-100 text-green-800"
                              : projectMember.project.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-800"
                              : projectMember.project.status === "PLANNING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {projectMember.project.status}
                        </span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                      <span>
                        Joined: {new Date(projectMember.joinedAt).toLocaleDateString()}
                      </span>
                      {projectMember.project.ownerId !== employee.id && (
                        <span className="text-blue-600">Team Member</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p>Not assigned to any projects yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
