import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    validate: {
      validator: function (password) {
        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const numberRegex = /[0-9]/;
        const specialCharecterRegex = /[!@#$%^&*()_+]/;

        return (
          uppercaseRegex.test(password) &&
          lowercaseRegex.test(password) &&
          numberRegex.test(password) &&
          specialCharecterRegex.test(password) &&
          password.length >= 6
        );
      },
      message:
        "Password must include at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long.",
    },
  },



  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
