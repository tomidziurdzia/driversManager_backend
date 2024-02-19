import mongoose from "mongoose";

const vehicleSchema = mongoose.Schema(
  {
    patent: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
      default: "Vehicle",
    },
    typeVehicle: {
      type: String,
      required: true,
      enum: ["Bike", "Motorcycle", "Car"],
    },
    rego: {
      type: Date,
      default: Date.now(),
    },
    consume: {
      type: Number,
      default: 0,
    },
    insurance: {
      type: Number,
      default: 0,
    },
    rent: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    travels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Travel",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
