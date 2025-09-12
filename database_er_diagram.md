# Database Entity-Relationship Diagram

## Complete ER Diagram for MERN Project Management System

```mermaid
erDiagram
    %% Main Entities
    User {
        int id PK
        string username UK
        string email UK
        string passwordHash "password_hash"
        datetime createdAt "created_at, default(now())"
        datetime lastLogin "last_login, nullable"
    }

    Employee {
        int id PK
        int userId FK,UK "user_id"
        string name
        string contact
        int maxTasks "max_tasks, default(5)"
        float currentWorkload "current_workload, default(0)"
    }

    Skill {
        int id PK
        string name UK
    }

    EmployeeSkill {
        int employeeId FK,PK "employee_id"
        int skillId FK,PK "skill_id"
        int yearsExperience "years_experience"
    }

    Project {
        int id PK
        int createdBy FK "created_by"
        int ownerId FK "owner_id"
        string title
        string description
        Priority priority "enum"
        datetime startDate "start_date"
        datetime deadline
        ProjectStatus status "enum, default(PLANNING)"
        datetime createdAt "created_at, default(now())"
        datetime updatedAt "updated_at"
    }

    ProjectEmployee {
        int projectId FK,PK "project_id"
        int employeeId FK,PK "employee_id"
        datetime joinedAt "joined_at, default(now())"
    }

    Task {
        int id PK
        int projectId FK "project_id"
        int employeeId FK "employee_id, nullable"
        string title
        string description "nullable"
        TaskStatus status "enum, default(TODO)"
        Priority priority "enum, default(MEDIUM)"
        float estimatedHours "estimated_hours, nullable"
        float actualHours "actual_hours, nullable"
        datetime startDate "start_date, nullable"
        datetime endDate "end_date, nullable"
        datetime createdAt "created_at, default(now())"
        datetime updatedAt "updated_at"
    }

    Milestone {
        int id PK
        int projectId FK "project_id"
        string title
        datetime dueDate "due_date"
        boolean completed "default(false)"
        datetime createdAt "created_at, default(now())"
    }

    %% Relationships
    User ||--o| Employee : "has_profile"
    Employee ||--o{ EmployeeSkill : "has_skills"
    Skill ||--o{ EmployeeSkill : "assigned_to"
    Employee ||--o{ Project : "creates (createdBy)"
    Employee ||--o{ Project : "owns (ownerId)"
    Employee ||--o{ ProjectEmployee : "member_of"
    Project ||--o{ ProjectEmployee : "has_members"
    Project ||--o{ Task : "contains"
    Employee ||--o{ Task : "assigned_to"
    Project ||--o{ Milestone : "has_milestones"
```

## Entity Details

### **User Entity**

- **Purpose**: Authentication and basic user information
- **Key Features**:
  - Unique username and email
  - Password hash for security
  - Tracks login history
- **Relationships**: One-to-one with Employee

### **Employee Entity**

- **Purpose**: Extended profile for project management
- **Key Features**:
  - Workload management (maxTasks, currentWorkload)
  - Contact information
- **Relationships**:
  - Belongs to one User
  - Can have multiple Skills
  - Can create and own Projects
  - Can be assigned to Tasks
  - Can be member of multiple Projects

### **Skill Entity**

- **Purpose**: Represents technical/professional skills
- **Key Features**:
  - Unique skill names
- **Relationships**: Many-to-many with Employees through EmployeeSkill

### **EmployeeSkill Entity**

- **Purpose**: Junction table linking employees to their skills
- **Key Features**:
  - Tracks years of experience for each skill
  - Composite primary key (employeeId, skillId)
- **Note**: Removed proficiency levels for simplicity

### **Project Entity**

- **Purpose**: Main project management entity
- **Key Features**:
  - Dual ownership model (creator vs current owner)
  - Priority and status tracking
  - Timeline management (startDate, deadline)
- **Relationships**:
  - Created by Employee (createdBy)
  - Owned by Employee (ownerId) - can be transferred
  - Has multiple Tasks and Milestones
  - Has multiple Employee members

### **ProjectEmployee Entity**

- **Purpose**: Junction table for project team members
- **Key Features**:
  - Tracks when employee joined project
  - Composite primary key (projectId, employeeId)

### **Task Entity**

- **Purpose**: Individual work items within projects
- **Key Features**:
  - Optional assignment to employees
  - Time tracking (estimated vs actual hours)
  - Flexible scheduling (optional start/end dates)
  - Priority and status management
- **Relationships**:
  - Belongs to one Project
  - Optionally assigned to one Employee

### **Milestone Entity**

- **Purpose**: Project checkpoints and deliverables
- **Key Features**:
  - Due date tracking
  - Completion status
- **Relationships**: Belongs to one Project

## Enums

### **Priority**

- LOW
- MEDIUM
- HIGH
- CRITICAL

### **ProjectStatus**

- PLANNING
- IN_PROGRESS
- ON_HOLD
- COMPLETED
- CANCELLED

### **TaskStatus**

- TODO
- IN_PROGRESS
- IN_REVIEW
- COMPLETED
- BLOCKED

## Key Design Features

1. **Project Ownership Model**: Anyone can create projects and become the owner
2. **Simplified Skills**: Only tracks skill name and years of experience
3. **Flexible Task Assignment**: Tasks can be unassigned
4. **Dual Project Relationships**: Creator vs Owner allows ownership transfer
5. **Cascade Deletions**: User deletion removes employee profile and all related data
6. **Audit Trail**: Created/updated timestamps on relevant entities
