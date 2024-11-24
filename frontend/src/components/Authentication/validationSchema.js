import * as Yup from "yup";

export const signUpValidation = Yup.object().shape({
  name: Yup.string()
    .trim()
    .matches(
      /^[A-Za-z0-9 ]{3,30}$/,
      "First Name must be between 3 and 30 characters and symbols not allowed"
    )
    .required("Please Enter First Name"),
  email: Yup.string()
    .trim()
    // .transform((value) => (value ? value.toLowerCase() : value))
    .required("Email is required")
    .email("Invalid email format")
    .matches(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
      "Enter a valid Email ID (must be lowercase)"
    ),
  password: Yup.string()
    .trim()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref("password"), null], "Password Enter Same Password")
    .required("Confirm Password is required"),
  picture: Yup.string()
    .url("Invalid image URL")
    .required("Image is required")
    .test(
      "fileSizeAndType",
      "File is too large (max 10MB) or unsupported format (only jpg, jpeg, png allowed)",
      (value) => {
        if (!value) return true; // Allow if no file URL is provided

        return fetch(value)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Could not fetch the image");
            }
            return response.blob();
          })
          .then((blob) => {
            const sizeInMB = blob.size / (1024 * 1024);
            const validTypes = ["image/jpeg", "image/jpg", "image/png"];
            const type = blob.type;

            return sizeInMB <= 10 && validTypes.includes(type);
          });
      }
    ),
});

export const logInValidation = Yup.object().shape({
  email: Yup.string()
    .trim()
    // .transform((value) => (value ? value.toLowerCase() : value))
    .matches(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
      "Enter a valid Email ID (must be lowercase)"
    )
    .required("Email is required"),
  password: Yup.string()
    .trim()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    )
    .required("Password is required"),
});
export const forgetPasswordValidation = Yup.object().shape({
  email: Yup.string()
    .trim()
    // .transform((value) => (value ? value.toLowerCase() : value))
    .matches(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
      "Enter a valid Email ID (must be lowercase)"
    )
    .required("Email is required"),
});

export const ResetPasswordValidation = Yup.object().shape({
  password: Yup.string()
    .trim()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Password must be at least 8 characters long, contain 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref("password"), null], "Password Enter Same Password")
    .required("Confirm Password is required"),
});
