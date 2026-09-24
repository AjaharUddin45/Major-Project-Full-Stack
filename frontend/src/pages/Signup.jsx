import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
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
      const response = await axios.post("/signup", formData);

      toast.success("Account created successfully!");

      navigate("/login");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Signup failed"
      );
    }
  };

  return (
    <div className="row mt-3">
      <h1 className="col-6 offset-3">SignUp on Wanderlust</h1>

      <div className="col-6 offset-3">
        <form
          onSubmit={handleSubmit}
          className="needs-validation"
          noValidate
        >
          {/* Username */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              <b>Username</b>
            </label>

            <input
              name="username"
              id="username"
              type="text"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <div className="valid-feedback">
              Looks good!
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              <b>Email</b>
            </label>

            <input
              name="email"
              id="email"
              type="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
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

          <button type="submit" className="btn btn-outline-dark">
            SignUp
          </button>
        </form>
      </div>
    </div>
  );
}

