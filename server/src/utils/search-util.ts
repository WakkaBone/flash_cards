export function searchFilterCallback<T>(
  search: string,
  entity: T,
  searchableFields: string[]
) {
  return searchableFields.some((field) =>
    entity[field]
      ? entity[field].trim().toLowerCase().includes(search.trim().toLowerCase())
      : false
  );
}
