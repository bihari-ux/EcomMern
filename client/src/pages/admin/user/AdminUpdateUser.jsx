import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import HeroSection from "../../../Components/HeroSection";
import AdminSidebar from "../../../Components/AdminSidebar";
import formValidator from "../../../FormValidators/formValidator";

export default function AdminUpdateUser() {
  let { id } = useParams();  // Fixing parameter naming
  let navigate = useNavigate();
  
  let [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    role: "Admin",
    active: true,
  });

  let [error, setError] = useState({});
  let [show, setShow] = useState(false);

  function getInputData(e) {
    let { name, value } = e.target;
    
    if (name !== "active") {
      setError((prev) => ({
        ...prev,
        [name]: formValidator(e),
      }));
    }

    setData((prev) => ({
      ...prev,
      [name]: name === "active" ? value === "1" : value,
    }));
  }

  async function postData(e) {
    e.preventDefault();
    let hasError = Object.values(error).some((err) => err);
    
    if (hasError) {
      setShow(true);
      return;
    }

    try {
      let response = await fetch(
        `${process.env.REACT_APP_BACKEND_SERVER}/api/user/${id}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(data),
        }
      );

      let result = await response.json();
      if (result.result === "Done") {
        navigate("/admin/user");
      } else {
        setShow(true);
        setError((prev) => ({
          ...prev,
          username: result.reason?.username || "",
          email: result.reason?.email || "",
        }));
      }
    } catch (error) {
      console.error("Update Error:", error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        let response = await fetch(
          `${process.env.REACT_APP_BACKEND_SERVER}/api/user/${id}`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              authorization: localStorage.getItem("token"),
            },
          }
        );

        let result = await response.json();
        if (result.data) {
          setData(result.data);
        } else {
          console.error("Error fetching user data:", result);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchData();
  }, [id]);

  return (
    <>
      <HeroSection title="Admin - Update User" />
      <div className="container-fluid py-5 mb-5">
        <div className="row">
          <div className="col-md-3">
            <AdminSidebar />
          </div>
          <div className="col-md-9">
            <h5 className="bg-primary text-light text-center p-2">
              User{" "}
              <Link to="/admin/user">
                <i className="fa fa-arrow-left text-light float-end"></i>
              </Link>
            </h5>
            <form onSubmit={postData}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={data.name}
                    onChange={getInputData}
                    placeholder="Full Name"
                    className={`form-control border-3 ${
                      show && error.name ? "border-danger" : "border-primary"
                    }`}
                  />
                  {show && error.name && <p className="text-danger">{error.name}</p>}
                </div>
                <div className="col-md-6 mb-3">
                  <label>Phone*</label>
                  <input
                    type="text"
                    name="phone"
                    value={data.phone}
                    onChange={getInputData}
                    placeholder="Phone Number"
                    className={`form-control border-3 ${
                      show && error.phone ? "border-danger" : "border-primary"
                    }`}
                  />
                  {show && error.phone && <p className="text-danger">{error.phone}</p>}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Username*</label>
                  <input
                    type="text"
                    name="username"
                    value={data.username}
                    onChange={getInputData}
                    placeholder="Username"
                    className={`form-control border-3 ${
                      show && error.username ? "border-danger" : "border-primary"
                    }`}
                  />
                  {show && error.username && (
                    <p className="text-danger">{error.username}</p>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label>Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={getInputData}
                    placeholder="Email Address"
                    className={`form-control border-3 ${
                      show && error.email ? "border-danger" : "border-primary"
                    }`}
                  />
                  {show && error.email && <p className="text-danger">{error.email}</p>}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Role</label>
                  <select
                    name="role"
                    onChange={getInputData}
                    value={data.role}
                    className="form-select border-3 border-primary"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label>Active</label>
                  <select
                    name="active"
                    onChange={getInputData}
                    value={data.active ? "1" : "0"}
                    className="form-select border-3 border-primary"
                  >
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <button type="submit" className="btn btn-primary w-100">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
