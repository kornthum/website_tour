import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    group_id: {
      type: String,
      required: true,
      unique: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    country: {
      type: Array,
      required: false,
    },
    continent: {
      type: Array,
      required: false,
    },
    tags: {
      type: Array,
      required: false,
    },
    delete_at: {
      type: String,
      required: true,
    },
    pos_dt: {
      type: String,
      required: true,
    },
    in_junk: {
      type: Boolean,
      required: true,
    },
    tour_month: {
      type: Array,
      required: false,
    },
    image_hash: {
      type: String,
      required: false,
    }
  },
  { timestamps: false },
);

const Tour = mongoose.model("TourData", tourSchema, 'TourData');

export default Tour;
