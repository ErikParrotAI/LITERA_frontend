import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.tsx';
import BooksPage from './pages/BooksPage/BooksPage.tsx';
import MainLayout from "./layouts/MainLayout/MainLayout.tsx";
import NotFound from "./pages/not-found.tsx";
import ProfilePage from "./components/ProfilePage.tsx";


function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout/>}>
                <Route index element={<HomePage/>}/>
                <Route path="books" element={<BooksPage/>}/>
                <Route path="settings" element={<ProfilePage/>}/>
                <Route path='*' element={<NotFound/>}/>
            </Route>
        </Routes>
    );
}

export default App;