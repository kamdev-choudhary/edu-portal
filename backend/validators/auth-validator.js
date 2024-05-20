const { z } = require("zod");

const signUpSchema = z.object({
  username: z
    .string({ required_error: "Username Is required" })
    .trim()
    .min(3, { msg: "Username must be atlest 3 Characters" })
    .max(255, { msg: "max 255 characters ionly" }),
  email: z
    .string({ required_error: "Email is Requied" })
    .trim()
    .min(5, { msg: "Invalid Email" })
    .max(255, { msg: "invalid email" }),
  phone: z
    .string({ required_error: "Phone is required" })
    .trim()
    .min(10, { msg: "Invalid Mobile Number" })
    .max(10, { msg: "Invalid Mobile NUmber" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { msg: "Password must be atlest 5 characters" })
    .max(1024, { msg: "Password is too long" }),
});

module.exports = signUpSchema;
