export interface LocalCartItem {
  trophyId: string
  name: string
  price: number
  image: string
  quantity: number
}

export function addToLocalCart(trophy: LocalCartItem) {
  const cart: LocalCartItem[] = JSON.parse(localStorage.getItem("cart") || "[]")

  const existing = cart.find((item: LocalCartItem) => item.trophyId === trophy.trophyId)
  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({
      trophyId: trophy.trophyId,
      name: trophy.name,
      price: trophy.price,
      image: trophy.image,
      quantity: 1,
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
}

export function getLocalCart(): LocalCartItem[] {
  return JSON.parse(localStorage.getItem("cart") || "[]")
}

export function clearLocalCart() {
  localStorage.removeItem("cart")
}
