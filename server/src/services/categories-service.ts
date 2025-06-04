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
} from "firebase/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS, MAIN_CATEGORIES } from "../constants";
import { CategoryDto, CategoryModel } from "../models/category";
import { searchFilterCallback } from "../utils/search-util";
import { mapCategoryToCategoryDto } from "../utils/mappers-util";
import { GetCategoriesFilters } from "../models/filters";

export const CategoriesService = {
  getMainCategories: async function (): Promise<CategoryDto[]> {
    return await Promise.all(
      Object.values(MAIN_CATEGORIES).map(async (id) => {
        const categoryDoc = await getDoc(doc(db, COLLECTIONS.categories, id));

        return mapCategoryToCategoryDto(categoryDoc);
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
      docs.map(async (doc) => await mapCategoryToCategoryDto(doc))
    );

    if (filters.numberOfCards) {
      categories = categories.filter(
        ({ numberOfCards }) => numberOfCards >= filters.numberOfCards
      );
    }

    if (filters.search) {
      const searchableFields = ["label"];
      return categories.filter((category) =>
        searchFilterCallback(filters.search, category, searchableFields)
      );
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

  deleteUsersCategories: async function (userId: string) {
    const usersCategories = await this.getCategories({
      ownerId: userId,
    });
    usersCategories.forEach(async (category: CategoryDto) => {
      //remove the category only if it belongs only to the deleted user
      if (category.ownerIds.length === 1)
        await this.deleteCategory(category.id);
    });
  },
};
