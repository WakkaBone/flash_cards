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
} from "firebase/firestore";
import { db } from "../config/firebase";
import { COLLECTIONS } from "../constants";
import { CategoryDto, CategoryModel } from "../models/category";

export type GetCategoriesFilters = {
  search?: string;
  searchExact?: string;
  from?: Date;
  to?: Date;
  page?: number;
  pageSize?: number;
};

export const CategoriesService = {
  getCategories: async (filters: GetCategoriesFilters) => {
    let queryRef = query(collection(db, COLLECTIONS.categories));
    const queries = [];

    if (filters.searchExact) {
      queries.push(where("label", "==", filters.searchExact));
    }

    if (filters.from) {
      queries.push(where("createdAt", ">", Timestamp.fromDate(filters.from)));
    }
    if (filters.to) {
      queries.push(where("createdAt", "<", Timestamp.fromDate(filters.to)));
    }

    //TODO pagination
    if (filters.page && filters.pageSize) {
      queries.push(limit(filters.pageSize));
    }

    const { docs } = await getDocs(query(queryRef, ...queries));

    const categories = docs.map((doc) => {
      const categoryData = doc.data() as CategoryModel;
      const categoryDto: CategoryDto = {
        id: doc.id,
        label: categoryData.label,
        //TODO implement: count
        numberOfCards: 0,
        createdAt: categoryData.createdAt.toDate().toISOString(),
        updatedAt: categoryData.createdAt.toDate().toISOString(),
      };
      return categoryDto;
    });

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

    return categories;
  },

  getCategoryById: async (id: string) => {
    const categoryRef = doc(db, COLLECTIONS.categories, id);
    const response = (await getDoc(categoryRef)).data();
    return response as CategoryModel;
  },

  addCategory: async (category: CategoryModel) => {
    const response = await addDoc(
      collection(db, COLLECTIONS.categories),
      category
    );
    return response;
  },

  updateCategory: async (id: string, category: CategoryModel) => {
    const categoryRef = doc(db, COLLECTIONS.categories, id);
    await updateDoc(categoryRef, category);
  },

  updateUpdatedAt: async (id: string) => {
    const categoryRef = doc(db, COLLECTIONS.categories, id);
    await updateDoc(categoryRef, { updatedAt: Timestamp.now() });
  },

  deleteCategory: async (id: string) => {
    const categoryRef = doc(db, COLLECTIONS.categories, id);
    await deleteDoc(categoryRef);
  },
};
