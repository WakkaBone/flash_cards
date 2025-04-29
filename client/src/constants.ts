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

export const USERNAME_RULES = /^[A-Za-z0-9]+$/;
export const PASSWORD_RULES =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~\-]{8,}$/;
