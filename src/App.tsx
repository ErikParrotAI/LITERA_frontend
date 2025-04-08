import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.tsx';
import BooksPage from './pages/BooksPage/BooksPage.tsx';
import MainLayout from "./layouts/MainLayout/MainLayout.tsx";
import NotFound from "./pages/not-found.tsx";
import UserPage from "./pages/UserPage/UserPage.tsx";
import ProfilePage from "./components/ProfilePage/ProfilePage.tsx";
import MapPage from "./pages/MapPage/MapPage.tsx";
import BookDetail from './components/BookDetail/BookDetail';


function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout/>}>
                <Route index element={<HomePage/>}/>
                <Route path="locations" element={<MapPage/>}/>
                <Route path="books" element={<BooksPage/>}/>
                <Route path="profile" element={<UserPage/>}/>
                <Route path="settings" element={<ProfilePage/>}/>
                <Route path='*' element={<NotFound/>}/>
                <Route path="books/:id" element={<BookDetail/>}/>
            </Route>
        </Routes>
    );
}

export default App;