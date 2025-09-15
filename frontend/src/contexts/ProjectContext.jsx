import { createContext, useContext, useState, useEffect } from "react";
import { projectAPI } from "../services/projectAPI";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const loadAll = async () => {
    try {
      const data = await projectAPI.getAll();
      setProjects(data || []);
    } catch (err) {
      console.error("ProjectProvider: failed to load projects", err);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const upsertProject = (proj) => {
    if (!proj) return;
    setProjects((prev) => {
      const idx = prev.findIndex((p) => Number(p.id) === Number(proj.id));
      if (idx === -1) return [proj, ...prev];
      const copy = [...prev];
      copy[idx] = { ...copy[idx], ...proj };
      return copy;
    });
  };

  return (
    <ProjectContext.Provider value={{ projects, setProjects, loaded, loadAll, upsertProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  return useContext(ProjectContext);
}