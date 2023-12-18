import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";

export default function SignIn() {
  return (
    <div className="flex justify-center my-5">
      <Card
        color="white"
        className="w-screen h-screen items-center lg:w-3/5 lg:h-3/5 lg:pb-5 lg:flex"
      >
        <Typography variant="h4" color="blue-gray" className="mt-5">
          เข้าสู่ระบบ
        </Typography>
        <Typography color="gray" className="font-normal"></Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              ID
            </Typography>
            <Input
              size="lg"
              placeholder="ID"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              id="id"
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
            />
          </div>
          <Button className="mt-6" fullWidth>
            sign up
          </Button>

        </form>
      </Card>
    </div>
  );
}
