
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CookiesProvider } from 'react-cookie';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <CookiesProvider>
    <BrowserRouter>

        <App />

    </BrowserRouter>
    </CookiesProvider>
    // </React.StrictMode>
);


reportWebVitals();
