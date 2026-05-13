export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecialChar: /[!@#$%^&*()_+=\[\]{};':"\\|,.<>\/?]/,
};

export const PASSWORD_ERROR_MESSAGES = {
  minLength: 'Password needs to be at least 8 characters long',
  upperCase: 'Password needs to contain at least 1 uppercase letter (A-Z)',
  lowerCase: 'Password needs to contain at least 1 lowercase letter (a-z)',
  number: 'Password needs to contain at least 1 number (0-9)',
  specialChar: 'Password needs to contain at least 1 special character (!@#$%^&* etc.)',
};

export const STUDENT_ID_PATTERN = /^\d{3}[A-Z]{2}\d{3}[A-Z]{2}$/;
export const STUDENT_ID_FORMAT = '3 digits + 2 uppercase letters + 3 digits + 2 uppercase letters (e.g., 252FC251LC)';

export const STUDENT_EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@student\.mmu\.edu\.my$/;
export const STUDENT_EMAIL_DOMAIN = 'student.mmu.edu.my';

/**
 * 
 * @param password - 
 * @returns { isValid: boolean, errors: string[] }
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
  score: number;
} {
  const errors: string[] = [];
  let score = 0;

  if (!password) {
    return { isValid: false, errors: ['Password cannot be empty'], score: 0 };
  }

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(PASSWORD_ERROR_MESSAGES.minLength);
  } else {
    score += 1;
  }

  if (!PASSWORD_REQUIREMENTS.hasUpperCase.test(password)) {
    errors.push(PASSWORD_ERROR_MESSAGES.upperCase);
  } else {
    score += 1;
  }

  if (!PASSWORD_REQUIREMENTS.hasLowerCase.test(password)) {
    errors.push(PASSWORD_ERROR_MESSAGES.lowerCase);
  } else {
    score += 1;
  }

  if (!PASSWORD_REQUIREMENTS.hasNumber.test(password)) {
    errors.push(PASSWORD_ERROR_MESSAGES.number);
  } else {
    score += 1;
  }

  if (!PASSWORD_REQUIREMENTS.hasSpecialChar.test(password)) {
    errors.push(PASSWORD_ERROR_MESSAGES.specialChar);
  } else {
    score += 1;
  }

  return {
    isValid: errors.length === 0,
    errors,
    score
  };
}

/**
 * 
 * @param studentId - 
 * @returns { isValid: boolean, error: string | null }
 */
export function validateStudentId(studentId: string): {
  isValid: boolean;
  error: string | null;
} {
  if (!studentId) {
    return { isValid: false, error: 'Student ID cannot be empty' };
  }

  if (!STUDENT_ID_PATTERN.test(studentId)) {
    return {
      isValid: false,
      error: `Student ID format is invalid. Should be:${STUDENT_ID_FORMAT}`
    };
  }

  return { isValid: true, error: null };
}

/**
 * 
 * @param email -
 * @returns { isValid: boolean, error: string | null }
 */
export function validateStudentEmail(email: string): {
  isValid: boolean;
  error: string | null;
} {
  if (!email) {
    return { isValid: false, error: 'Email cannot be empty' };
  }

  if (!STUDENT_EMAIL_PATTERN.test(email)) {
    return {
      isValid: false,
      error: `Email must use the official MMU email domain (${STUDENT_EMAIL_DOMAIN})`
    };
  }

  return { isValid: true, error: null };
}

/**
 *
 * @param name 
 * @returns { isValid: boolean, error: string | null }
 */
export function validateName(name: string, fieldName: string = 'Name'): {
  isValid: boolean;
  error: string | null;
} {
  if (!name || name.trim() === '') {
    return { isValid: false, error: `${fieldName} cannot be empty` };
  }

  if (name.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
  }

  if (name.length > 50) {
    return { isValid: false, error: `${fieldName} cannot exceed 50 characters` };
  }

  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }

  return { isValid: true, error: null };
}

/**
 * 
 */
export function validateSignupForm(data: {
  firstName: string;
  lastName: string;
  studentId: string;
  studentEmail: string;
  password: string;
  confirmPassword?: string;
}): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};


  const firstNameValidation = validateName(data.firstName, 'First Name');
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.error || '';
  }

  
  const lastNameValidation = validateName(data.lastName, 'Last Name');
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.error || '';
  }

  
  const studentIdValidation = validateStudentId(data.studentId);
  if (!studentIdValidation.isValid) {
    errors.studentId = studentIdValidation.error || '';
  }

  
  const studentEmailValidation = validateStudentEmail(data.studentEmail);
  if (!studentEmailValidation.isValid) {
    errors.studentEmail = studentEmailValidation.error || '';
  }

  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors.join('; ');
  }

  
  if (data.confirmPassword && data.password !== data.confirmPassword) {
    errors.confirmPassword = 'The passwords you entered do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * 
 */
export function validateLoginForm(data: {
  email: string;
  password: string;
}): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email cannot be empty';
  }

  if (!data.password || data.password.trim() === '') {
    errors.password = 'Password cannot be empty';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
