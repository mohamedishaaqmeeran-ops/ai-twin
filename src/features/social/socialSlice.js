const API = "https://twinn-backend.onrender.com/api/social";

export const getConnectionsAPI = async () => {
  const res = await fetch(`${API}/connections`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch connections");
  }

  return data.data || [];
};

export const disconnectAPI = async (platform) => {
  const res = await fetch(`${API}/connections/${platform}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to disconnect");
  }

  return data;
};

export const connectAPI = (platform) => {
  window.location.href = `${API}/connect/${platform}`;
};