import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ContactList from "./components/ContactList";
import ContactForm from "./components/ContactForm";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<ContactList />} />
          <Route path="/add" element={<ContactForm />} />
          <Route path="/edit/:id" element={<ContactForm />} />
        </Routes>
      </Router>
  );
}

export default App;
