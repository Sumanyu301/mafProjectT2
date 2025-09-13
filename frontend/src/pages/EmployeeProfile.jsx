import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { employeeAPI } from "../services/employeeAPI";

export default function EmployeeProfile() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  // Edit form state - using fields available in current schema
  const [editForm, setEditForm] = useState({
    name: "",
    contact: "",
    addSkills: [],
    removeSkills: []
  });

  const [newSkill, setNewSkill] = useState({ skillId: "", yearsOfExperience: 1 });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let employeeData;

      if (id === "me" || !id) {
        // Get current user's profile
        employeeData = await employeeAPI.getMyProfile();
        setIsCurrentUser(true);
      } else {
        // Get specific employee profile
        employeeData = await employeeAPI.getById(id);
        // Check if this is current user
        const myProfile = await employeeAPI.getMyProfile();
        setIsCurrentUser(myProfile.id === parseInt(id));
      }

      setEmployee(employeeData);

      // Initialize edit form with current data
      setEditForm({
        name: employeeData.name || "",
        contact: employeeData.contact || "",
        addSkills: [],
        removeSkills: []
      });

      // Fetch all skills for the dropdown
      const skillsData = await employeeAPI.getAllSkills();
      setAllSkills(skillsData);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch employee data");
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

  const addSkillToList = () => {
    if (newSkill.skillId && newSkill.yearsOfExperience) {
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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {employee.name}
              </h1>
              <p className="text-lg text-gray-600 mt-2">{employee.user.email}</p>
            </div>
            {isCurrentUser && (
              <div className="space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveChanges}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleEditToggle}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
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
                    value={employee.user.email}
                    disabled
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-600"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-900">{employee.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{employee.user.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Contact:</span>
                  <span className="ml-2 text-gray-900">{employee.contact || "Not provided"}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Max Tasks:</span>
                  <span className="ml-2 text-gray-900">{employee.maxTasks}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Current Workload:</span>
                  <span className="ml-2 text-gray-900">{employee.currentWorkload}</span>
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
                        !employee.skills.some(es => es.skill.id === skill.id) &&
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
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add
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
      </div>
    </div>
  );
}
