import React, { useEffect, useState, useMemo } from "react";
import DoctorCard from "../components/DoctorCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/doctors.css";
import fetchData from "../helper/apiCall";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/reducers/rootSlice";
import ReactPaginate from 'react-paginate';
import Empty from "../components/Empty";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorsFIlter, setDoctorsFilter] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const [filter, setFilter] = useState("All")

  const handleFilterChange =  (event) => {
    console.log("event: ",event.target.value)
    setFilter(event.target.value);
   
    
  };

  const [itemOffset, setItemOffset] = useState(0);

  
  const endOffset = itemOffset + 6;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = doctorsFIlter.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(doctorsFIlter.length / 6);


  const handlePageClick = (event) => {
    const newOffset = (event.selected * 6) % doctorsFIlter.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };


  useEffect(() => {
    
    const fetchAllDocs = async () => {
      dispatch(setLoading(true));
      const data = await fetchData(`/doctor/getalldoctors`);
      setDoctors(data);
      setDoctorsFilter(data)
      dispatch(setLoading(false));
    };
    fetchAllDocs();
  }, []);

  // useEffect(()=>{
  //        console.log("filter: ",filter)
  //       if(filter !== "All")
  //       {
  //         setDoctorsFilter(doctors.filter(ele => ele.specialization === filter))
  //       }
  //       else
  //       {
  //         setDoctorsFilter(doctors)
  //       }
  // },[filter])

  const doctorsFilter = useMemo(() => {
    if (filter !== "All") {
      return doctors.filter((ele) => ele.specialization === filter);
    } else {
      return doctors;
    }
  }, [filter, doctors]);

  useEffect(() => {
    setDoctorsFilter(doctorsFilter);
  }, [doctorsFilter]);
  

  return (
    <>
      <Navbar />
      {loading && <Loading />}
      {!loading && (
        <section className="container doctors">
          <h2 className="page-heading">Our Doctors</h2>

          <select
                value={filter}
                onChange={handleFilterChange}
                >
                  <option value="All">All</option>
                  <option value="General practice">General practice</option>
                  <option value="Internal medicine">Internal medicine</option>
                  <option value="Gastroenterology">Gastroenterology</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Rheumatology">Rheumatology</option>
                </select>
          {currentItems.length > 0 ? (
            <div className="doctors-card-container">
              {currentItems.map((ele) => {
                return (
                  <DoctorCard
                    ele={ele}
                    key={ele._id}
                  />
                );
              })}
            </div>
          ) : (
            <Empty />
          )}
           <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                    containerClassName="pagination"
                    pageLinkClassName="page-num"
                    previousLinkClassName="page-num"
                    nextLinkClassName="page-num"
                    activeClassName="active"
                  />
        </section>
      )}
      <Footer />
    </>
  );
};

export default Doctors;
