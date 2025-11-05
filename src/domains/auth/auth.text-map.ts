/**
 * Text map for authentication domain
 * All text content for login, register, and password recovery flows
 */

export const authTextMap = {
  // Login Page
  login: {
    heading: 'Welcome Back',
    email: {
      label: 'Email',
      placeholder: 'your@email.com'
    },
    password: {
      label: 'Password',
      placeholder: 'Enter your password'
    },
    rememberMe: {
      label: 'Remember me'
    },
    submit: 'Login',
    forgotPassword: 'Forgot your password?',
    noAccount: "Don't have an account?",
    register: 'Create Account',
    error: {
      invalidCredentials: 'Invalid email or password',
      generic: 'Something went wrong. Please try again.'
    }
  },

  // Register Page
  register: {
    heading: 'Create Your Account',
    email: {
      label: 'Email',
      placeholder: 'your@email.com'
    },
    password: {
      label: 'Password',
      placeholder: 'Create a password'
    },
    confirmPassword: {
      label: 'Confirm Password',
      placeholder: 'Re-enter your password'
    },
    requirements: {
      heading: 'Password must:',
      minLength: 'Be at least 8 characters',
      hasLetter: 'Contain at least one letter',
      hasNumber: 'Contain at least one number'
    },
    submit: 'Create Account',
    hasAccount: 'Already have an account?',
    login: 'Login',
    success: 'Account created successfully!',
    error: {
      emailExists: 'This email is already registered',
      passwordMismatch: 'Passwords do not match'
    }
  },

  // Password Recovery Page
  passwordRecovery: {
    heading: 'Reset Your Password',
    instructions: "We'll send a reset link to your email address",
    email: {
      label: 'Email',
      placeholder: 'your@email.com'
    },
    submit: 'Send Reset Link',
    backToLogin: 'Back to Login',
    success: {
      heading: 'Check Your Email',
      message: "We've sent a password reset link to:",
      notReceived: "Didn't receive it?",
      resend: 'Resend'
    },
    error: {
      emailNotFound: 'No account found with this email'
    }
  }
} as const;
