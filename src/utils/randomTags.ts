function randomTags(arr: string[], count: number = 3): string[] {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
export default randomTags;
