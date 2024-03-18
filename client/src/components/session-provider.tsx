import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

import { UserSession } from "@/types/auth";
import { GraphQLClient } from "graphql-request";
import { GRAPHQL_ENDPOINT } from "@/lib/config";

type AuthContext = {
  session: UserSession;
  refreshSessionData: () => void;
};

const authContext: AuthContext = {
  session: {
    user: null,
    session: null,
  },
  refreshSessionData: async () => {},
};

const AuthContext = createContext<AuthContext>(authContext);

type SessionProviderProps = {
  session: UserSession;
  children: React.ReactNode;
};

export const client = new GraphQLClient(GRAPHQL_ENDPOINT);
const SessionProvider = ({ children, session }: SessionProviderProps) => {
  const [authSession, setAuthSession] = useState<UserSession>(session);

  client.setHeader("authorization", `Bearer ${session.session?.id}`);

  useEffect(() => {
    if (session) {
      setAuthSession(session);
    }
  }, [session]);

  const refreshSessionData = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BACKEND_SERVER}/api/user/session`,
      {
        withCredentials: true,
      }
    );
    setAuthSession(data);
  };

  return (
    <AuthContext.Provider
      value={{
        session: authSession,
        refreshSessionData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default SessionProvider;

export const useCurrentSession = () => {
  return useContext(AuthContext);
};
