import {
  getDocs,
  addDoc,
  collection,
  query,
  where,
  getDoc,
  updateDoc,
  deleteDoc,
  limit,
  Timestamp,
  doc,
  serverTimestamp,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS, MAIN_CATEGORIES } from "../constants";
import { CategoryDto, CategoryModel } from "../models/category";
import { CardsService } from "./cards-service";

export type GetCategoriesFilters = {
  search?: string;
  searchExact?: string;
  from?: Date;
  to?: Date;
  numberOfCards?: number;
  page?: number;
  pageSize?: number;
  ownerId?: string;
};

export const CategoriesService = {
  mapCategoryToCategoryDto: async function (
    docRef: QueryDocumentSnapshot
  ): Promise<CategoryDto> {
    const categoryData = docRef.data() as CategoryModel;
    const cards = await CardsService.getCards({ category: docRef.id });
    const categoryDto: CategoryDto = {
      id: docRef.id,
      label: categoryData.label,
      numberOfCards: cards.length,
      createdAt: categoryData.createdAt.toDate().toISOString(),
      updatedAt: (categoryData.updatedAt as Timestamp).toDate().toISOString(),
    };
    return categoryDto;
  },

  getMainCategories: async function (): Promise<CategoryDto[]> {
    return await Promise.all(
      Object.values(MAIN_CATEGORIES).map(async (id) => {
        const categoryDoc = await getDoc(doc(db, COLLECTIONS.categories, id));
        return this.mapCategoryToCategoryDto(categoryDoc);
      })
    );
  },

  getCategories: async function (
    filters: GetCategoriesFilters
  ): Promise<CategoryDto[]> {
    let queryRef = query(collection(db, COLLECTIONS.categories));
    const queries = [];

    if (filters.ownerId) {
      queries.push(where("ownerIds", "array-contains", filters.ownerId));
    }

    if (filters.searchExact) {
      queries.push(where("label", "==", filters.searchExact));
    }

    if (filters.from) {
      queries.push(where("updatedAt", ">", Timestamp.fromDate(filters.from)));
    }
    if (filters.to) {
      queries.push(where("updatedAt", "<", Timestamp.fromDate(filters.to)));
    }

    //TODO: pagination
    if (filters.page && filters.pageSize) {
      queries.push(limit(filters.pageSize));
    }

    const { docs } = await getDocs(query(queryRef, ...queries));

    let categories = await Promise.all(
      docs.map(async (doc) => await this.mapCategoryToCategoryDto(doc))
    );

    if (filters.numberOfCards) {
      categories = categories.filter(
        ({ numberOfCards }) => numberOfCards >= filters.numberOfCards
      );
    }

    if (filters.search) {
      return categories.filter((card) => {
        const searchableFields = ["label"];
        return searchableFields.some((field) =>
          card[field]
            ? card[field]
                .trim()
                .toLowerCase()
                .includes(filters.search.trim().toLowerCase())
            : false
        );
      });
    }

    if (filters.ownerId) {
      const mainCategories = await this.getMainCategories();
      return [...mainCategories, ...categories];
    }

    return categories;
  },

  getCategoryById: async (id: string): Promise<CategoryModel> => {
    const categoryRef = doc(db, COLLECTIONS.categories, id);
    const response = (await getDoc(categoryRef)).data();
    return response as CategoryModel;
  },

  addCategory: async (category: CategoryModel): Promise<void> => {
    await addDoc(collection(db, COLLECTIONS.categories), category);
  },

  updateCategory: async (
    id: string,
    category: Partial<CategoryModel>
  ): Promise<void> => {
    const categoryRef = doc(db, COLLECTIONS.categories, id);
    await updateDoc(categoryRef, category);
  },

  updateUpdatedAt: async (id: string): Promise<void> => {
    const categoryRef = doc(db, COLLECTIONS.categories, id);
    await updateDoc(categoryRef, { updatedAt: serverTimestamp() });
  },

  deleteCategory: async (id: string): Promise<void> => {
    const categoryRef = doc(db, COLLECTIONS.categories, id);
    await deleteDoc(categoryRef);
  },
};
