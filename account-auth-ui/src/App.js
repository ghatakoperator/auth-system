import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage     from './pages/loginPage';

 import RegisterPage  from './pages/registerPage';
import OTPPage       from './pages/OTPPage';
import ThankYouPage  from './pages/thankYouPage';
import ErrorPage     from './pages/errorPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.scss';
function App() {
  return (
    <div className="App">{
      // <BrowserRouter>
        <Routes>
          <Route path="/"        element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/otp"     element={<OTPPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="error-page"         element={<ErrorPage />} />
        </Routes>
      // </BrowserRouter>
    }
    </div>
  );
}

export default App;
