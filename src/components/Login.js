
import '../assets/css/auth.css'
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import authServices from "../services/auth-service";
import {loginSuccess, loginFail} from '../actions/authActions'
const Login = () => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.auth);


    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const emailRef = useRef(null);
    const [message, setMessage] = useState("");
    const [isLogin, setIsLogin] = useState(false);

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    };
    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
           const data = await authServices.login(email, password);
           if (data && data.token){
               dispatch(loginSuccess(data));
               navigate('/client')
           }
           else {
               dispatch(loginFail('Login failed.'))
               setMessage('Login failed.')
           }
        }catch (error){
            const resMessage =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            setMessage(resMessage);
        }
    }

    const checkLogin = () => {
        if(user && user.userData){
            setIsLogin(true);
        }
    }
    if(isLogin){
        navigate('/')
    }

    useEffect(() => {
        emailRef.current.focus();
        checkLogin()
    }, [])
    return(
        <>
            <section className="login">
                <div className="login_box">
                    <div className="left">
                        <div className="top_link"><Link to="/"><i className="bi bi-arrow-left-circle"></i> Return home</Link></div>
                        <div className="contact">
                            <form onSubmit={handleLogin}>
                                <h3>LOG IN</h3>
                                <input type="email"
                                       placeholder="Email..."
                                       name="email"
                                       value={email}
                                       onChange={handleChangeEmail}
                                       required
                                       ref={emailRef}
                                />
                                <input type="password"
                                       placeholder="Password..."
                                       name="password"
                                       value={password}
                                       onChange={handleChangePassword}
                                       required
                                />
                                <button className="submit">LET'S GO</button>
                                <div className="signup-link">
                                    <h6 className="contact">Don't have an Account? <Link to={'/signup'}>Sign Up</Link></h6>
                                </div>
                            </form>
                            <br/>
                        </div>
                    </div>
                    <div className="right">

                    </div>
                </div>
            </section>
        </>
    )
}

export default Login;