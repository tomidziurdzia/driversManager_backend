import mongoose from "mongoose";

const platformSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
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

const Platform = mongoose.model("Platform", platformSchema);

export default Platform;
