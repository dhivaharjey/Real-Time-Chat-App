import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/react";
import React, { memo } from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  console.log("UserBadgeItem");
  return (
    <>
      <Badge
        py={2}
        px={2}
        borderRadius="lg"
        m={1}
        mb={2}
        variant="solid"
        fontSize={12}
        textTransform="none"
        colorScheme="yellow"
        cursor="pointer"
        onClick={handleFunction}
      >
        {user.name}

        <CloseIcon pl={1} />
      </Badge>
    </>
  );
};

export default memo(UserBadgeItem);
