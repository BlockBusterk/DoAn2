import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "./Empty";
import fetchData from "../helper/apiCall";
import ReactPaginate from 'react-paginate';
import "../styles/user.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const [itemOffset, setItemOffset] = useState(0);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + 7;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = doctors.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(doctors.length / 7);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * 7) % doctors.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  const getAllDoctors = async (e) => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/doctor/getalldoctors`);
      setDoctors(temp);
      dispatch(setLoading(false));
    } catch (error) {}
  };

  const deleteUser = async (userId) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (confirm) {
        await toast.promise(
          axios.put(
            "/doctor/deletedoctor",
            { userId },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
          {
            success: "Doctor deleted successfully",
            error: "Unable to delete Doctor",
            loading: "Deleting Doctor...",
          }
        );
        getAllDoctors();
      }
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="user-section">
          <h3 className="home-sub-heading">All Doctors</h3>
          {doctors.length > 0 ? (
            <div className="user-container">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Pic</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Mobile No.</th>
                    <th>Experience</th>
                    <th>Specialization</th>
                    <th>Fees</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.map((ele, i) => {
                    return (
                      <tr key={ele?._id}>
                        <td>{i + 1}</td>
                        <td>
                          <img
                            className="user-table-pic"
                            src={ele?.userId?.pic}
                            alt=""
                          />
                        </td>
                        <td>{ele?.userId?.firstname}</td>
                        <td>{ele?.userId?.lastname}</td>
                        <td>{ele?.userId?.email}</td>
                        <td>{ele?.userId?.mobile}</td>
                        <td>{ele?.experience}</td>
                        <td>{ele?.specialization}</td>
                        <td>{ele?.fees}</td>
                        <td className="select">
                          <button
                            className="btn user-btn"
                            onClick={() => {
                              deleteUser(ele?.userId?._id);
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}

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
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </section>
      )}
    </>
  );
};

export default AdminDoctors;
