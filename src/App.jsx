import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>MindWell</h1>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
