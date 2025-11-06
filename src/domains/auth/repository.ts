// Auth Repository - Data access layer for authentication
// Follows Repository Pattern (architecture-patterns.md Section 4.1)

import { prisma } from '@/lib/db';
import type { User } from '@prisma/client';

export const authRepository = {
  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email }
    });
  },

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    });
  },

  /**
   * Create new user
   */
  async create(data: {
    email: string;
    passwordHash: string;
    name?: string;
  }): Promise<User> {
    return prisma.user.create({
      data
    });
  },

  /**
   * Update user's last login timestamp
   */
  async updateLastLogin(userId: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() }
    });
  },

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: { name?: string; email?: string }
  ): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data
    });
  },

  /**
   * Delete user account
   */
  async delete(userId: string): Promise<User> {
    return prisma.user.delete({
      where: { id: userId }
    });
  }
};
