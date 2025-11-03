export const placeOrder = async (addressIndex: number) => {
    const res = await fetch("/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressIndex }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to place order");
    return data;
};
