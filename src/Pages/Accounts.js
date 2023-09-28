import React, { useState } from 'react';
import "./Accounts.css"
import { registerUser, signInUser } from '../api';
import ReCAPTCHA from "react-google-recaptcha";

export default function Accounts ()
{
    const [recaptchaResponse, setRecaptchaResponse] = useState(null); 
    const [regName, setRegName] = useState('');
    const [regPwd, setRegPwd] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState('');

    const handleRecaptchaChange = (value) => {
      setRecaptchaResponse(value);
    };

    const sendReg = async () => {
        const data = {
            name: regName,
            email: email,
            password: regPwd,
            recaptchaResponse: recaptchaResponse,
        };
        console.log(data);
        try {
          const response = await registerUser(data);
          setSuccess(`You registered as ${email}!`);
          console.log(response);
        } catch (error) {
          setSuccess(`Registration failed.`);
          console.error('Error:', error);
        }
      };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        sendReg();
    };

    const sendSignIn = async () => {
        const data = {
            name: username,
            password: password,
        };
        console.log(data);
        try {
          const response = await signInUser(data);
          localStorage.clear();
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('name', username);
          window.location.reload();
          setSuccess(`You logged in as ${username}!`);
          console.log(response);
        } catch (error) {
          setSuccess("Log in Failed!");
          console.error('Error:', error);
        }
      };
    
    const handleSignInSubmit = (e) => {
        e.preventDefault();
        sendSignIn();
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
            <div>
                <label>
                Username:
                <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} required />
                </label>
            </div>
            <div>
                <label>
                Password:
                <input type="password" value={regPwd} onChange={(e) => setRegPwd(e.target.value)} required />
                </label>
            </div>
            <div>
                <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
            </div>
            <ReCAPTCHA
              sitekey="6LcsrCooAAAAAMvooNiG1nEc3cEtCeteeBuh-ae7"
              onChange={handleRecaptchaChange}
            />
            <button type="submit">Register</button>
            </form>
            <br></br>
            <form onSubmit={handleSignInSubmit}>
            <div>
                <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </label>
            </div>
            <div>
                <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
            </div>
            <button type="submit">Sign In</button>
            </form>
            {success && <p className="success-message">{success}</p>} {/* Conditionally render the success message */}
            <br></br>
            <button onClick={ (e) => {
              localStorage.clear();
              window.location.reload();
            }
            }>Log out</button>
        </div>
       );
}

              

