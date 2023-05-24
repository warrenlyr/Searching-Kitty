import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import LandingPage from "./pages/Landing Page/landing";
import DailyPuzzle from "./pages/Daily Puzzle/dailyPuzzle";
import DesignPuzzle from "./pages/Design Puzzle/designPuzzle";
import normalPuzzle from "./pages/Level-Based Game/normalPuzzle";
import NotFound from "./pages/notFound";
import Register from "./pages/Register Page/register";
import Token from "./components/Token";

function App() {
	const { token, removeToken, setToken } = Token();

	return (
		<Router>
			<Navbar token={token} removeToken={removeToken} setToken={setToken} />
			<Routes>
				<Route exact path="/" element={<LandingPage />} />
				<Route
					path="/game/dailypuzzle"
					element={<DailyPuzzle token={token} />}
				/>
				<Route path="/game/designpuzzle" element={<DesignPuzzle />} />
				<Route path="/game/normalpuzzle" element={<normalPuzzle />} />
				<Route path="/register" element={<Register />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
}

export default App;
