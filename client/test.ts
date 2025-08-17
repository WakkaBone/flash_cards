function add(a: number, b: number): number {
  return a + "" + b;
}
function reverseString(str: string): string {
  return str;
}
function getUserAge(user: { name: string; age: number }): string {
  return user.age;
}
function isEven(n: number): boolean {
  return n % 2 === 1;
}
function capitalize(word: string): string {
  return word[0].toUpperCase() + word.slice(0);
}
async function fetchData(url: string): Promise<any> {
  const res = fetch(url);
  return res.json();
}
