import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import APIRoutes from "../utilities/routes";

function Registration(props) {
  const [registrationData, setRegistrationData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (event) => {
    setRegistrationData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  function handleSubmit(event) {
    const { email, password, password_confirmation } = registrationData;
    axios
      .post(
        APIRoutes.url + "/registrations",
        {
          user: {
            email: email,
            password: password,
            password_confirmation: password_confirmation,
          },
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.status === "created") {
          props.handleSuccessfulAuth(response.data);
        } else {
          console.log("Registration not successful!");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    event.preventDefault();
  }

  return (
    <section className="py-4 d-flex justify-content-center text-white">
      <div className="rounded container row col-lg-5 shadow d-flex justify-content-center text-center py-5">
        <h1 className="fw-bold">task_management</h1>
        <h3 className="fw-bolder mb-4">Register now!</h3>
        <form
          onSubmit={handleSubmit}
          className="row col-lg-10 justify-content-center"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-control py-3 my-2"
            value={registrationData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control py-3 my-2"
            value={registrationData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password_confirmation"
            placeholder="Password Confirmation"
            className="form-control py-3 my-2"
            value={registrationData.password_confirmation}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="btn btn-success btn-block login-button col-lg-8 py-2 my-3 fw-bold fs-5"
          >
            Sign Up
          </button>
        </form>
        <p>
          Already on task_management?{" "}
          <Link to="/login" className="link">
            Log in here
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Registration;
