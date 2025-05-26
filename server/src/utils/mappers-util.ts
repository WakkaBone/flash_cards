import {
  QueryDocumentSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { CardModel, CardModelDto, Priorities } from "../models/card";
import { CategoriesService } from "../services/categories-service";
import { CSV_FIELD_NAMES } from "../constants";
import { isEnglish, isHebrew } from "../validators/cards/validations";
import { CardsService } from "../services/cards-service";

const priorityReverseMapper: Record<string, Priorities> = {
  Low: Priorities.Low,
  Medium: Priorities.Medium,
  High: Priorities.High,
};

export const getInitialSrsValues = () => ({
  easinessFactor: 2.5,
  interval: 1,
  repetitions: 1,
  lastReviewDate: serverTimestamp(),
});

export const mapCardToCardDto = async (
  doc: QueryDocumentSnapshot
): Promise<CardModelDto> => {
  const cardData = doc.data() as CardModel;

  const category = await CategoriesService.getCategoryById(cardData.category);

  const cardDto: CardModelDto = {
    id: doc.id,
    ...cardData,
    category: { id: cardData.category, label: category.label },
    createdAt: cardData.createdAt.toDate().toISOString(),
  };

  return cardDto;
};

export const mapCsvEntryToCardModel = async (
  card: Record<string, string>,
  userId: string
): Promise<CardModel> => {
  const requiredFields = [
    CSV_FIELD_NAMES.english,
    CSV_FIELD_NAMES.hebrew,
    CSV_FIELD_NAMES.category,
  ];
  requiredFields.forEach((field) => {
    if (!card[field]) throw new Error(`${field} field is missing`);
  });

  //validate translations
  if (!isHebrew(card[CSV_FIELD_NAMES.hebrew]))
    throw new Error("Hebrew translation is invalid");
  if (!isEnglish(card[CSV_FIELD_NAMES.english]))
    throw new Error("English translation is invalid");

  //validate category
  const categories = await CategoriesService.getCategories({
    searchExact: card[CSV_FIELD_NAMES.category],
  });
  if (!categories.length)
    throw new Error(`Category ${card[CSV_FIELD_NAMES.category]} doesn't exist`);

  //validate priority
  if (
    card[CSV_FIELD_NAMES.priority] &&
    !priorityReverseMapper[card[CSV_FIELD_NAMES.priority]]
  )
    throw new Error(`Priority ${card[CSV_FIELD_NAMES.priority]} doesn't exist`);

  //validate isLearned
  if (
    card[CSV_FIELD_NAMES.isLearned] &&
    card[CSV_FIELD_NAMES.isLearned] !== "TRUE" &&
    card[CSV_FIELD_NAMES.isLearned] !== "FALSE"
  )
    throw new Error(
      `${card[CSV_FIELD_NAMES.isLearned]} is not a valid value for Is Learned`
    );

  //validate uniqueness
  const sameWords = await CardsService.getCards({
    ownerId: userId,
    searchExact: card[CSV_FIELD_NAMES.english],
  });
  if (sameWords.length > 0)
    throw new Error(`The word ${card[CSV_FIELD_NAMES.english]} already exists`);

  const newCard: CardModel = {
    category: categories[0].id,
    english: card[CSV_FIELD_NAMES.english],
    hebrew: card[CSV_FIELD_NAMES.hebrew],
    details: card[CSV_FIELD_NAMES.details] || "",
    statistics: { wrong: 0, correct: 0 },
    isLearned: card[CSV_FIELD_NAMES.isLearned] === "TRUE",
    priority: card[CSV_FIELD_NAMES.priority]
      ? priorityReverseMapper[card[CSV_FIELD_NAMES.priority]]
      : Priorities.Medium,
    createdAt: Timestamp.now(),
    ...getInitialSrsValues(),
    ownerIds: [userId],
  };

  return newCard;
};
