import { Box, Button, Text } from "@chakra-ui/react";
import React from "react";

const ErrorFallBack = ({ error }) => {
  return (
    <Box
      bg="antiquewhite"
      bgImage="url('./SomethingWentWrong.jpg')"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgSize="contain"
      p={3}
      borderWidth={1}
      borderRadius="md"
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      // justifyContent="center"
      flexDir="column"
    >
      <Text fontSize="lg" color="red.400" mb={2}>
        Oops! Something went wrong while loading the component:
      </Text>
    </Box>
  );
};

export default ErrorFallBack;
