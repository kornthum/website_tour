import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  console.log(formData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        return;
      }
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-center my-5">
      <Card
        color="white"
        className="w-screen h-screen flex flex-col items-center lg:w-3/5 lg:h-3/5 lg:pb-5"
      >
        <Typography
          variant="h4"
          color="blue-gray"
          className="mt-5"
        >
          เข้าสู่ระบบ
        </Typography>

        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 sm:flex sm:flex-col" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              ID
            </Typography>
            <Input
              size="lg"
              placeholder="username"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              id="username"
              onChange={handleChange}
            />

            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              id="password"
              onChange={handleChange}
            />
          </div>
          <button>
            Sing in
          </button>
        </form>
      </Card>
    </div>
  );
}
