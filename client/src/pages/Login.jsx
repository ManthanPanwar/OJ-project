    import React, { useState } from "react";
    import { Link, useNavigate } from "react-router-dom";
    import { ToastContainer } from "react-toastify";
    import { handleError, handleSuccess } from "../utils/toastMessage";
    import axios from "axios";

    const Login = () => {
        const [loginInfo, setLoginInfo] = useState({  email: "", password: "" });

        const navigate = useNavigate();
        const handleChange = (e) =>{
            const {name, value} = e.target;
            console.log(name, value);
            const copyLoginInfo = {...loginInfo};
            copyLoginInfo[name] = value;
            setLoginInfo(copyLoginInfo); 
        } 

        const handleSubmit = async (e) => {
            e.preventDefault();
            const { email, password } = loginInfo;
            if(!(email && password)){
                return handleError("all fields are required");
            }
            try {
                const url = "http://localhost:5000/login";
                const res = await axios.post(url, loginInfo, {withCredentials: true});

                const {success, message, name, error} = res.data;

                if(success){
                    handleSuccess(message);
                    localStorage.setItem("loggedInUser", name);
                    setTimeout(() => {
                        navigate("/home");
                    },1000);
                }else if(error){
                    const details = error.details[0].message;
                    handleError(details);
                } else if(!success){
                    handleError(message);
                }
            } catch (error) { 
                handleError(error);
            }
        }
    return (
        <div className="min-h-screen flex items-center justify-center bg-red-100 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>

            <form onSubmit={handleSubmit} className="space-y-4">

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
                </label>
                <input
                onChange={handleChange}
                type="email"
                id="email"
                name="email"
                //   required
                placeholder="Enter your email"
                value={loginInfo.email}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
                </label>
                <input
                onChange={handleChange}
                type="password"
                id="password"
                name="password"
                //   required
                placeholder="Enter your password"
                value={loginInfo.password}
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
                Login
            </button>

            <p className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-500 hover:underline">
                Sign Up
                </Link>
            </p>
            </form>

            <ToastContainer autoClose={2000} />
        </div>
        </div>
    );
    };

    export default Login;
