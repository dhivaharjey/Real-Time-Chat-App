import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const InvalidResetPasswordToken = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Invalid Token
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Your Reset Password token is invalid !!! Try again!!
          <Button
            variant="solid"
            onClick={() => {
              navigate("/forget-password");
            }}
          >
            Forget Password
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default InvalidResetPasswordToken;
