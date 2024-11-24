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
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { ResetPasswordValidation } from "./validationSchema";
import CryptoJS from "crypto-js";
import axios from "axios";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import InvalidResetPasswordToken from "../Miscellaneous/InvalidResetPasswordToken";
const secretKey = import.meta.env.VITE_SECRET_KEY;
const ResetPassword = () => {
  console.log("reset password page");
  const [show, setShow] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [invalidToken, setInvalidToken] = useState(false);
  const { token } = useParams();
  const toast = useToast();

  const navigate = useNavigate();
  const initialValues = {
    password: "",
    confirmPassword: "",
  };
  const verifyToken = async () => {
    try {
      const res = await axios.get(`/api/user/verify-token/${token}`);
      console.log("verify", res.data);

      if (res.status === 200) {
      }
    } catch (error) {
      if (error.AxiosError) {
        console.log(errorMsg);
        const errMsg =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;

        toast({
          title: "Invalid token",
          description: errMsg,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });

        setInvalidToken(true);
      }
    }
  };
  useEffect(() => {
    verifyToken();
  }, [token]);
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: ResetPasswordValidation,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      setErrorMsg("");
      const encryptedPassword = CryptoJS.AES.encrypt(
        values.password,
        secretKey
      ).toString();
      const encryptedConfirmPassword = CryptoJS.AES.encrypt(
        values.confirmPassword,
        secretKey
      ).toString();

      try {
        const res = await axios.post(`/api/user/reset-password/${token}`, {
          password: encryptedPassword,
          confirmPassword: encryptedConfirmPassword,
        });
        resetForm();
        if (res.status === 200) {
          toast({
            title: "Password Updated",
            description: res.data?.message,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top-right",
          });
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.log("page", error);
        if (error.isAxiosError) {
          console.log(errorMsg);
          const errMsg =
            error.response?.data?.error ||
            error.response?.data?.message ||
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
        {invalidToken ? (
          <InvalidResetPasswordToken />
        ) : (
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
              Reset Passsword
            </Text>
            {errorMsg && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle color="red ">{errorMsg}</AlertTitle>
              </Alert>
            )}
            <FormControl isRequired id="resetPasseword" mb={4}>
              <FormLabel>Password</FormLabel>
              <InputGroup flexDir="column">
                <Input
                  placeholder="Enter Email Here..."
                  id="resetPasseword"
                  type={show ? "text" : "password"}
                  name="password"
                  value={formik.values?.password}
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
                <Text color="red" mt={1}>
                  {formik.errors.password}
                </Text>
              ) : null}
            </FormControl>
            <FormControl isRequired id="resetCPasseword">
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup flexDir="column">
                <Input
                  placeholder="Enter Email Here..."
                  id="resetCPasseword"
                  type={show ? "text" : "password"}
                  name="confirmPassword"
                  value={formik.values?.confirmPassword}
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
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <Text color="red" mt={1}>
                  {formik.errors.confirmPassword}
                </Text>
              ) : null}
            </FormControl>
            <Button
              type="submit"
              bg="blue.500"
              width="100%"
              mt={5}
              onClick={formik.handleSubmit}
              isLoading={formik.isSubmitting}
            >
              Reset Password
            </Button>
            <NavLink
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "4px",
                color: "blue",
                textDecoration: "underline",
              }}
              to="/"
            >
              SIGN IN
            </NavLink>
          </Box>
        )}
      </Flex>
    </Container>
  );
};

export default ResetPassword;
