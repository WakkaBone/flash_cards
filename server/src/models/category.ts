import { FieldValue, Timestamp } from "firebase/firestore";

export type CategoryModel = {
  label: string;
  createdAt: Timestamp;
  updatedAt: FieldValue;
  ownerIds: string[];
};

export type CategoryDto = {
  id: string;
  label: string;
  numberOfCards: number;
  createdAt: string;
  updatedAt: string;
};
