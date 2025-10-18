import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../Home";
import AddSyllabus from "../Add-Syllabus";
import Settings from "../Settings";

function Navbar() {
    return (
        <Router>
            /* Routing */
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/addsyllabus" element={<AddSyllabus />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>

            <nav>
                <Link to="/home">Home</Link>
                <Link to="/addsyllabus">Add Syllabus</Link>
                <Link to="/settings">Settings</Link>
            </nav>
        </Router>
    )
}

export default Navbar;