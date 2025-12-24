import { createContext, useContext, useEffect, useState } from "react";

const LookupContext = createContext();

export function LookupProvider({ children }) {
  const [lookups, setLookups] = useState(null);

  useEffect(() => {
    async function loadLookups() {
      const res = await fetch("/api/lookups");
      const data = await res.json();
      setLookups(data);
    }
    loadLookups();
  }, []);

  return (
    <LookupContext.Provider value={lookups}>{children}</LookupContext.Provider>
  );
}

export const useLookups = () => useContext(LookupContext);
