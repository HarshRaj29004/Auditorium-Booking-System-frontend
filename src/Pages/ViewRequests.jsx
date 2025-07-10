import { React, useEffect, useState, useMemo } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from '@tanstack/react-table';
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../Components/Footer";
import Spinner from "../Components/Spinner";
import Popup from "../Components/Popup";
import { FaArrowRight } from "react-icons/fa";
import { Role, RequestStatus, RequestType, userInfo } from '../constants';

export default function ViewRequests() {
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const [updatestatusid, setUpdatestatusid] = useState("");
  const [activeButton, setActiveButton] = useState(RequestStatus.PENDING);
  const [loading, setloading] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // console.log(userRole);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const fetchData = async () => {
    setloading(true);
    setActiveButton(RequestStatus.PENDING);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND}/ticket/fetchTicket?status=${RequestStatus.PENDING}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      // console.log(tickets);
      if (response) {
        setTickets(response.data);
      }
      else {
        setTickets([])
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setloading(false);
  };

  const handleBookedClick = async () => {
    setloading(true);
    setActiveButton(RequestStatus.BOOKED);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND}/ticket/fetchTicket?status=${RequestStatus.BOOKED}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      // console.log(response.data);

      if (response) {
        setTickets(response.data);
      }
      else {
        setTickets([])
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setloading(false);
  };

  const handlePendingClick = async () => {
    setloading(true);
    setActiveButton(RequestStatus.PENDING);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND}/ticket/fetchTicket?status=${RequestStatus.PENDING}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      // console.log(response.data);
      // console.log(response);
      if (response) {
        setTickets(response.data);
      }
      else {
        setTickets([])
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setloading(false);
  };

  const handleDeclinedClick = async () => {
    setloading(true);
    setActiveButton(RequestStatus.DECLINED);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND}/ticket/fetchTicket?status=${RequestStatus.DECLINED}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      // console.log(response.data);
      if (response) {
        setTickets(response.data);
      }
      else {
        setTickets([])
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setloading(false);
  };


  const handleClick = async (tokenID, tokenStatus) => {
    try {
      if (!userInfo.TOKEN) {
        toast.error("Please login to continue!");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND}/ticket/updateticket/${tokenID}?new_status=${tokenStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response) {
        if (tokenStatus === RequestStatus.BOOKED) {
          toast.success("Booking Request Accepted successfully!");
        }
        else if (tokenStatus === RequestStatus.DECLINED) {
          toast.error("Booking Request Declined!");
        }
        else if (tokenStatus === RequestStatus.PENDING) {
          toast.success("Booking Request forwarded!");
        } else {
          toast.error(tokenStatus);
        }
      }
      await fetchData();
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  function reverseDateFormat(dateString) {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  }

  const columns = useMemo(() => [
    {
      id: "id",
      header: "S.No.",
      cell: ({ row }) => <div>{row.index + 1}</div>
    },
    {
      id: "clubname",
      header: "Club Name",
      accessorKey: "clubname"
    },
    {
      id: "startTime",
      header: "Start Time",
      accessorKey: "startTime"
    },
    {
      id: "endTime",
      header: "End Time",
      accessorKey: "endTime"
    },
    {
      id: "date",
      header: "Date",
      accessorKey: "date",
      cell: ({ cell }) => {
        const rawDate = cell.getValue();
        if (!rawDate) return "—";

        const date = new Date(rawDate);
        // console.log(date+" "+rawDate+" "+cell);
        return isNaN(date) ? "Invalid Date" : reverseDateFormat(date.toISOString().slice(0, 10));
        // return cell
      }
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "username"
    },
    {
      id: "details",
      header: "Details",
      cell: ({ row }) => (
        <div
          className="flex underline cursor-pointer justify-center bg-blue-500 hover:bg-blue-700 text-white py-1 px-1 rounded"
          onClick={() => {
            setSelectedRowData(row.original);
            openPopup();
          }}
        >
          See more
        </div>
      )
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <div className="flex relative gap-4">
          {userInfo.ROLE === Role.SUPERADMIN && row.original.status === RequestStatus.PENDING && (
            <>
              <button onClick={() => handleClick(row.original._id, RequestStatus.BOOKED)}>
                <FaCheckCircle className="text-green-500 text-2xl" />
              </button>
              <button onClick={() => handleClick(row.original._id, RequestStatus.DECLINED)}>
                <FaTimesCircle className="text-red-500 text-2xl" />
              </button>
            </>
          )}
          {userInfo.ROLE === Role.SUBADMIN && row.original.status === RequestStatus.PENDING && (
            <>
              <button onClick={() => handleClick(row.original._id, RequestStatus.BOOKED)}>
                <FaCheckCircle className="text-green-500 text-2xl" />
              </button>
              <button onClick={() => handleClick(row.original._id, RequestStatus.DECLINED)}>
                <FaTimesCircle className="text-red-500 text-2xl" />
              </button>
              <button onClick={() => handleClick(row.original._id, RequestStatus.FORWARD)}>
                <FaArrowRight className="text-blue-500 text-2xl" />
              </button>
            </>
          )}
          <div>{row.original.status}</div>
        </div>
      )
    }
  ], [updatestatusid, userInfo.ROLE]);



  const table = useReactTable({
    data: tickets,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });


  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset body scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPopupOpen]);

  return (
    <>
      <div>
        {isPopupOpen && (
          <>
            {/* Add an overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={closePopup}
            />
            {/* Position the popup in center */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <Popup data={selectedRowData} onClose={closePopup} />
            </div>
          </>
        )}
        <Toaster />
      </div>
      <div className="mx-8 flex gap-[10px]">
        <button
          onClick={handleBookedClick}
          className={`rounded-md p-2 shadow-md hover:bg-gray-400 ${activeButton === RequestStatus.BOOKED ? "bg-slate-800 text-white" : "bg-gray-200"
            }`}
        >
          Booked
        </button>
        <button
          onClick={handlePendingClick}
          className={`rounded-md p-2 shadow-md hover:bg-gray-400 ${activeButton === RequestStatus.PENDING
            ? "bg-slate-800 text-white"
            : "bg-gray-200"
            }`}
        >
          Pending
        </button>
        <button
          onClick={handleDeclinedClick}
          className={`rounded-md p-2 shadow-md hover:bg-gray-400 ${activeButton === RequestStatus.DECLINED
            ? "bg-slate-800 text-white"
            : "bg-gray-200"
            }`}
        >
          Declined
        </button>
      </div>
      <div className="min-h-[80vh] mt-[20px] mx-8 overflow-x-auto flex justify-center items-start">
        <Spinner show={loading} />
        <table className="w-[1500px] divide-y divide-gray-200 bg-white shadow-md">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="py-3 px-6 text-left font-semibold text-gray-700"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {!loading && (
            <tbody>
              {!loading && table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={table.getAllColumns().length} className="text-center py-6 text-gray-500">
                    No Request Available
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="transition-colors hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="py-3 px-3 text-gray-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>

          )}
        </table>
      </div>

      <div className="">
        <Footer />
      </div>
    </>
  );
}