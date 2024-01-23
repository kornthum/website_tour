import Tour from "../models/tour.model.js";
import Group from "../models/group.model.js";
import AWS from 'aws-sdk';
import dotenv from "dotenv";


dotenv.config();

export const getNumberDataWithEmptyLabels = async (req, res, next) => {
  try {
    const count = await Tour.countDocuments({ country: [], in_junk: false });
    res.status(200).json(count);
  } catch (error) {
    next(error);
  }
};

export const getDataWithEmptyLabels = async (req, res, next) => {
  try {
    const data = await Tour.find({ country: [], in_junk: false });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const getTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json(tour);
  } catch (error) {
    next(error);
  }
};

export const updateInJunk = async (req, res, next) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedTour);
  } catch (error) {
    next(error);
  }
};

export const updateTour = async (req, res, next) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(req.body);
  } catch (error) {
    next(error);
  }
};

export const searchTour = async (req, res) => {
  try {
    // Assuming you have the country and continent in the query parameters
    const { country, continent, tour_month } = req.query;

    // Convert the comma-separated string to an array of countries
    const countryArray = country.split(",");

    let tourMonthArray = [];
    if (tour_month) {
      tourMonthArray = tour_month.split(",");
    }

    let query = {
      country: { $in: countryArray },
      continent: continent,
    };

    if (tourMonthArray.length > 0) {
      query.tour_month = { $in: tourMonthArray };
    }
    // Perform the search based on provided countries and continent
    const tours = await Tour.find(query);

    res.status(200).json({ success: true, data: tours });
  } catch (error) {
    console.error("Error searching tours:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


export const getGroupMapper = async (req, res, next) => {
  try {
    const data = await Group.find();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const deleteTour = async (req, res, next) => {
  console.log(req.params.id);


  // get data from id 
  const deletedTour = await Tour.findById(req.params.id);
  //save data
  const s3_url = deletedTour['image_url']

  function extractS3KeyFromUrl(s3Url) {
    const parsedUrl = new URL(s3Url);
    // Extract the key from the pathname
    const key = parsedUrl.pathname.substr(1); // Remove the leading slash
    return key;
  }

  const s3 = new AWS.S3({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
  });

  const params = {
    Bucket: 'linebotdev',
    Key: extractS3KeyFromUrl(s3_url)
  };

  console.log(params);

  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedTour);

    s3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    });

  } catch (error) {
    next(error);
  }
};