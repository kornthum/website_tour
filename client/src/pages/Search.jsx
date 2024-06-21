import {
  Box,
  Checkbox,
  ListItem,
  ListItemButton,
  Button,
  IconButton,
  Chip,
} from "@mui/material";
import countryMapper from "../utils/country_mapper.json";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import {  IconButton as Icon } from "@material-tailwind/react";
export default function Search() {
  const navigate = useNavigate();

  const [selectedZone, setSelectedZone] = useState("");
  console.log(selectedZone);
  const [checkedSubZone, setCheckedSubZone] = useState([]);
  console.log(checkedSubZone);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { group_mapper } = useSelector((state) => state.tour);

  const { currentUser } = useSelector((state) => state.user);
  const currentUserRole = currentUser.role;
  const isAdmin = currentUserRole === "admin";

  const handleListItemClickZone = (event, index) => {
    setSelectedZone(index);
    setCheckedSubZone([]);
  };

  const handleToggleSubZone = (country) => (event) => {
    const currentIndex = checkedSubZone.indexOf(country);
    const newChecked = [...checkedSubZone];

    if (currentIndex === -1) {
      newChecked.push(country);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedSubZone(newChecked);
  };

  const handleMonthChange = ([newStartDate, newEndDate]) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const disablePastMonths = (date) => {
    const currentDate = new Date();
    return (
      date >= new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    );
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
  const handleSearchButton = async () => {
    try {
      const encodedZone = encodeURIComponent(selectedZone);
      const encodedCountries = checkedSubZone.map(encodeURIComponent).join(",");
      const encodedTourMonth = encodeURIComponent(
        getIncludedMonths(startDate, endDate).join(",")
      );

      const response = await fetch(
        `/api/tour/search_tour/?continent=${encodedZone}&country=${encodedCountries}&tour_month=${encodedTourMonth}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data)
      setSearchResults(data.data);
    } catch (error) {
      console.error("Error searching tours:", error);
      // Handle error, show error message, etc.
    }
  };

  const handleClearButton = (event) => {
    setStartDate(null);
    setEndDate(null);
    setSelectedZone("");
    setCheckedSubZone([]);
    event.preventDefault();
  };

  function getIncludedMonths(startDate, endDate) {
    const thaiOptions = { month: "long", year: "numeric", locale: "th-TH" };

    if (!startDate && !endDate) {
      return [];
    }

    const startMonth = startDate.toLocaleString("th-TH", thaiOptions);

    if (!endDate) {
      return [startMonth];
    }

    const includedMonths = [];
    let currentMonth = new Date(startDate);

    while (currentMonth <= endDate) {
      includedMonths.push(currentMonth.toLocaleString("th-TH", thaiOptions));
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    return includedMonths;
  }

  const itemsPerPage = 6;
  const totalPages = Math.ceil((searchResults?.length || 0) / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = searchResults?.slice(startIdx, endIdx) || [];

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  console.log(selectedZone);
  console.log(startDate);
  return (
    <div className="p-4 mt-4 mx-2 lg:mx-5 lg:flex lg:flex-row bg-white rounded-xl shadow-xl">
      <div className="lg:w-1/4 lg:min-h-full lg:border-2 lg:border-green-400 lg:rounded-xl lg:border-dashed lg:border-opacity-40 p-2 mx-3">
        <div className="flex flex-col gap-5 py-4 px-4 h-full">
          <div className="text-xl">โปรดเลือกรายละเอียดข้อมูล</div>
          <div id="selection-zone">
            <div className="flex flex-row gap-2">
              <Box
                sx={{
                  width: "100%",
                  bgcolor: "#efebe9",
                  height: "100%",
                  maxHeight: 200,
                  overflow: "auto",
                }}
                className="rounded-xl"
              >
                {Object.keys(countryMapper.main_tag).map((category, index) => (
                  <ListItemButton
                    key={index}
                    selected={selectedZone === category}
                    onClick={(event) =>
                      handleListItemClickZone(event, category)
                    }
                  >
                    <div className="text-l">{category}</div>
                  </ListItemButton>
                ))}
              </Box>
              <Box
                sx={{
                  width: "100%",
                  bgcolor: "#f1f8e9",
                  height: "100%",
                  maxHeight: 200,
                  overflow: "auto",
                }}
                className="rounded-xl"
              >
                {selectedZone ? (
                  countryMapper.main_tag[selectedZone].map(
                    (country, indexCountry) => (
                      <ListItem
                        key={indexCountry}
                        secondaryAction={
                          <Checkbox
                            edge="end"
                            onChange={handleToggleSubZone(country)}
                            checked={checkedSubZone.includes(country)}
                            inputProps={{
                              "aria-labelledby": country,
                            }}
                          />
                        }
                        disablePadding
                      >
                        <ListItemButton>
                          <div id={country}>{country}</div>
                        </ListItemButton>
                      </ListItem>
                    )
                  )
                ) : (
                  <div className="text-red-700 text-center font-bold">
                    โปรดเลือกโซนก่อน*
                  </div>
                )}
              </Box>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <div className="font-xl">
                โปรดเลือกเดือนที่เดินทาง (ไม่บังคับ)
              </div>
              <DatePicker
                selected={startDate}
                onChange={handleMonthChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                placeholderText="Click to select a month"
                showMonthYearPicker
                dateFormat="MM/yyyy"
                className="px-2 py-1 text-black bg-gray-200 rounded-l text-l"
                minDate={new Date([])}
                filterDate={disablePastMonths}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <Button
              variant="contained"
              color="error"
              onClick={handleClearButton}
            >
              เคลียร์
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleSearchButton}
              disabled={selectedZone == "" && startDate == null}
            >
              ค้นหา
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-blue-gray-400">คำค้นหาปัจจุบัน:</div>
            <div className="text-l">
              ทวีป:{" "}
              <span className="font-bold text-green-600">{selectedZone}</span>
            </div>
            <div className="flex flex-row">
              ประเทศ:
              {checkedSubZone
                ? checkedSubZone.map((country) => (
                    <div className="text-blue-500 font-bold" key={country}>
                      {country},
                    </div>
                  ))
                : null}
            </div>
            <div className="flex flex-row">
              เดือน:{" "}
              <div className="text-red-500 font-bold">
                {startDate
                  ? getIncludedMonths(startDate, endDate).join(", ")
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:w-3/4 lg:h-full" id="second-div">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {currentItems.map((tour) => (
            <div
              key={tour._id}
              className="border-2 border-dotted border-opacity-30 rounded-md border-black p-2"
            >
              {tour.image_url && (
                <div>
                  <img
                    src={tour.image_url}
                    alt={`Tour ${tour._id}`}
                    className="w-full h-auto cursor-pointer"
                    onClick={
                      isAdmin
                        ? () =>
                            navigate(`/tour/${tour._id}`, { state: { tour } })
                        : null
                    }
                  />
                  <div>
                    {/* <div className="truncate font-bold">
                      กรุ๊ป:{" "}
                      <span className="text-green-800">{group_mapper[tour.group_id] || ''}</span>
                    </div> */}
                    <div className="flex flex-row justify-between items-center mt-2">
                      <div>
                        id:{" "}
                        <span className="text-black font-bold">{tour._id}</span>
                      </div>
                      <Icon
                        onClick={() => handleCopyToClipboard(tour)}
                        className="bg-green-200 rounded-full"
                      >
                        <ClipboardIcon className="h-5 w-5 text-black" />
                      </Icon>
                    </div>

                    <div className="flex flex-row gap-2">
                      {tour.tags.length > 0 ? (
                        <div className="font-bold">แท็ก: </div>
                      ) : null}
                      {tour.tags
                        ? tour.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              color="success"
                            />
                          ))
                        : null}
                    </div>
                    {/* <div className="flex flex-row justify-between">
                      <div className="text-gray-600">({tour.pos_dt})</div>
                      <div className="text-red-700">
                        {tour.delete_at.split(" ")[0]}
                      </div>
                    </div> */}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {searchResults.length > 0 ? (
          <div className="mt-4 flex justify-center">
            <Button
              variant="text"
              className="flex items-center gap-2"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {[...Array(totalPages).keys()].map((index) => (
                <IconButton
                  key={index + 1}
                  color={currentPage === index + 1 ? "success" : "default"}
                  onClick={() => setCurrentPage(index + 1)}
                >
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
              Next
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
