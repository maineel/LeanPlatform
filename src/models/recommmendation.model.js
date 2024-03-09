import mongoose from "mongoose";
import { randomBytes } from "crypto";

const recommendationSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recommendationContent: {
      type: String,
      required: true,
    },
    recommendationLink: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// const uniqueId = randomBytes(8).toString('hex');        // Generate a unique 16 character id for the recommendation link    

// const port =   `${process.env.PORT || 8080}`;
// const shareableLink = `http://localhost:${port}/recommendation/${uniqueId}`;

export const Recommendation = mongoose.model("Recommendation", recommendationSchema);
