import {
  defaultValidationRules,
  type ValidationErrors,
  type ValidationResult,
  type ValidationRules,
} from "./types";
import moment from "moment";

export function validateEmail(email: string): ValidationResult {
  if (!email) return { valid: false, message: "Email is required" };
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email)
    ? { valid: true }
    : { valid: false, message: "Please enter a valid email address" };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) return { valid: false, message: "Password is required" };
  if (password.length < 8)
    return { valid: false, message: "Password must be at least 8 characters" };
  // if (!/[A-Za-z]/.test(password))
  //   return { valid: false, message: "Password must contain at least one letter" };
  // if (!/[0-9]/.test(password))
  //   return { valid: false, message: "Password must contain at least one number" };
  return { valid: true };
}

export function validateName(name: string): ValidationResult {
  if (!name) return { valid: false, message: "Full name is required" };
  if (name.trim().length < 2)
    return { valid: false, message: "Please enter your full name" };
  return { valid: true };
}

export function validateConfirmPassword(
  password: string,
  confirm: string
): ValidationResult {
  if (!confirm)
    return { valid: false, message: "Please confirm your password" };
  return password === confirm
    ? { valid: true }
    : { valid: false, message: "Passwords do not match" };
}

export const formattedDate = (date: string | Date) => {
  if (!date) return "";
  return moment(date).format("Do MMM YYYY");
};

export const validateField = (
  name: string,
  value: string | string[],
  rules: ValidationRules = defaultValidationRules
): string => {
  switch (name) {
    case "title":
      if (!value || (typeof value === "string" && !value.trim())) {
        return "Title is required";
      }
      if (
        typeof value === "string" &&
        value.trim().length < rules.minTitleLength
      ) {
        return `Title must be at least ${rules.minTitleLength} characters long`;
      }
      if (
        typeof value === "string" &&
        value.trim().length > rules.maxTitleLength
      ) {
        return `Title must be less than ${rules.maxTitleLength} characters`;
      }
      return "";

    case "content":
      if (!value || (typeof value === "string" && !value.trim())) {
        return "Content is required";
      }
      if (
        typeof value === "string" &&
        value.trim().length < rules.minContentLength
      ) {
        return `Content must be at least ${rules.minContentLength} characters long`;
      }
      if (
        typeof value === "string" &&
        value.trim().length > rules.maxContentLength
      ) {
        return `Content must be less than ${rules.maxContentLength} characters`;
      }
      return "";

    case "tags":
      if (!Array.isArray(value) || value.length === 0) {
        return "At least one tag is required";
      }
      if (value.length > rules.maxTags) {
        return `Maximum ${rules.maxTags} tags allowed`;
      }
      for (const tag of value) {
        if (tag.length < rules.minTagLength) {
          return `Each tag must be at least ${rules.minTagLength} characters long`;
        }
        if (tag.length > rules.maxTagLength) {
          return `Each tag must be less than ${rules.maxTagLength} characters`;
        }
        if (!/^[a-zA-Z0-9\s\-_]+$/.test(tag)) {
          return "Tags can only contain letters, numbers, spaces, hyphens, and underscores";
        }
      }
      return "";

    default:
      return "";
  }
};

export const validateForm = (
  title: string,
  content: string,
  tags: string[],
  rules: ValidationRules = defaultValidationRules
): ValidationErrors => {
  return {
    title: validateField("title", title, rules),
    content: validateField("content", content, rules),
    tags: validateField("tags", tags, rules),
  };
};

export const isFormValid = (errors: ValidationErrors): boolean => {
  return !errors.title && !errors.content && !errors.tags;
};

export const getTitleValidationStatus = (
  title: string,
  rules: ValidationRules = defaultValidationRules
) => {
  const length = title.length;
  const isValid =
    length >= rules.minTitleLength && length <= rules.maxTitleLength;
  return { length, isValid, maxLength: rules.maxTitleLength };
};

export const getContentValidationStatus = (
  content: string,
  rules: ValidationRules = defaultValidationRules
) => {
  const length = content.length;
  const isValid =
    length >= rules.minContentLength && length <= rules.maxContentLength;
  return { length, isValid, maxLength: rules.maxContentLength };
};

export const getTagsValidationStatus = (
  tags: string[],
  rules: ValidationRules = defaultValidationRules
) => {
  const count = tags.length;
  const isValid = count > 0 && count <= rules.maxTags;
  return { count, isValid, maxCount: rules.maxTags };
};
