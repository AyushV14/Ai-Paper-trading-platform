// lib/syncUser.js
export async function syncUserToDB(userData) {
  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      console.error("Failed to sync user:", await res.text());
      return null;
    }

    const data = await res.json();
    return data.user;
  } catch (error) {
    console.error("Error syncing user:", error);
    return null;
  }
}
