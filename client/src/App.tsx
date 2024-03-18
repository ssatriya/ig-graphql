import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import axios from "axios";
// import io from "socket.io-client";
import { useEffect, useState } from "react";
import { setContext } from "@apollo/client/link/context";
import { Route, Outlet, useLocation } from "react-router-dom";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import { useTogglePost } from "./hooks/use-toggle-post";
import HomePage from "./pages/home-page";
import LoginPage from "./pages/login-page";
import { UserSession } from "./types/auth";
import SavedPage from "./pages/saved-page";
// import SinglePost from "./pages/single-post";
import TaggedPage from "./pages/tagged-page";
import ProfilePage from "./pages/profile-page";
import ProfileLayout from "./pages/profile-layout";
import CustomSwitch from "./components/custom-switch";
import ProtectedLayout from "./pages/protected-layout";
import LoadingScreen from "./components/loading-screen";
import SessionProvider from "./components/session-provider";
import CustomSwitchModal from "./components/custom-switch-modal";
import FollowingModal from "./pages/_components/profile/following-modal";
import PostModal from "./pages/_components/content/post-modal/post-modal";

const queryClient = new QueryClient();
const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_DEV_SERVER}/graphql`,
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
      axios.defaults.withCredentials = true;
      const { data } = await axios(
        `${import.meta.env.VITE_DEV_SERVER}/api/user/session`,
        {
          method: "GET",
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
              merge(_, incoming) {
                return incoming.slice().reverse();
              },
            },
          },
        },
      },
    }),
  });

  const isLoggedIn = !!session.user;

  // const socket = io("http://localhost:4000", {
  //   transportOptions: {
  //     polling: {
  //       extraHeaders: {
  //         Authorization: `Bearer ${session.session?.id}`,
  //       },
  //     },
  //   },
  // });

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("connected!");
  //     socket.emit("room", "room1");
  //   });

  //   socket.on("message", (data) => {
  //     console.log(data);
  //   });
  // }, [socket]);

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
