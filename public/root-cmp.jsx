const { useState } = React
const Router = ReactRouterDOM.BrowserRouter
const { Routes, Route, Navigate } = ReactRouterDOM

import { AppHeader } from "./cmps/AppHeader.jsx";
import { Team } from "./cmps/Team.jsx";
import { Vision } from "./cmps/Vision.jsx";
import { About } from "./pages/About.jsx";
import { CarDetails } from "./pages/CarDetails.jsx";
import { CarEdit } from "./pages/CarEdit.jsx";
import { CarIndex } from "./pages/CarIndex.jsx";
import { Home } from "./pages/Home.jsx";

export function App() {

    return (
        <Router>
            <section className="app main-layout">
                <AppHeader />

                <main>
                    <Routes>
                        {/* <Route path="/" element={<Navigate to="/car" />} /> */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />}>
                            <Route path="team" element={<Team />} />
                            <Route path="vision" element={<Vision />} />
                        </Route>
                        <Route path="/car/:carId" element={<CarDetails />} />
                        <Route path="/car/edit/:carId" element={<CarEdit />} />
                        <Route path="/car/edit" element={<CarEdit />} />
                        <Route path="/car" element={<CarIndex />} />
                    </Routes>
                </main>
            </section>
        </Router>
    )
} 