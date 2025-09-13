import "./globals.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Home from "./pages/dashboard/home/Home";
import Search from "./pages/dashboard/search/Search";
import UserConext from "./contexts/User";
import Anime from "./pages/dashboard/anime/Anime";
import List from "./pages/dashboard/list/List";
import ListItem from "./pages/dashboard/list/listItem/ListItem";
import Profile from "./pages/dashboard/profile/Profile";
import PublicProfile from "./pages/dashboard/publicProfile/PublicProfile";
import SearchSong from "./pages/dashboard/searchSong/SearchSong";
import Songs from "./pages/dashboard/songs/Songs";
import Song from "./pages/dashboard/song/Song";
import TopSongs from "./pages/dashboard/topSongs/TopSongs";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {

  const userId = localStorage.getItem("userId") || null
  const username = localStorage.getItem("username") || null
  const email = localStorage.getItem("email") || null
  const profilePic = localStorage.getItem("profilePic") || null

  const setUserId = (value) => {
    localStorage.setItem("userId", value)
  }

  const setUsername = (value) => {
    localStorage.setItem("username", value)
  }

  const setEmail = (value) => {
    localStorage.setItem("email", value)
  }

  const setProfilePic = (value) => {
    localStorage.setItem("profilePic", value)
  }

  return (
    <ErrorBoundary>
      <UserConext.Provider value={{ userId, username, email, profilePic, setUserId, setUsername, setEmail, setProfilePic }}>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Home />} />
              <Route path="/dashboard/searchAnime" element={<Search />} />
              <Route path="/dashboard/searchManga" element={<Search />} />
              <Route path="/dashboard/searchWebtoon" element={<Search />} />
              <Route path="/dashboard/anime/:id" element={<Anime />} />
              <Route path="/dashboard/manga/:id" element={<Anime />} />
              <Route path="/dashboard/list" element={<List />} />
              <Route path="/dashboard/list/:id" element={<ListItem />} />
              <Route path="/dashboard/settings" element={<Home />} />
              <Route path="/dashboard/profile/:id" element={<Profile />} />
              <Route path="/dashboard/public-profile/:username" element={<PublicProfile />} />
              <Route path="/dashboard/searchSongs" element={<SearchSong />} />
              <Route path="/dashboard/:id/songs" element={<Songs />} />
              <Route path="/dashboard/:id/:basename" element={<Song />} />
              <Route path="/dashboard/topSongs" element={<TopSongs />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </UserConext.Provider>
    </ErrorBoundary>
  );
}

export default App;
