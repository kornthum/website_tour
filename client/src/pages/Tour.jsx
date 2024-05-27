import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Input, Typography } from "@material-tailwind/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ListItemButton from "@mui/material/ListItemButton";
import countryMapper from "../utils/country_mapper.json";
import Checkbox from "@mui/material/Checkbox";
import ListItem from "@mui/material/ListItem";
import Chip from "@mui/material/Chip";
import { Box, Button, TextField } from "@mui/material";
import DeleteModal from "../utils/Modal/DeleteModal";
import SaveModal from "../utils/Modal/SaveModal";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function Tour() {
  const param = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { tour: checkTour } = location.state || {};
  const savedTour = checkTour || {
    continent: "",
    country: [],
    delete_at: null,
    tags: [],
    tour_month: [],
  };
  const { group_mapper } = useSelector((state) => state.tour);

  console.log(savedTour);

  const convertMonthsArrayToDates = (monthsArray) => {
    if (!monthsArray || !monthsArray.length) {
      return [null, null]; // Handle the case when the array is not available or empty
    }
  
    const thaiMonthMap = {
      'มกราคม': 0,
      'กุมภาพันธ์': 1,
      'มีนาคม': 2,
      'เมษายน': 3,
      'พฤษภาคม': 4,
      'มิถุนายน': 5,
      'กรกฎาคม': 6,
      'สิงหาคม': 7,
      'กันยายน': 8,
      'ตุลาคม': 9,
      'พฤศจิกายน': 10,
      'ธันวาคม': 11,
    };
  
    const getNumericalMonth = (thaiMonth) => thaiMonthMap[thaiMonth];
  
    const startDateParts = monthsArray[0].split(' ');
    const startMonth = getNumericalMonth(startDateParts[0]);
    const startYear = parseInt(startDateParts[1], 10);
  
    const oldStartDate = new Date(startYear, startMonth);
  
    let oldEndDate = null;
    if (monthsArray.length > 1) {
      const endDateParts = monthsArray[monthsArray.length - 1].split(' ');
      const endMonth = getNumericalMonth(endDateParts[0]);
      const endYear = parseInt(endDateParts[1], 10);
      oldEndDate = new Date(endYear, endMonth);
    }
  
    if (oldStartDate) {
      oldStartDate.setFullYear(oldStartDate.getFullYear() - 543);
    }
    if (oldEndDate) {
      oldEndDate.setFullYear(oldEndDate.getFullYear() - 543);
    }

    return [oldStartDate, oldEndDate];
  };
  
  const [oldStartDate, oldEndDate] = convertMonthsArrayToDates(
    savedTour.tour_month
  );
  const [tourData, setTourData] = useState(new Date());
  const [startDate, setStartDate] = useState(oldStartDate);
  const [endDate, setEndDate] = useState(oldEndDate);

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const response = await fetch(`/api/tour/get_tour/${param.tour_id}`);
        const data = await response.json();
        setTourData(data);
      } catch (error) {
        console.error("Error fetching tour data:", error);
      }
    };

    fetchTourData();
  }, [param.tour_id]);

  //get user role
  const { currentUser } = useSelector((state) => state.user);

  const disablePastMonths = (date) => {
    const currentDate = new Date();
    return (
      date >= new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    );
  };

  const disablePastDates = (date) => {
    const currentDate = new Date();
    return (
      date >
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        1
      )
    );
  };

  const handleMonthChange = ([newStartDate, newEndDate]) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleDeleteMonthButton = (event) => {
    event.preventDefault();
    setStartDate(null);
    setEndDate(null);
  };
  const convertDeleteDate = (originalDeleteDate) => {
    if (!originalDeleteDate) {
      return null; // Handle the case when delete_at is not available
    }
  
    console.log(originalDeleteDate);
    // Assuming originalDeleteDate is in the format 'DD/MM/YYYY'
    const [day, month, year] = originalDeleteDate.split('/');
    console.log(day, month, year);
    const parsedDate = new Date(`${month}-${day}-${year}`);
  
    console.log(parsedDate);
    return parsedDate;
  };

  const [deleteDate, setDeleteDate] = useState(
    convertDeleteDate(savedTour.delete_at)
  );
  const handleDeleteDateButton = (event) => {
    event.preventDefault();
    setDeleteDate();
  };

  const [selectedIndexZone, setSelectedIndexZone] = React.useState(
    savedTour.continent
  );



  const handleListItemClickZone = (event, index) => {
    setSelectedIndexZone(index);
    setCheckedSubZone([]);
  };

  const [checkedSubZone, setCheckedSubZone] = React.useState(savedTour.country);

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

  const [TagText, setTagText] = useState("");
  const handleTagChange = (event) => {
    setTagText(event.target.value);
  };

  const [tag, setTag] = useState(savedTour.tags);

  const handleAddTag = (event) => {
    event.preventDefault();
    {
      TagText != "" ? setTag([...tag, TagText]) : null;
    }
    setTagText("");
  };

  const handleDeleteTag = (index) => {
    const newTag = [...tag];
    newTag.splice(index, 1);
    setTag(newTag);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/tour/delete_tour/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({role: currentUser.role}),
      });
      const data = await res.json();
      { savedTour ? navigate("/") : navigate("/edit")}
      navigate("/edit");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
  };

  function getIncludedMonths(startDate, endDate) {
    const thaiOptions = { month: "long", year: "numeric", locale: "th-TH" };

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

  const handleSave = async (id) => {
    const thaiTimeZoneOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Bangkok",
    };
    try {
      const res = await fetch(`/api/tour/update_tour/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tour_month: getIncludedMonths(startDate, endDate),
          delete_at: deleteDate
            .toLocaleString("en-GB", thaiTimeZoneOptions)
            .replace(",", ""),
          country: checkedSubZone,
          continent: selectedIndexZone,
          tags: tag,
          role: currentUser.role,
        }),
      });
      const data = await res.json();
      console.log(data);
      console.log(savedTour);
      {
        savedTour.continent != '' ? navigate("/") : navigate("/edit");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error deleting tour:", error);
    }
  };

  return (
    <div className="px-5 py-5 mt-4 mx-5 drop-shadow-md rounded-lg bg-white">
      {tourData && (
        <div className="flex flex-col items-center lg:flex lg:flex-row lg:items-stretch gap-5">
          <div className="w-3/4">
            <img src={tourData.image_url} alt="Tour Image" />
          </div>
          <div className="w-full p-5 border border-black ">
            <form className="w-full">
              <div className="mb-1 flex flex-col gap-4">
                {/* header */}
                <div className="flex flex-col gap-2">
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="font-test"
                  >
                    จากกลุ่มไลน์
                  </Typography>
                  <Input
                    size="l"
                    placeholder="name@mail.com"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    // value={tourData.group_id}
                    value = {group_mapper[tourData.group_id] || ''}
                    disabled
                  />
                </div>

                {/* date time picker */}
                <div className="sm:flex sm:flex-col lg:flex lg:flex-row md:flex-row items-center gap-2 justify-between">
                  <div className="flex flex-col gap-2">
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="font-test"
                    >
                      เดือนที่เดินทาง
                    </Typography>
                    <div className="flex flex-row items-center gap-2">
                      <DatePicker
                        selected={startDate}
                        onChange={handleMonthChange}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        placeholderText="Click to select a month"
                        showMonthYearPicker
                        dateFormat="MM/yyyy"
                        className="px-2 py-1 font-test font-bold text-green-900 bg-gray-200 rounded-l text-l"
                        minDate={new Date([])}
                        filterDate={disablePastMonths}
                      />

                      <Button onClick={handleDeleteMonthButton} color="error">
                        clear
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Typography
                      variant="h6"
                      color="blue-gray"
                      className="font-test text-red-700"
                    >
                      โพสจะถูกลบเมื่อ
                    </Typography>
                    <div className="flex flex-row items-center gap-2">
                      <DatePicker
                        selected={deleteDate}
                        onChange={(deleteDate) => setDeleteDate(deleteDate)}
                        placeholderText="Click to select a date"
                        dateFormat="dd/MM/yyyy"
                        className="px-2 py-1 font-test font-bold text-red-900 bg-gray-200 rounded-l text-l"
                        minDate={new Date([])}
                        filterDate={disablePastDates}
                      />
                      <Button onClick={handleDeleteDateButton} color="error">
                        clear
                      </Button>
                    </div>
                  </div>
                </div>

                {/* zoning */}
                <div className="flex flex-col gap-2">
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="font-test"
                  >
                    เลือกข้อมูลเกี่ยวกับทัวร์
                  </Typography>
                  <div className="sm:flex sm:flex-row md:flex md:flex-row gap-5 justify-center">
                    <div className="flex flex-col gap-2 items-center">
                      <div className="font-test underline text-l">โซน*</div>
                      <Box
                        sx={{
                          width: "180px",
                          bgcolor: "#efebe9",
                          height: "100%",
                          maxHeight: 200,
                          overflow: "auto",
                        }}
                        className="rounded-xl"
                      >
                        {Object.keys(countryMapper.main_tag).map(
                          (category, index) => (
                            <ListItemButton
                              key={index}
                              selected={selectedIndexZone === category}
                              onClick={(event) =>
                                handleListItemClickZone(event, category)
                              }
                            >
                              <div className="font-test text-l">{category}</div>
                            </ListItemButton>
                          )
                        )}
                      </Box>
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                      <div className="font-test underline text-l">ประเทศ*</div>
                      <Box
                        sx={{
                          width: "220px",
                          bgcolor: "#f1f8e9",
                          height: "100%",
                          maxHeight: 200,
                          overflow: "auto",
                        }}
                        className="rounded-xl"
                      >
                        {selectedIndexZone ? (
                          countryMapper.main_tag[selectedIndexZone].map(
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
                                  <div className="font-test" id={country}>
                                    {country}
                                  </div>
                                </ListItemButton>
                              </ListItem>
                            )
                          )
                        ) : (
                          <div className="font-test text-red-700 text-center text-bold">
                            โปรดเลือกโซนก่อน*
                          </div>
                        )}
                      </Box>
                    </div>
                  </div>
                </div>

                {/* Current Tags */}
                <div className="flex flex-row gap-2">
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="font-test"
                  >
                    แท็กปัจจุบัน:
                  </Typography>
                  {selectedIndexZone ? (
                    <Chip label={selectedIndexZone} size="small" color="info" />
                  ) : null}
                  {checkedSubZone
                    ? checkedSubZone.map((country, index) => (
                        <Chip
                          key={index}
                          label={country}
                          size="small"
                          color="error"
                          inputProps={{ font: "font-test" }}
                        />
                      ))
                    : null}
                  {tag
                    ? tag.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          color="success"
                          inputProps={{ font: "font-test" }}
                          onDelete={() => handleDeleteTag(index)}
                        />
                      ))
                    : null}
                </div>

                {/* Add Tags */}
                <div className="flex flex-row gap-2 items-center mt-3">
                  <Typography
                    variant="h6"
                    color="blue-gray"
                    className="font-test"
                  >
                    เพิ่มแท็ก:
                  </Typography>
                  <TextField
                    label="tags"
                    onChange={handleTagChange}
                    value={TagText}
                  ></TextField>
                  <Button onClick={handleAddTag}>add</Button>
                </div>

                {/* Final Buttons*/}
                <div className="flex flex-row gap-2 justify-between mt-12">
                  <DeleteModal onDelete={() => handleDelete(tourData._id)} />
                  <SaveModal
                    onSave={() => handleSave(tourData._id)}
                    startDate={startDate}
                    deleteDate={deleteDate}
                    selectedIndexZone={selectedIndexZone}
                    checkedSubZone={checkedSubZone}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
