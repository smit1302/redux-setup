import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MaterialUIControllerProvider } from 'context';
import { Provider } from 'react-redux'; // Import Provider
import { store } from './redux/store/store';
import App from 'App';

const rootElement = document.getElementById('root');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
            <Provider store={store}>
                <BrowserRouter>
                    <MaterialUIControllerProvider>
                        <ToastContainer autoClose={5000}
                            hideProgressBar={false} newestOnTop={false} closeOnClick
                            rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
                        <App />
                    </MaterialUIControllerProvider>
                </BrowserRouter>
            </Provider>
    );
}

reportWebVitals();
