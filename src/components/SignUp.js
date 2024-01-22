import '../assets/css/auth.css'
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import AuthServices from "../services/auth-service";
import Swal from "sweetalert2";
import {useSelector} from "react-redux";
import axios from "axios";


const SignUp = () => {
    const user = useSelector(state => state.auth);

    const navigate = useNavigate();
    const [fullname, setFullname] = useState("");
    const [isvalidName, setIsValidName] = useState(true);
    const [email, setEmail] = useState("");
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [telephone, setTelephone] = useState("");
    const [isValidTelephone, setIsValidTelephone] = useState(true);
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [isValidPasswordCfm, setIsVaidPasswordCfm] = useState(true);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [message, setMessage] = useState("");
    const fullNameRef = useRef(null);
    const [isLogin, setIsLogin] = useState(false);


    const onChangeFullname = (e) => {
        const inputName = e.target.value;
        setFullname(inputName);
        const isValid = inputName.length >= 6;
        setIsValidName(isValid);
    }
    const onChangeEmail = (e) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(inputEmail);
        setIsValidEmail(isValid);
    }
    const onChangeTelephone = (e) => {
        const inputTelephone = e.target.value;
        setTelephone(inputTelephone);
        const isValid = /^\d{10}$/.test(inputTelephone);
        setIsValidTelephone(isValid)
    }
    const onChangePassword = (e) => {
        const inputPassword = e.target.value;
        setPassword(inputPassword);
        checkPasswordMatch(inputPassword, passwordConfirm);
        const isValid = inputPassword.length >= 6;
        setIsValidPassword(isValid);
    }
    const onChangePasswordConfirm = (e) => {
        const inputPasswordCfm = e.target.value;
        setPasswordConfirm(inputPasswordCfm);
        checkPasswordMatch(password, inputPasswordCfm);
        const isValid = inputPasswordCfm.length >= 6;
        setIsVaidPasswordCfm(isValid);
    }

    const checkPasswordMatch = (password, confirm) => {
        setPasswordsMatch(password === confirm);
    }


    const handleRegister = async (e) => {
        e.preventDefault();

        if(passwordsMatch){
            try {
                const response = await AuthServices.register(fullname, email, telephone, address, password);
                if(response === 201){
                    setMessage("Register successfully!");
                    Swal.fire({
                        title: 'Register Successfully!',
                        text: 'Now you can Login with new Account!',
                        icon: 'success',
                        confirmButtonText: 'Login now!',
                        confirmButtonColor: '#5ba515'
                    });
                    navigate("/login");
                } else {setMessage(response)}
            } catch (error) {
                return error.message;
            }
        }
        else {
            setMessage("Password do not match!")
        }
    }

    const checkLogin = () => {
        if(user && user.userData){
            setIsLogin(true);
        }
    }
    if(isLogin){
        navigate("/")
    }

    useEffect(() => {
        fullNameRef.current.focus();
        checkLogin();
    }, [])
    return(
        <>
            <section className="login">
                <div className="login_box">
                    <div className="left">
                        <div className="top_link"><Link to="/"><i className="bi bi-arrow-left-circle"></i> Return home</Link></div>
                        <div className="contact">
                            <form onSubmit={handleRegister}>
                                <h3>SIGN UP</h3>
                                <input type="text"
                                       placeholder="Your Full name..."
                                       name="fullname"
                                       value={fullname}
                                       onChange={onChangeFullname}
                                       ref={fullNameRef}
                                />
                                {!isvalidName && <p style={{color: 'red'}}>Full name must be at least 6 characters!</p>}
                                <input type="email"
                                       placeholder="Email..."
                                       name="email"
                                       value={email}
                                       onChange={onChangeEmail}
                                />
                                {!isValidEmail && <p style={{ color: 'red' }}>Email is not valid!</p>}
                                <input type="text"
                                       placeholder="Telephone..."
                                       name="telephone"
                                       value={telephone}
                                       onChange={onChangeTelephone}
                                />
                                {!isValidTelephone && <p style={{color: 'red'}}>Telephone number must be 10 digits!</p>}
                                <input type="password"
                                       placeholder="Password..."
                                       name="password"
                                       value={password}
                                       onChange={onChangePassword}
                                />
                                {!isValidPassword && <p style={{color: 'red'}}>Password must be at least 6 characters!</p>}
                                <input type="password"
                                       placeholder="Re-enter password..."
                                       onChange={onChangePasswordConfirm}
                                />
                                {!isValidTelephone && <p style={{color: 'red'}}>Password must be at least 6 characters!</p>}
                                {message && (
                                    <div className="form-group">
                                        <div className="alert alert-danger" role="alert">
                                            {message}
                                        </div>
                                    </div>
                                )}
                                <button className="submit" type={'submit'}>LET'S GO</button>
                                <div className="signup-link">
                                    <h6 className="contact">Already have an Account? <Link to={'/login'}>Log in</Link></h6>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="right">

                    </div>
                </div>
            </section>
        </>
    )
}

export default SignUp;