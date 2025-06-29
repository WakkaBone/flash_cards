export const ROUTES = {
  login: "/login",
  signup: "/signup",
  addCard: "/add",
  practice: "/practice",
  categories: "/categories",
  statistics: "/statistics",
  users: "/users",
  myAccount: "/my-account",
};

export const MAIN_CATEGORIES = {
  noun: "1",
  adjective: "2",
  verb: "3",
  other: "4",
};

export const TOAST_CONTAINERS_IDS = {
  addCard: "add-card",
  card: "card",
  cardsTable: "cards-table",
  categoriesTable: "categories-table",
  editCard: "edit-card",
  myAccount: "my-account",
  usersTable: "users-table",
  auth: "auth",
  signup: "signup",
};

export const QUERY_KEYS = {
  cards: "cards",
  randomCard: "random-card",
  verbConjugations: "verb-conjugations",
  statistics: "statistics",
  statisticsAdmin: "statistics-admin",
  cardsDynamics: "cards-dynamics",
  usersDynamics: "users-dynamics",
  timeline: "timeline",
  categories: "categories",
  users: "users",
  serverVersion: "server-app-version",
};

export const APIS = {
  auth: "/auth",
  cards: "/cards",
  statistics: "/statistics",
  categories: "/categories",
  users: "/users",
  version: "/version",
};

export const FORM_IDS = {
  addUser: "add-user-form",
  editUser: "edit-user-form",
  editCategory: "edit-category-form",
  addCard: "add-card-form",
  editCard: "edit-card-form",
  userAccount: "user-account-form",
};

export const NIQQUD_REGEXP = /[\u05B0-\u05BD\u05BF\u05C1\u05C2\u05C7]/g;
