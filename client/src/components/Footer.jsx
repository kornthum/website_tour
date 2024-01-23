import { Typography } from "@material-tailwind/react";
 
export default function Footer() {
  return (
    <footer className="flex w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 border-t border-blue-gray-50 py-6 text-center md:justify-between bg-white mt-5 p-5" >
      <Typography color="blue-gray" className="font-test">
        &copy; 2024 Tour Search Demo.
      </Typography>
    </footer>
  );
}