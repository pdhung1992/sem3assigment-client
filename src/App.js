
import './App.css';
import {Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Client from "./pages/Client";
import {useSelector} from "react-redux";

function PrivateRoute({ element, roles }) {
    const user = useSelector(state => state.auth);

    if (!user.userData) {
        // if not logged in
        return <Navigate to="/login"/>;
    }
    return element;

}
function App() {
  return (
    <>
      <Routes>
        <Route path={'/'} element={<Home/>}/>
        <Route path={'/login'} element={<Login/>}/>
          <Route path={'/signup'} element={<SignUp/>}/>
          <Route
              path={'/client/*'}
              element={
                <PrivateRoute element={<Client />}/>
              }/>
      </Routes>
    </>
  );
}

export default App;
