export const normalizeRole = (
  value
) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(
      /[\s_-]/g,
      ""
    );

export const normalizePlan = (
  value
) => {
  const plan =
    String(value || "")
      .trim()
      .toLowerCase()
      .replace(
        /[\s_-]/g,
        ""
      );

  const aliases = {
    free: "free",
    starter: "starter",
    pro: "pro",
    professional: "pro",
    business: "business",
    agency: "agency",
  };

  return aliases[plan] || "free";
};

export const isInternalRole = (
  role
) =>
  [
    "admin",
    "manager",
  ].includes(
    normalizeRole(role)
  );

export const isBrandCreator = (
  role
) =>
  normalizeRole(role) ===
  "brandcreator";

export const canManageCreatorFeatures = (
  role
) =>
  isInternalRole(role) ||
  isBrandCreator(role);

export const canManageProducts = (
  role
) =>
  canManageCreatorFeatures(
    role
  );

export const canUseRealtime = (
  role
) =>
  canManageCreatorFeatures(
    role
  );

export const canGoLive = (
  role
) =>
  canManageCreatorFeatures(
    role
  );

export const canManageSocial = (
  role
) =>
  canManageCreatorFeatures(
    role
  );

export const isAdmin = (
  role
) =>
  normalizeRole(role) ===
  "admin";