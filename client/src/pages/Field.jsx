import { Button, Dialog, IconButton } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../utils/functions"; // Adjust the import path as necessary

export default function Junk() {
  const [tours, setTours] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default value for small screens
  const { currentUser } = useSelector((state) => state.user);
  const { width } = useWindowSize(); // Get the window width
  const isAdmin = currentUser.role === "admin";
  const navigate = useNavigate();
  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    if (width < 640) {
      setItemsPerPage(10); // Small screens
    } else if (width < 768) {
      setItemsPerPage(10); // Medium screens
    } else {
      setItemsPerPage(15); // Large screens
    }
  }, [width]);

  const fetchTours = async () => {
    try {
      const response = await fetch("/api/tour/get_validated_tour", {
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
            currentPage === i ? "bg-blue-200 text-black" : "bg-black text-white"
          }`}
        >
          {i}
        </IconButton>
      );
    }

    return pages;
  };

  const handleCopyToClipboard = (tour) => {
    const textToCopy = `${tour._id}`;
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };

  return (
    <div className="px-5 py-5 mt-4 mx-5 drop-shadow-md rounded-lg bg-green-100">
      <p className="flex flex-rows justify-between items-center">
        <p>
          <span className="text-2xl font-test text-gray-800">พื้นที่ค้นหา</span>
        </p>
      </p>

      <div
        className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 drop-shadow-sm`}
      >
        {currentItems.map((tour) => (
          <div
            key={tour.id}
            className="border-2 border-dotted border-opacity-30 rounded-md border-black p-3"
          >
            {tour.image_url && (
              <div className="flex flex-col justify-center items-center gap-2">

                <img
                    src={tour.image_url}
                    alt={`Tour ${tour.id}`}
                    className="w-auto h-auto cursor-pointer"
                    onClick =  {isAdmin ? () => navigate(`/tour/${tour._id}`, { state: { tour } }) : null}
                />
                <div className="flex flex-rows justify-center items-center gap-2 mx-2">
                  <p className="font-test text-white bg-green-800 rounded-l text-xl">{tour._id}</p>
                  <IconButton
                    onClick={() => handleCopyToClipboard(tour)}
                    className="bg-blue-800"
                  >
                    <ClipboardIcon className="h-5 w-5" />
                  </IconButton>
                </div>
              </div>
            )}
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
