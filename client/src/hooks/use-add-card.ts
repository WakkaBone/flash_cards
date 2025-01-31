import { useMutation } from "@tanstack/react-query";
import { addCardMutation } from "../mutations/add-card-mutation";

export const useAddCard = () => {
  const addCard = useMutation(addCardMutation);
  return addCard;
};
