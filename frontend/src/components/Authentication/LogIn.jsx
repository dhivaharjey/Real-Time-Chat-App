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
import { useFormik } from "formik";
import React, { useState } from "react";
import { logInValidation } from "./validationSchema";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { ChatState } from "../Context/ChatProvider";

const secretKey = import.meta.env.VITE_SECRET_KEY;
const LogIn = () => {
  const [show, setShow] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const { setUser } = ChatState();
  const toast = useToast();
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: logInValidation,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      setErrorMsg(null);

      const encryptedPassword = CryptoJS.AES.encrypt(
        values.password,
        secretKey
      ).toString();

      try {
        const res = await axios.post(`/api/user/login`, {
          ...values,
          password: encryptedPassword,
        });

        if (res.status === 200) {
          resetForm();
          setErrorMsg(null);
          localStorage.setItem("userInfo", JSON.stringify(res.data));
          setUser(res.data);
          toast({
            title: "User Login",
            description: res.data?.message,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });

          navigate("/chats", { replace: true });
        }
      } catch (error) {
        console.log("Form submission error:", error);

        if (error.status === 400) {
          setErrorMsg("Network error: unable to connect to the server.");
        } else if (error.isAxiosError) {
          console.log(errorMsg);
          const errMsg = error.response?.data?.error || error.message;

          setErrorMsg(errMsg);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <VStack>
          {errorMsg && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle color="red ">{errorMsg}</AlertTitle>
            </Alert>
          )}
          <FormControl id="logInEmail" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter Your Email"
              _placeholder={{ color: "rgba(0,0,0,0.6)" }}
              // border="1px solid black"
              id="logInEmail"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <Text color="red" mb="-2">
                {formik.errors.email}
              </Text>
            ) : null}
          </FormControl>
          <FormControl id="logInPassword" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                placeholder="Enter Your Password"
                _placeholder={{ color: "rgba(0,0,0,0.6)" }}
                id="logInPassword"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <InputRightElement paddingRight="20px">
                <Button
                  height="1.75rem"
                  size="sm"
                  paddingInline="25px"
                  onClick={() => setShow((prevState) => !prevState)}
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

          <Button
            type="submit"
            mt="10px"
            width="100%"
            borderRadius="50px"
            bg="blue.400"
            onClick={formik.handleSubmit}
            isLoading={formik.isSubmitting}
          >
            Log In
          </Button>
          <Button
            width="100%"
            variant="solid"
            colorScheme="red"
            borderRadius="50px"
            isLoading={formik.isSubmitting}
            onClick={() => {
              formik.setFieldValue("email", "test@gmail.com");
              formik.setFieldValue("password", "Dhivahar@123");
            }}
          >
            Get Guest user Credentials
          </Button>
        </VStack>
        <NavLink
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "4px",
            color: "blue",
            textDecoration: "underline",
          }}
          to="/forget-passowrd"
        >
          Forget Password
        </NavLink>
      </form>
    </>
  );
};

export default LogIn;
