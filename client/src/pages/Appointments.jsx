import React, { useEffect, useState } from "react";
import Empty from "../components/Empty";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import fetchData from "../helper/apiCall";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/user.css";
import ReactPaginate from 'react-paginate';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);
  const { userId } = jwt_decode(localStorage.getItem("token"));

  const [itemOffset, setItemOffset] = useState(0);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + 7;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = appointments.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(appointments.length / 7);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * 7) % appointments.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  const getAllAppoint = async (e) => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(
        `/appointment/getallappointments?search=${userId}`
      );
      setAppointments(temp);
      dispatch(setLoading(false));
    } catch (error) {}
  };

  useEffect(() => {
    getAllAppoint();
  }, []);

  const complete = async (ele) => {
    try {
      await toast.promise(
        axios.put(
          "/appointment/completed",
          {
            appointid: ele?._id,
            doctorId: ele?.userId?._id,
            doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment booked successfully",
          error: "Unable to book appointment",
          loading: "Booking appointment...",
        }
      );

      getAllAppoint();
    } catch (error) {
      return error;
    }
  };

  const reject = async (ele) => {
    try {
      await toast.promise(
        axios.put(
          "/appointment/rejected",
          {
            appointid: ele?._id,
            doctorId: ele?.userId?._id,
            doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment rejected successfully",
          error: "Unable to reject appointment",
          loading: "Rejecting appointment...",
        }
      );

      getAllAppoint();
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <section className="container notif-section">
          <h2 className="page-heading">Your Appointments</h2>

          {currentItems.length > 0 ? (
            <div className="appointments">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Doctor</th>
                    <th>Patient</th>
                    <th>Appointment Date</th>
                    <th>Appointment Time</th>
                    <th>Booking Date</th>
                    <th>Booking Time</th>
                    <th>Status</th>
                    {userId === currentItems[0].doctorId?._id ? (
                      <>
                      <th>Action</th>
                      <th>Action</th>
                      </>
                    ) : (
                      <></>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentItems?.map((ele, i) => {
                    return (
                      <tr key={ele?._id}>
                        <td>{i + 1}</td>
                        <td>
                          {ele?.doctorId?.firstname +
                            " " +
                            ele?.doctorId?.lastname}
                        </td>
                        <td>
                          {ele?.userId?.firstname + " " + ele?.userId?.lastname}
                        </td>
                        <td>{ele?.date}</td>
                        <td>{ele?.time}</td>
                        <td>{ele?.createdAt.split("T")[0]}</td>
                        <td>{ele?.updatedAt.split("T")[1].split(".")[0]}</td>
                        <td>{ele?.status}</td>
                        {userId === ele?.doctorId?._id ? (
                          <>
                          <td>
                            <button
                              className={`btn user-btn accept-btn ${
                                (ele?.status === "Completed" || ele?.status === "Rejected") ? "disable-btn" : ""
                              }`}
                              disabled={(ele?.status === "Completed" || ele?.status === "Rejected")}
                              onClick={() => complete(ele)}
                            >
                              Complete
                            </button>
                          </td>
                          <td>
                          <button
                            className={`btn user-btn ${
                              (ele?.status === "Completed" || ele?.status === "Rejected") ? "disable-btn" : ""
                            }`}
                            disabled={(ele?.status === "Completed" || ele?.status === "Rejected")}
                            onClick={() => reject(ele)}
                          >
                            Reject
                          </button>
                        </td>
                        </>
                        ) : (
                          <></>
                        )}
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
      <Footer />
    </>
  );
};
export default Appointments;
