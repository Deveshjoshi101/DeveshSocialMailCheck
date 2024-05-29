import { Link } from "react-router-dom";
import "./login.scss";

const Login = () => {
  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Devesh Social.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni
            voluptates, voluptas, voluptate, voluptatem voluptatum voluptate
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni
          </p>
          <span>Yogesh, Don't you have an account yet?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button>Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
