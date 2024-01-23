import { Button, Dialog, IconButton } from "@material-tailwind/react";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";



export default function Edit() {
  const { n_new_tour } = useSelector((state) => state.tour);
  const [tours, setTours] = useState([]);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await fetch("/api/tour/get_new_tour", {
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

  const itemsPerRow = {
    sm: 1, // Small screens (1 col with 1 image)
    md: 2, // Medium screens (2 cols with 2 images)
    lg: 3, // Large screens (3 cols with 3 images)
  };

  const itemsPerPage = {
    sm: itemsPerRow.sm, // Show 1 row on small screens
    md: itemsPerRow.md * 2, // Show 2 rows on medium screens
    lg: itemsPerRow.lg * 2, // Show 2 rows on large screens
  };

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((tours?.length || 0) / itemsPerPage.lg);

  const startIdx = (currentPage - 1) * itemsPerPage.lg;
  const endIdx = startIdx + itemsPerPage.lg;

  const currentItems = tours?.slice(startIdx, endIdx) || [];

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleClickDelete = async (id) => {
    try {
      const res = await fetch(`/api/tour/delete_tour/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
    window.location.reload();
  };

  const getItemProps = (index) => ({
    variant: currentPage === index ? "filled" : "text",
    color: "gray",
    onClick: () => setCurrentPage(index),
  });

  return (
    <div className="px-5 py-5 mt-4 mx-5 drop-shadow-md rounded-lg bg-white">
      <p className="flex flex-rows justify-between items-center">
        <p>
          <span className="text-2xl font-test">มีรูปภาพเหลือค้างจำนวน:</span>
          <span className="text-2xl font-test font-bold text-red-600">
            {" "}
            {n_new_tour}
          </span>
        </p>
        <Button
          variant="gradient"
          className="flex items-center gap-3 font-test"
          disabled
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
          Upload Image
        </Button>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 drop-shadow-sm ">
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
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
        </Button>
        <div className="flex items-center gap-2">
          {[...Array(totalPages).keys()].map((index) => (
            <IconButton key={index + 1} {...getItemProps(index + 1)}>
              {index + 1}
            </IconButton>
          ))}
        </div>
        <Button
          variant="text"
          className="flex items-center gap-2"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
