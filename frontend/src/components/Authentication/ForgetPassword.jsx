import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useFormik } from "formik";
import { forgetPasswordValidation } from "./validationSchema";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
const ForgetPassword = () => {
  console.log("forget password page");
  const [errorMsg, setErrorMsg] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const initialValues = {
    email: "",
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: forgetPasswordValidation,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      setErrorMsg("");
      console.log("values", values);
      try {
        const res = await axios.post("/api/user/forget-password", values);
        if (res.status === 200) {
          toast({
            title: "Password Reset Link",
            description: res.data?.message,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });

          resetForm();
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.log(error);

        if (error.isAxiosError) {
          // console.log(errorMsg);
          const errMsg =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message;

          setErrorMsg(errMsg);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });
  return (
    <Container size="2xl">
      <Flex
        display="flex"
        justifyContent="center"
        alignItems="center"
        h="100dvh"
      >
        <Box
          p={3}
          bg="rgba(255, 255, 255, 0.6)"
          backdropFilter="blur(5px)"
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          boxShadow="20px 20px 40px #5a5a5a,
        -20px -20px 40px #ffffff"
        >
          <Text
            display="flex"
            justifyContent="center"
            mb="8"
            fontFamily="Work sans"
            fontSize="3xl"
            fontWeight="semibold"
          >
            Forget Passsword
          </Text>
          {errorMsg && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle color="red ">{errorMsg}</AlertTitle>
            </Alert>
          )}
          <FormControl isRequired id="emailId">
            <FormLabel>Email</FormLabel>
            <InputGroup flexDir="column">
              <Input
                placeholder="Enter Email Here..."
                id="emailId"
                name="email"
                value={formik.values?.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <Text color="red" mt={1}>
                  {formik.errors.email}
                </Text>
              ) : null}
            </InputGroup>
            <Button
              type="submit"
              bg="blue.500"
              width="100%"
              mt={6}
              onClick={formik.handleSubmit}
              isLoading={formik.isSubmitting}
            >
              Send Reset Link
            </Button>
          </FormControl>
          <NavLink
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "4px",
              color: "blue",
              textDecoration: "underline",
            }}
            to="/f"
          >
            Sign In
          </NavLink>
        </Box>
      </Flex>
    </Container>
  );
};

export default ForgetPassword;
