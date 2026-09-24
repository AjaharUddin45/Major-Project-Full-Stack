
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {useAuth} from "../context/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { setCurrUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     const response =  await axios.post("/login", formData);

      setCurrUser(response.data.user);
      toast.success("Login successful!");
      navigate("/listings");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Invalid username or password"
      );
    }
  };

  return (
    <div className="row mt-3">
      <h1 className="col-6 offset-3">Login</h1>

      <div className="col-6 offset-3">
        <form
          onSubmit={handleSubmit}
          className="needs-validation"
          noValidate
        >
          
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <b>Email</b>
            </label>

            <input
              name="email"
              id="email"
              type="text"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              <b>Password</b>
            </label>

            <input
              name="password"
              id="password"
              type="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

