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

// 2. FOR UPDATE - PUT /movies/:id
// Client can send title, director, year, watched
// But CANNOT send id, createdAt, updatedAt
// Fields are optional, but if sent, must be valid
export function validateUpdateMovie(data) {
  if (data.id !== undefined || data.createdAt !== undefined || data.updatedAt !== undefined) {
    return { valid: false, message: "You cannot change id, createdAt or updatedAt." };
  }

  if (data.title !== undefined) {
    if (isEmpty(data.title)) {
        return { valid: false, message: "Title cannot be empty" }
    };
    if (typeof data.title !== 'string') {
        return { valid: false, message: "Title must be a string" }
    };
  }

  if (data.director !== undefined) {
    if (isEmpty(data.director)) {
        return { valid: false, message: "Director cannot be empty" }
    };
    if (typeof data.director !== 'string') {
        return { valid: false, message: "Director must be a string" }
    };
  }

  if (data.year !== undefined) {
    if (typeof data.year !== 'number') {
        return { valid: false, message: "Year must be a number" }
    };
    if (!Number.isInteger(data.year) || data.year < 1888 || data.year > 2026) {
      return { valid: false, message: "Year must be between 1888 and 2026" };
    }
  }

  // This is how watched feature works - only allowed on UPDATE, not on CREATE
  if (data.watched !== undefined && typeof data.watched !== 'boolean') {
    return { valid: false, message: "Watched must be a boolean (true or false)" };
  }

  return { valid: true };
}

// i used cjs first but figured it might cause an error.
// module.exports = {
//   validateCreateMovie,
//   validateUpdateMovie
// };

