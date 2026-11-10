// validator functions

function isEmpty(value) {
  return value === undefined || value === null || (typeof value === 'string' && value.trim() === '');
}

// 1. FOR CREATE - POST /movies
// Client is ONLY allowed to send: title, director, year
export function validateCreateMovie(data) {
  if (data.id !== undefined || data.watched !== undefined || data.createdAt !== undefined || data.updatedAt !== undefined) {
    return { valid: false, message: "You cannot send id, watched, createdAt or updatedAt. They are set by the server." };
  }

  // Title - required, must be string, not empty
  if (isEmpty(data.title)) {
    return { valid: false, message: "Title is required" };
  }
  if (typeof data.title !== 'string') {
    return { valid: false, message: "Title must be a string" };
  }

  // Director - required, must be string, not empty
  if (isEmpty(data.director)) {
    return { valid: false, message: "Director is required" };
  }
  if (typeof data.director !== 'string') {
    return { valid: false, message: "Director must be a string" };
  }

  // Year - required, must be number, sensible range
  if (data.year === undefined || data.year === null) {
    return { valid: false, message: "Year is required" };
  }
  if (typeof data.year !== 'number') {
    return { valid: false, message: "Year must be a number" };
  }
  if (!Number.isInteger(data.year) || data.year < 1888 || data.year > 2026) {
    return { valid: false, message: "Year must be between 1888 and 2026" };
  }

  return { valid: true };
}

