import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import { signUpValidation } from "./validationSchema";
import axios from "axios";
import CryptoJS from "crypto-js";

const secretKey = import.meta.env.VITE_SECRET_KEY;
const SignUp = ({ onSignUpSuccess }) => {


  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fileInputRef = useRef();
  const toast = useToast();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    picture: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: signUpValidation,
    onSubmit: async (values, { resetForm }) => {
      setErrorMsg(null);
      setLoading(true);
      try {
        const encryptedPassword = CryptoJS.AES.encrypt(
          values.password,
          secretKey
        ).toString();

        const encryptedConfirmPassword = CryptoJS.AES.encrypt(
          values.confirmPassword,
          "EmailPassword"
        ).toString();

        const response = await axios.post(`/api/user`, {
          ...values,
          password: encryptedPassword,
          confirmPassword: encryptedConfirmPassword,
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        resetForm();
        if (response.status === 201) {
          toast({
            title: "User Register.",
            description: response.data?.message,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-center",
          });
        }
        onSignUpSuccess();
      } catch (error) {
        console.error("Form submission error:", error);

        if (error.status === 400) {
          setErrorMsg("Network error: unable to connect to the server.");
        } else if (error.isAxiosError) {
          console.log(errorMsg);
          const errMsg = error.response?.data?.error || error.message;

          setErrorMsg(errMsg);
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const handleFileChange = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
    data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_KEY);

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dyky9kjit/image/upload",
        data
      );
      const uploadedImageUrl = res.data.secure_url.toString();

      formik.setFieldValue("picture", uploadedImageUrl);

      setLoading(false);
    } catch (error) {
      setErrorMsg("Image upload failed. Please try again.");
    }
  };
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing="5px">
          {errorMsg && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle color="red ">{errorMsg}</AlertTitle>
            </Alert>
          )}
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              _placeholder={{ color: "rgba(0,0,0,0.6)" }}
              placeholder="Enter your Name"
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              bg={formik.values.name ? "transparent" : "transparent"}
            />
            {formik.touched.name && formik.errors.name ? (
              <Text color="red" mb="-2">
                {formik.errors.name}
              </Text>
            ) : null}
          </FormControl>

          <FormControl id="signUpEmail" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              _placeholder={{ color: "rgba(0,0,0,0.6)" }}
              placeholder="Enter your Email"
              type="email"
              id="signUpEmail"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              bg={formik.values.email ? "transparent" : "transparent"}
            />
            {formik.touched.email && formik.errors.email ? (
              <Text color="red" mb="-2">
                {formik.errors.email}
              </Text>
            ) : null}
          </FormControl>

          <FormControl id="signUpPassword" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                _placeholder={{ color: "rgba(0,0,0,0.6)" }}
                placeholder="Enter your Password"
                type={show ? "text" : "password"}
                id="signUpPassword"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputRightElement paddingRight="20px">
                <Button
                  h="1.75rem"
                  size="sm"
                  paddingInline="25px"
                  onClick={() => {
                    setShow((prevState) => !prevState);
                  }}
                >
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            {formik.touched.password && formik.errors.password ? (
              <Text color="red" mb="-2">
                {formik.errors.password}
              </Text>
            ) : null}
          </FormControl>

          <FormControl id="signUpConfirmPassword" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                _placeholder={{ color: "rgba(0,0,0,0.6)" }}
                placeholder="Enter your Confirm Password"
                id="signUpConfirmPassword"
                type={show ? "text" : "password"}
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <InputRightElement paddingRight="20px">
                <Button
                  h="1.75rem"
                  size="sm"
                  paddingInline="25px"
                  onClick={() => {
                    setShow((prevState) => !prevState);
                  }}
                >
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <Text color="red" mb="-2">
                {formik.errors.confirmPassword}
              </Text>
            ) : null}
          </FormControl>

          <FormControl id="picture">
            <FormLabel>Select picture</FormLabel>
            <Input
              // border="1px solid black"

              type="file"
              id="picture"
              name="picture"
              accept=".jpg,.jpeg,.png"
              _placeholder={{ color: "rgba(0,0,0,0.6)" }}
              onChange={handleFileChange}
              onBlur={formik.handleBlur}
              ref={fileInputRef}
            />
            {formik.touched.picture && formik.errors.picture ? (
              <Text color="red" mb="-2">
                {formik.errors.picture}
              </Text>
            ) : null}
          </FormControl>
          <Button
            width="100%"
            mt="15px"
            type="submit"
            borderRadius="50px"
            bg="blue.400"
            onClick={formik.handleSubmit}
            isLoading={loading}
          >
            Sign Up
          </Button>
        </VStack>
      </form>
    </>
  );
};

export default SignUp;
