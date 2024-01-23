import React, { useEffect, useState } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  Badge,
} from "@material-tailwind/react";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNumberNewTour, setGroupMapper } from "../redux/tour/tourSlice";

export default function Header() {
  const [openNav, setOpenNav] = React.useState(false);
  const [tourNumber, setTourNumber] = useState(0);

  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const fetchItemCount = async () => {
    try {
      const response = await fetch("/api/tour/get_n_new_tour", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data; // Adjust the data structure based on your API response
    } catch (error) {
      console.error("Error fetching item count:", error);
      return 0;
    }
  };

  const fetchGroupMapper = async () => {
    try {
      const response = await fetch("/api/tour/get_group_mapper", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data; // Adjust the data structure based on your API response
    } catch (error) {
      console.error("Error fetching group mapper:", error);
      return {};
    }
  };

  useEffect(() => {
    const updateItemCount = async () => {
      const count = await fetchItemCount();
      setTourNumber(count);
      dispatch(setNumberNewTour(count));
    };

    const updateGroupMapper = async () => {
      const mapper = await fetchGroupMapper();
      /* Manipulate to group_id: group_name*/
      const manipulatedMapper = {};

      mapper.map((item) => {
        manipulatedMapper[item.group_id] = item.group_name;
      });

      dispatch(setGroupMapper(manipulatedMapper));
    };
    if (currentUser) {
      updateItemCount();
      updateGroupMapper();
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Link to="/search">
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium"
        >
          <a href="#" className="flex items-center">
            <Button
              className="flex flex-row items-center gap-2"
              variant="gradient"
              size="md"
              color="white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>Search Tour</p>
            </Button>
          </a>
        </Typography>
      </Link>

      <Link to="/edit">
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium"
        >
          <Badge content={tourNumber} color="red">
            <Button variant="gradient" color="white" size="md">
              <p>Edit</p>
            </Button>
          </Badge>
        </Typography>
      </Link>

      {/* <Link to="/junk">
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium"
        >
          <Button
            className="flex flex:col items-center gap-2"
            color="white"
            size="md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                className="text-red-900"
              />
            </svg>
            <a href="#" className="flex items-center text-red-900">
              Junk
            </a>
          </Button>
        </Typography>
      </Link> */}
    </ul>
  );

  return (
    <Navbar className="mx-auto px-4 py-2 lg:mt-2" fullWidth="true">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Link to="/">
          <Typography
            as="a"
            href="#"
            className="mr-4 cursor-pointer py-1.5 font-medium"
          >
            TOUR SEARCH
          </Typography>
        </Link>

        {currentUser ? (
          <div className="hidden lg:block">{navList}</div>
        ) : (
          <div className="text-red-500 items-center ">Please login first</div>
        )}

        {currentUser ? (
          <div>Hi</div>
        ) : (
          <Link to="/sign-in">
            <div className="flex items-center gap-x-1">
              <Button
                variant="gradient"
                size="sm"
                className="hidden lg:inline-block"
              >
                <span>Login</span>
              </Button>
            </div>
          </Link>
        )}

        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>

      <Collapse open={openNav}>
        <div className="container mx-auto">
          {currentUser ? [navList] : null}

          {currentUser ? null : (
            <Link to="/sign-in">
              <div className="flex items-center gap-x-1">
                <Button fullWidth variant="gradient" size="sm" className="">
                  <span>Login</span>
                </Button>
              </div>
            </Link>
          )}
        </div>
      </Collapse>
    </Navbar>
  );
}
