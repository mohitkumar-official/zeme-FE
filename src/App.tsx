
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropertiesState from './context/properties/PropertiesState';
import { Provider } from 'react-redux'
import { store } from './redux/store'
function App() {
  return (

    <Router>
      <Provider store={store}>
      <PropertiesState>
        <Routes>
          {/* 
                    The wildcard "/*" ensures that all nested routes (e.g., "/", "/fetch-favourites") 
                    are handled inside Home.js. This allows Home to manage different views dynamically 
                    while keeping the sidebar constant.
            */}
          <Route path="/*" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/fetch-favourites/*" element={<Home/>} />  */}
        </Routes>
      </PropertiesState>
      </Provider>
      <ToastContainer position="top-right" autoClose={1000} />
    </Router>
  );
}

export default App;
