import { createContext, useContext, useState } from "react";

const TeamContext = ({ children }) => {
  const TeamContextItem = createContext(null);
  const [team, setTeam] = useState();

  return (
    <TeamContextItem.Provider value={{ team, setTeam }}>
      {children}
    </TeamContextItem.Provider>
  );
};

export default TeamContext;
