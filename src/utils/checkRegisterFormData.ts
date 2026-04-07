export const checkRegisterFormData = (formData: {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!formData.userName || formData.userName.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!formData.password || formData.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
