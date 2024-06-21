import React, { useState } from "react";
import { useSelector } from "react-redux";
export default function AdminSearch() {
  const [searchId, setSearchId] = useState("");
  const [tour, setTour] = useState(null);
  const [error, setError] = useState("");

  const { group_mapper } = useSelector((state) => state.tour);
  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/tour/get_tour/${searchId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Tour not found");
      }

      const data = await response.json();
      setTour(data);
      setError("");
    } catch (error) {
      setError(error.message);
      setTour(null);
    }
  };

  return (
    <div className="p-4 mt-4 mx-2 lg:mx-5 lg:flex lg:flex-col bg-white rounded-xl shadow-xl justify-center items-center gap-5">
      <div className="w-full lg:w-1/3 lg:mr-4">
        <input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter Tour ID"
          className="w-full p-2 border rounded-lg mb-2"
        />
        <button
          onClick={handleSearch}
          className="w-full p-2 bg-blue-500 text-white rounded-lg"
        >
          Search
        </button>
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>
      <div className="w-full lg:w-2/3 lg:ml-4">
        {tour ? (
          <div className="p-4 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Tour Details</h2>
            <p>
              <strong>TOUR ID:</strong> {tour._id}
            </p>
            <p className="flex flex-rows gap-2">
              <strong>Group:</strong> <p className="">{group_mapper[tour.group_id] || ''}</p>
            </p>
            <img
              src={tour.image_url}
              alt="Tour Image"
              className="my-2 w-full h-auto rounded-lg"
            />
            <p>
              <strong>ประเทศ:</strong> {tour.country.join(", ")}
            </p>
            <p>
              <strong>ทวีป:</strong> {tour.continent.join(", ")}
            </p>
            {/* <p>
              <strong>Tags:</strong> {tour.tags.join(", ")}
            </p> */}
            <p>
              <strong>เดือนที่เดินทาง:</strong> {tour.tour_month.join(", ")}
            </p>
            <p>
              <strong>จะถูกลบ:</strong> {tour.delete_at}
            </p>
            <p>
              <strong>เก็บข้อมูลวันที่:</strong> {tour.pos_dt}
            </p>
            <p>
              <strong>In Junk:</strong> {tour.in_junk ? "Yes" : "No"}
            </p>
            {/* <p><strong>Image Hash:</strong> {tour.image_hash}</p> */}
            {/* <p>
              <strong>ราคา:</strong> {tour.price}
            </p> */}
          </div>
        ) : null}
      </div>
    </div>
  );
}
