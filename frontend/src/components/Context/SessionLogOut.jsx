import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const SessionLogOut = () => {
  const navigate = useNavigate();
  return (
    <>
      <Box
        width="100%"
        height="100dvh"
        placeContent="center"
        placeItems="center"
        bg="cadetblue"
        backdropFilter="20px"
        textAlign="center"
      >
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
            Your Session is Expired !!!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Please try to LogIn again, using the button below
          </AlertDescription>
          <Button
            mt={5}
            variant="solid"
            colorScheme="red"
            onClick={() => navigate("/")}
          >
            Log In
          </Button>
        </Alert>
      </Box>
    </>
  );
};

export default SessionLogOut;
