export const generateSlug = (name) => {
  const baseSlug =
    name
      .toLowerCase()
      .normalize("NFD") // Normalize accents
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, "") || "n-a"; // Remove leading/trailing hyphens, fallback

  const uniqueSuffix =
    Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

  return `${baseSlug}-${uniqueSuffix}`;
};
