import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import SignUp from "../components/Authentication/SignUp";
import LogIn from "../components/Authentication/LogIn";

const HomePage = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <Container maxW="xl">
        <Box
          d="flex"
          justifyContent="center"
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
            fontSize="4xl"
            fontFamily="Work sans"
            color="black"
            textAlign="center"
            fontWeight="extrabold"
          >
            Real-Time-Chat-App
          </Text>
        </Box>
        <Box
          bg="rgba(255, 255, 255, 0.6)"
          backdropFilter="blur(10px)"
          w="100%"
          p={4}
          borderRadius="lg"
          mb="20px"
        >
          <Tabs
            variant="soft-rounded"
            colorScheme="green"
            index={tabIndex}
            onChange={(index) => setTabIndex(index)}
          >
            <TabList>
              <Tab w="50%">Sign In</Tab>
              <Tab w="50%">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <LogIn />
              </TabPanel>
              <TabPanel>
                <SignUp onSignUpSuccess={() => setTabIndex(0)} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
