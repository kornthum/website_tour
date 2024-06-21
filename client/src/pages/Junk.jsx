import { Button, Dialog, IconButton } from "@material-tailwind/react";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import useWindowSize from "../utils/functions";

export default function Junk() {
  const [tours, setTours] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default value for small screens
  const { currentUser } = useSelector((state) => state.user);
  const { width } = useWindowSize(); // Get the window width

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    if (width < 640) {
      setItemsPerPage(5); // Small screens
    } else if (width < 768) {
      setItemsPerPage(9); // Medium screens
    } else {
      setItemsPerPage(15); // Large screens
    }
  }, [width]);

  const fetchTours = async () => {
    try {
      const response = await fetch("/api/tour/get_in_junk", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTours(data);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(1);

  const totalPages = Math.ceil((tours?.length || 0) / itemsPerPage);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = tours?.slice(startIdx, endIdx) || [];

  const handleNextPageGroup = () => {
    setPageGroup((prevGroup) =>
      Math.min(prevGroup + 1, Math.ceil(totalPages / 10))
    );
    setCurrentPage((pageGroup + 1) * 10 - 9);
  };

  const handlePrevPageGroup = () => {
    setPageGroup((prevGroup) => Math.max(prevGroup - 1, 1));
    setCurrentPage((pageGroup - 1) * 10 - 9);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const startPage = (pageGroup - 1) * 10 + 1;
    const endPage = Math.min(startPage + 9, totalPages);
    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <IconButton
          key={i}
          onClick={() => handlePageClick(i)}
          className={`${
            currentPage === i ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          {i}
        </IconButton>
      );
    }

    return pages;
  };

  const handleClickDelete = async (id) => {
    try {
      const res = await fetch(`/api/tour/delete_tour/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: currentUser.role }),
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
    window.location.reload();
  };

  return (
    <div className="px-5 py-5 mt-4 mx-5 drop-shadow-md rounded-lg bg-red-200">
      <p className="flex flex-rows justify-between items-center">
        <p>
          <span className="text-2xl font-test text-gray-800">คุณอยู่ในพื้นที่ถังขยะ</span>
        </p>
      </p>

      <div className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-6 drop-shadow-sm`}>
        {currentItems.map((tour) => (
          <div
            key={tour.id}
            className="border-2 border-dotted border-opacity-30 rounded-md border-black p-5 "
          >
            {tour.image_url && (
              <div>
                <Link to={`/tour/${tour._id}`}>
                  <img
                    src={tour.image_url}
                    alt={`Tour ${tour.id}`}
                    className="w-full h-auto cursor-pointer"
                  />
                </Link>
              </div>
            )}
            <div className="mt-2 flex flex-rows justify-between">
              <div>
                <Link to={`/tour/${tour._id}`}>
                  <Button color="blue" className="font-test">
                    แก้ไข
                  </Button>
                </Link>
              </div>
              <div>
                <Button
                  color="red"
                  className="font-test"
                  onClick={() => handleClickDelete(tour._id)}
                >
                  ลบทิ้ง
                </Button>
              </div>
            </div>
            <div>
            ลบโดยอัตโนมัติ: {tour.delete_at}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap justify-center">
        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={handlePrevPageGroup}
          disabled={pageGroup === 1}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          {renderPagination()}
        </div>
        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={handleNextPageGroup}
          disabled={pageGroup === Math.ceil(totalPages / 10)}
        >
          Next <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}