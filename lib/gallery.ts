// Every photo index except the one on screen, in random order, so "new image"
// walks the whole gallery before anything repeats.
export function shuffledOrder(count: number, current: number) {
  const order = Array.from({ length: count }, (_, index) => index).filter(
    (index) => index !== current,
  );
  for (let index = order.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [order[index], order[swap]] = [order[swap], order[index]];
  }
  return order;
}
