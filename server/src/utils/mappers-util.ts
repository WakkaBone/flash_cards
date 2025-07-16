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
import { CategoryDto, CategoryModel } from "../models/category";
import { UserModel, UserModelDto } from "../models/user";
import { ReversoVerb, VerbConjugations } from "../models/verb";

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

export const mapCategoryToCategoryDto = async (
  docRef: QueryDocumentSnapshot
): Promise<CategoryDto> => {
  const categoryData = docRef.data() as CategoryModel;

  const cards = await CardsService.getCards({ category: docRef.id });

  const categoryDto: CategoryDto = {
    id: docRef.id,
    label: categoryData.label,
    numberOfCards: cards.length,
    createdAt: categoryData.createdAt.toDate().toISOString(),
    updatedAt: (categoryData.updatedAt as Timestamp).toDate().toISOString(),
    ownerIds: categoryData.ownerIds,
  };

  return categoryDto;
};

export const mapUserToUserDto = async (
  docRef: QueryDocumentSnapshot
): Promise<UserModelDto> => {
  const userData = docRef.data() as UserModel;

  const userCards = await CardsService.getCards({ ownerId: docRef.id });

  return {
    id: docRef.id,
    username: userData.username,
    numberOfCards: userCards.length,
    lastPractice: (userData.lastPractice as Timestamp).toDate().toISOString(),
    createdAt: (userData.createdAt as Timestamp).toDate().toISOString(),
    currentStreak: userData.currentStreak,
    longestStreak: userData.longestStreak,
    role: userData.role,
  };
};

export const mapReversoVerbToConjugationsObj = (
  conjugations: ReversoVerb
): VerbConjugations => {
  const { infinitive, verbForms } = conjugations;
  const { 0: present, 1: past, 2: future } = verbForms;

  const {
    0: present_singular_male,
    1: present_singular_female,
    2: present_plural_male,
    3: present_plural_female,
  } = present.verbs;

  const {
    0: past_1_singular,
    1: past_2_singular_male,
    2: past_2_singular_female,
    3: past_3_singular_male,
    4: past_3_singular_female,
    5: past_1_plural,
    6: past_2_plural_male,
    7: past_2_plural_female,
    8: past_3_plural,
  } = past.verbs;

  const {
    0: future_1_singular,
    1: future_2_singular_male,
    2: future_2_singular_female,
    3: future_3_singular_male,
    4: future_1_plural,
    5: future_2_plural_male,
    6: future_2_plural_female,
    7: future_3_plural_male,
    8: future_3_plural_female,
  } = future.verbs;

  return {
    infinitive,
    present: {
      singular: {
        male: present_singular_male,
        female: present_singular_female,
      },
      plural: {
        male: present_plural_male,
        female: present_plural_female,
      },
    },
    past: {
      1: {
        singular: past_1_singular,
        plural: past_1_plural,
      },
      2: {
        singular: {
          male: past_2_singular_male,
          female: past_2_singular_female,
        },
        plural: {
          male: past_2_plural_male,
          female: past_2_plural_female,
        },
      },
      3: {
        singular: {
          male: past_3_singular_male,
          female: past_3_singular_female,
        },
        plural: past_3_plural,
      },
    },
    future: {
      1: {
        singular: future_1_singular,
        plural: future_1_plural,
      },
      2: {
        singular: {
          male: future_2_singular_male,
          female: future_2_singular_female,
        },
        plural: {
          male: future_2_plural_male,
          female: future_2_plural_female,
        },
      },
      3: {
        singular: {
          male: future_3_singular_male,
          female: "",
        },
        plural: {
          male: future_3_plural_male,
          female: future_3_plural_female,
        },
      },
    },
  };
};
