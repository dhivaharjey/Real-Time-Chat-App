import { Avatar, Badge, Box, Text } from "@chakra-ui/react";
import React, { memo } from "react";

const ChatsListModal = ({ user, notify }) => {
  return (
    <>
      <Box display="flex" flexDir="column">
        <Box display="flex" alignItems="center">
          <Avatar
            // borderRadius="full"
            size="sm"
            src={user?.picture}
            boxShadow="dark-lg"
            alt={user?.name}
          />
          <Text px={4}>{user?.name}</Text>
        </Box>

        <Box position="absolute" right="1px" top="10px" px={1}>
          {notify?.length > 0 ? (
            <Badge
              paddingInline="6px"
              position="absolute"
              right="1px"
              top="0px"
              borderRadius="full"
              color="whiteAlpha.900"
              bgColor="red.500"
            >
              {notify?.length}
            </Badge>
          ) : null}
        </Box>
      </Box>
    </>
  );
};

export default memo(ChatsListModal);
