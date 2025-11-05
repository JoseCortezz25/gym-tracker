'use client';

import { Check, X } from 'lucide-react';
import { authTextMap } from '../auth.text-map';

export interface PasswordRequirementsProps {
  /**
   * Password value to validate against requirements
   * In UI-only phase, this can be an empty string
   */
  password?: string;
}

interface Requirement {
  label: string;
  isValid: boolean;
}

/**
 * Password Requirements Molecule
 * Displays password validation rules with real-time feedback
 * Used in the register page
 */
export function PasswordRequirements({
  password = ''
}: PasswordRequirementsProps) {
  // Validation logic (UI-only phase, prepared for business logic)
  const requirements: Requirement[] = [
    {
      label: authTextMap.register.requirements.minLength,
      isValid: password.length >= 8
    },
    {
      label: authTextMap.register.requirements.hasLetter,
      isValid: /[a-zA-Z]/.test(password)
    },
    {
      label: authTextMap.register.requirements.hasNumber,
      isValid: /[0-9]/.test(password)
    }
  ];

  return (
    <div
      className="space-y-2 text-sm"
      role="status"
      aria-live="polite"
      aria-label="Password requirements"
    >
      <p className="font-medium text-gray-700 dark:text-gray-300">
        {authTextMap.register.requirements.heading}
      </p>
      <ul className="space-y-1">
        {requirements.map((requirement, index) => (
          <li
            key={index}
            className="flex items-center gap-2"
            aria-label={`${requirement.label}: ${requirement.isValid ? 'met' : 'not met'}`}
          >
            {requirement.isValid ? (
              <Check
                className="h-4 w-4 flex-shrink-0 text-green-600"
                aria-hidden="true"
              />
            ) : (
              <X
                className="h-4 w-4 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
            )}
            <span
              className={
                requirement.isValid
                  ? 'text-green-600 dark:text-green-500'
                  : 'text-gray-600 dark:text-gray-400'
              }
            >
              {requirement.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
