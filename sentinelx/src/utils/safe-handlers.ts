import React from 'react';

/**
 * Safe event handler utility to prevent undefined value errors
 */

export const safeInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  try {
    const value = e?.target?.value ?? '';
    console.log("SAFE INPUT CHANGE:", value);
    setter(value);
  } catch (error) {
    console.error("Error in safeInputChange:", error);
    setter('');
  }
};

export const safeCheckboxChange = (setter: (value: boolean) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
  try {
    const checked = e?.target?.checked ?? false;
    console.log("SAFE CHECKBOX CHANGE:", checked);
    setter(checked);
  } catch (error) {
    console.error("Error in safeCheckboxChange:", error);
    setter(false);
  }
};

export const safeSelectChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
  try {
    const value = e?.target?.value ?? '';
    console.log("SAFE SELECT CHANGE:", value);
    setter(value);
  } catch (error) {
    console.error("Error in safeSelectChange:", error);
    setter('');
  }
};

export const safeNumberChange = (setter: (value: number) => void, defaultValue: number = 0) => (e: React.ChangeEvent<HTMLInputElement>) => {
  try {
    const value = e?.target?.value ?? defaultValue;
    const numValue = parseInt(value) || defaultValue;
    console.log("SAFE NUMBER CHANGE:", numValue);
    setter(numValue);
  } catch (error) {
    console.error("Error in safeNumberChange:", error);
    setter(defaultValue);
  }
};
