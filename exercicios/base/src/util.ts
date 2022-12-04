export function formataValor(n: number) {
  return "R$ " + n.toFixed(2).replace(".", ",");
}