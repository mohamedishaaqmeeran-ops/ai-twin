// src/pages/pro/proData.js

export const PRO_LIMITS = {
  maxTwins: 3,
  maxProducts: 100,
  maxPlatforms: 4,
};

export const getProTwins = () => {
  return JSON.parse(localStorage.getItem("proTwins") || "[]");
};

export const saveProTwins = (twins) => {
  localStorage.setItem("proTwins", JSON.stringify(twins));
};

export const getProProducts = () => {
  return JSON.parse(localStorage.getItem("proProducts") || "[]");
};

export const saveProProducts = (products) => {
  localStorage.setItem("proProducts", JSON.stringify(products));
};

export const getConnectedPlatforms = () => {
  return JSON.parse(localStorage.getItem("proPlatforms") || "[]");
};

export const saveConnectedPlatforms = (platforms) => {
  localStorage.setItem("proPlatforms", JSON.stringify(platforms));
};