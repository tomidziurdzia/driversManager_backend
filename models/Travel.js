import mongoose from "mongoose";

const hoursWorked = [
  "1:00",
  "1:15",
  "1:30",
  "1:45",
  "2:00",
  "2:15",
  "2:30",
  "2:45",
  "3:00",
  "3:15",
  "3:30",
  "3:45",
  "4:00",
  "4:15",
  "4:30",
  "4:45",
  "5:00",
  "5:15",
  "5:30",
  "5:45",
  "6:00",
  "6:15",
  "6:30",
  "6:45",
  "7:00",
  "7:15",
  "7:30",
  "7:45",
  "8:00",
  "8:15",
  "8:30",
  "8:45",
  "9:00",
  "9:15",
  "9:30",
  "9:45",
  "10:00",
  "10:15",
  "10:30",
  "10:45",
  "11:00",
  "11:15",
  "11:30",
  "11:45",
  "12:00",
];

const travelSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    hours: {
      type: String,
      required: true,
      enum: hoursWorked,
    },
    trips: {
      type: Number,
      required: true,
    },
    netFare: {
      type: Number,
      required: true,
    },
    promotions: {
      type: Number,
      default: 0,
    },
    tips: {
      type: Number,
      default: 0,
    },
    km: {
      type: Number,
      default: 0,
    },

    priceLiter: {
      type: Number,
      default: 0,
    },
    platform: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Platform",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
  },
  {
    timestamps: true,
  }
);

const Travel = mongoose.model("Travel", travelSchema);

export default Travel;
