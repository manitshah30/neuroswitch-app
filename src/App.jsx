import { Routes, Route } from "react-router-dom";

// Page Imports
import LandPg from "./components/LandingPage/LandPg";
import SignInPage from "./pages/SignInPage";
import Test from "./pages/Test"; // I'm assuming Test is your Dashboard page
import VocabularyGamePage from "./components/Games/VocabularyGamePage";
import PictureAssociation from "./components/Games/PictureAssociation";
import AudioScramble from "./components/Games/AudioScramble";
import StoryMode from "./components/Games/StoryMode";
import LessonPage from "./pages/lessons/LessonPage";
import TestPage from "./pages/TestPage";

// 1. Import the two guard components we created
import LoggedInRoute from './components/auth/LoggedInRoute';
import LoggedOutRoute from './components/auth/LoggedOutRoute';

function App() {
  return (
    // The <BrowserRouter> is removed from here because it's now in main.jsx
    <Routes>
      {/* --- Public Route --- */}
      {/* Anyone can see the landing page */}
      <Route path="/" element={<LandPg />} />

      {/* --- Routes for LOGGED-OUT Users Only --- */}
      {/* This guard protects the sign-in page */}
      <Route element={<LoggedOutRoute />}>
        <Route path="/signin" element={<SignInPage />} />
      </Route>

      {/* --- Routes for LOGGED-IN Users Only --- */}
      {/* This guard protects all your main app pages */}
      <Route element={<LoggedInRoute />}>
        <Route path="/dashboard" element={<Test />} />
        <Route path="/Games/vocabulary" element={<VocabularyGamePage />} />
        <Route path="/Games/association" element={<PictureAssociation />} />
        <Route path="/Games/scramble" element={<AudioScramble />} />
        <Route path="/Games/story" element={<StoryMode />} />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
      </Route>

      {/* 2. Add this temporary route for debugging */}
      <Route path="/test" element={<TestPage />} />
    </Routes>
  );
}

export default App;

