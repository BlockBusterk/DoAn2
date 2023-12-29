import React, { useState } from 'react'
import "../styles/contact.css";
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import axios from "axios";
import toast from "react-hot-toast";
import sts from '../data/symtomp.js';
const SymtompChecker = () => {
    const [diagnosis, setDiagnosis] = useState("")
    const [formDetails, setFormDetails] = useState({
        symtomp: "",
        day_of_birth: "",
        gender:"male",
      });
    
      const inputChange = (e) => {
        const { name, value } = e.target;
        return setFormDetails({
          ...formDetails,
          [name]: value,
        });
      };

      const convertIdSymtomp = async (symtomps) =>{
            const idSymtomps =[] ;
          await symtomps.forEach(st1 =>{
            
            sts.forEach(st2=>{
              if(st2.Name.toUpperCase() == st1.toUpperCase())
              {
                idSymtomps.push(st2.ID)
                
              }
            })
           })
           console.log("symtomps" , symtomps)
          console.log("idSymtomps:  ", idSymtomps)
        return idSymtomps
      }

      const getYearFromDate =  (dateString) => {
        const date =  new Date(dateString);
        const year = date.getFullYear();
        return year;
      };

      const handleSymtomps = async (symtomp)=>{ 
          const symtomps = await symtomp.replace(/\s+/g, ' ').trim();
          const eachSymtomp = await symtomps.split(',');
          console.log("eachSymtomp",eachSymtomp)
          let trimSymtomps =  eachSymtomp.map(ele => ele.trim())
          console.log("trimSymtomp",trimSymtomps)
          const idSymtomps = await convertIdSymtomp(trimSymtomps)
          console.log("idSymtomp",idSymtomps)
          return idSymtomps
      }

      const handelDiagnosisData = async (data)=>{
               let message = ""
            if(data.length == 0)
            {
                message += "Sorry! Please tell us more about your symtomps"
                setDiagnosis(message)
            }
            else{
            await data.forEach(ele =>{
                message += `- Issue: ${ele.Issue.Name}(${ele.Issue.Accuracy}%)\n- Specialization\n`
                ele.Specialisation.forEach(solution => message+= `+ ${solution.Name}\n`)
            })
            setDiagnosis(message)
            }
      }
    const submitHandler = async (e) =>{
      try {
        e.preventDefault();
        const { symtomp, day_of_birth, gender} = formDetails;
        console.log(formDetails)
        const yearBirth =  getYearFromDate(day_of_birth)
        const idSymtomp = await handleSymtomps(symtomp)
        console.log(idSymtomp)
        idSymtomp.toString()
        const response = await axios.get(
          'https://healthservice.priaid.ch/diagnosis',
          {
            params:{
            token: process.env.REACT_SYMTOMP_CHECKER_KEY,
            symptoms :`[${idSymtomp}]`,
            gender: gender,
            year_of_birth: yearBirth,
            language: 'en-gb',
            format: 'json',
            }
          }
        );

       
        console.log(response.data)
        handelDiagnosisData(response.data)
      } catch (error) {
        console.error('Error fetching diagnosis from ApiMedic:', error);
        
      }
    }

  return (
    <>
    <Navbar />
    <section
      className="register-section symtomp-label"
      id="symtomp"
    >
      <div className="contact-container flex-center contact">
        <h2 className="form-heading">Symtomp Checker</h2>
        <form
          method="POST"
          className="register-form "
          onSubmit={submitHandler}
        >
          <input
            type="text"
            name="symtomp"
            className="form-input"
            placeholder="Enter your symtomps"
            value={formDetails.name}
            onChange={inputChange}
            required
          />
          <input
            type="date"
            name="day_of_birth"
            className="form-input"
            placeholder="Enter your email"
            value={formDetails.email}
            onChange={inputChange}
            required
          />
                <select
                  name='gender'
                  value={formDetails.gender}
                  onChange={inputChange}
                  className='text-textColor font-semibold text-[15px] leading-7 px-4 py-3 
                  focus:outline-none'>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                </select>
          <textarea
            type="text"
            name="diagnosis"
            className="form-input"
            placeholder="Your diagnosis will be displayed here"
            value={diagnosis}
            rows="8"
            readOnly
          ></textarea>

          <button
            type="submit"
            className="btn form-btn"
          >
            Diagnosis
          </button>
        </form>
      </div>
    </section>
    <Footer />
    </>
  )
}

export default SymtompChecker