export const pagingSkipValue = (page, itemsPerPage) => {
  if (!page || !itemsPerPage) return 0;
  if (page < 0 || itemsPerPage < 0) itemsPerPage = 12;
  return (page - 1) * itemsPerPage;
};
