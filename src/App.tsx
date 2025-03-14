import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.tsx';
import BooksPage from './pages/BooksPage.tsx';
import MainLayout from "./layouts/MainLayout/MainLayout.tsx";
import NotFound from "./pages/not-found.tsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout/>}>
                <Route index element={<HomePage/>}/>
                <Route path="books" element={<BooksPage/>}/>
                <Route path='*' element={<NotFound/>}/>
            </Route>
        </Routes>
    );
}

export default App;