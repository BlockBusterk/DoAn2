import React, { useState, useEffect } from "react";
import "../styles/contact.css";
import jwt_decode from "jwt-decode";
import fetchData from "../helper/apiCall";

const Contact = () => {
  const [formDetails, setFormDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    message: "",
  });

  

  useEffect(() => {
    if(localStorage.getItem("token"))
    {

    const getUser = async () => {
      try {
        const { userId } = jwt_decode(localStorage.getItem("token"));
        
        const temp = await fetchData(`/user/getuser/${userId}`);
        setFormDetails({
          ...temp,
          
        });
        
      
      } catch (error) {

      }
    };
 
    getUser();
  }}, []);

 

  const inputChange = (e) => {
    const { name, value } = e.target;
    return setFormDetails({
      ...formDetails,
      [name]: value,
    });
  };

  return (
    <section
      className="register-section flex-center"
      id="contact"
    >
      <div className="contact-container flex-center contact">
        <h2 className="form-heading">Contact Us</h2>
        <form
          method="POST"
          action={`https://formspree.io/f/xoqgankw`}
        
          className="register-form "
        >
          <input
            type="text"
            name="name"
            className="form-input"
            placeholder="Enter your name"
            value={`${formDetails.firstname} ${formDetails.lastname}`}
            onChange={inputChange}
            readOnly
           
          />
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="You need to login to contact"
            value={formDetails.email}
            onChange={inputChange}
            readOnly
          />
          <textarea
            type="text"
            name="message"
            className="form-input"
            placeholder="Enter your message"
            value={formDetails.message}
            onChange={inputChange}
            rows="8"
            cols="12"
            required
          ></textarea>

          <button
            type="submit"
            className="btn form-btn"
            disabled={!formDetails.email}
          >
            send
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
