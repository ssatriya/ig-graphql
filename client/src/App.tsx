import { Route, Outlet, useLocation } from "react-router-dom";

import HomePage from "./pages/home-page";
import LoginPage from "./pages/login-page";
import ProtectedLayout from "./pages/protected-layout";
import PostModal from "./pages/_components/content/post-modal/post-modal";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SinglePost from "./pages/single-post";
import CustomSwitchModal from "./components/custom-switch-modal";
import SessionProvider from "./components/session-provider";
import { useEffect, useState } from "react";
import { UserSession } from "./types/auth";
import axios from "axios";
import LoadingScreen from "./components/loading-screen";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
// import { useTogglePost } from "./hooks/use-toggle-post";
import ProfilePage from "./pages/profile-page";
import ProfileLayout from "./pages/profile-layout";
import CustomSwitch from "./components/custom-switch";
import SavedPage from "./pages/saved-page";
import TaggedPage from "./pages/tagged-page";
import FollowingModal from "./pages/_components/profile/following-modal";

const queryClient = new QueryClient();
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;
  // const { isOpen } = useTogglePost((state) => state);

  const [session, setSession] = useState<UserSession>({
    session: null,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await axios.get(
        "http://localhost:4000/api/user/session",
        {
          withCredentials: true,
        }
      );

      const result = data as UserSession;
      setSession(result);
      setIsLoading(false);
    };
    getSession();
  }, []);

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: session.user ? `Bearer ${session.session.id}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            like: {
              merge(existing, incoming) {
                return incoming.slice().reverse();
              },
            },
          },
        },
      },
    }),
  });

  const isLoggedIn = !!session.user;

  if (isLoading) {
    return <LoadingScreen />;
  }

  loadDevMessages();
  loadErrorMessages();

  return (
    <SessionProvider session={session}>
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <CustomSwitchModal>
            {isLoggedIn && (
              <Route element={<ProtectedLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/p/:id" element={<SinglePost />} />
                <Route path="/:username" element={<ProfileLayout />}>
                  <Route index element={<ProfilePage />} />
                  <Route path="saved" element={<SavedPage />} />
                  <Route path="tagged" element={<TaggedPage />} />
                  <Route path="following" element={<FollowingModal />} />
                </Route>
              </Route>
            )}
            {!isLoggedIn && <Route path="/" element={<LoginPage />} />}
          </CustomSwitchModal>
          {background && (
            <CustomSwitch>
              <Route path="/p/:id" element={<PostModal />} />
              <Route path="/:username/following" element={<FollowingModal />} />
            </CustomSwitch>
          )}
          <Outlet />
        </QueryClientProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}

export default App;
