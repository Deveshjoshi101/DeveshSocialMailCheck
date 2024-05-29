import { Link } from "react-router-dom";
import axios from "axios";
import "./register.scss";
import { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    try {
      // Check if all required fields are filled
      if (!username || !name || !email || !password) {
        alert("Please fill in all fields");
        return;
      }
      const response = await axios.post("http://localhost:5000/request-otp", { username, name, email, password });
      alert("OTP sent to your email!");
      setOtpRequested(true);
    } catch (error) {
      console.error("Error requesting OTP:", error);
      alert("Error requesting OTP");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log("otp",otp);
      // Check if all required fields are filled
      if (!username || !name || !email || !password || !otp) {
        alert("Please fill in all fields");
        return;
      }
      const response = await axios.post("http://localhost:5000/send-email", { username, name, email, password, otp });
      alert("Registration successful, email sent!");
      console.log('Response:', response.data);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email");
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Devesh Social.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni
            voluptates, voluptas, voluptate, voluptatem voluptatum voluptate
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni
          </p>
          <span>Yogesh, Do you have an account?</span>
          <Link to="/login">
            <button>Log In</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          {otpRequested ? (
            <form onSubmit={handleRegister}>
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <input type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
              <button type="submit">Register</button>
            </form>
          ) : (
            <form onSubmit={handleRequestOTP}>
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit">Request OTP</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
