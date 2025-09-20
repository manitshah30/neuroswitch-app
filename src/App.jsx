import LandPg from "./components/LandingPage/LandPg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import Test from "./pages/Test";
import VocabularyGamePage from "./components/Games/VocabularyGamePage";
import PictureAssociation from "./components/Games/PictureAssociation";
import AudioScramble from "./components/Games/AudioScramble";
import StoryMode from "./components/Games/StoryMode";
import LessonPage from "./pages/lessons/LessonPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandPg />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/dashboard" element={<Test />} />
        <Route path="/Games/vocabulary" element={<VocabularyGamePage />} />
        <Route path="/Games/association" element={<PictureAssociation />} />
        <Route path="/Games/scramble" element={<AudioScramble />} />
        <Route path="/Games/story" element={<StoryMode />} />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
