export async function topupUserBalance(clerkId, amount) {
  try {
    const res = await fetch("/api/topup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clerkId, amount }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Topup failed');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error during topup:", error);
    throw error;
  }
}