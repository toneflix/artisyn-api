# Artisyn Data Models

This directory contains the core data models for the Artisyn platform. These models serve as the foundation for the backend API and define the structure of the data stored in the database.

## Overview

The data models are implemented using Prisma ORM with TypeScript for type safety. The models include:

- **User**: Represents both regular users (finders) and curators
- **Curator**: Extends the User model with curator-specific information
- **Category**: Main categories for artisans
- **Subcategory**: Subcategories within main categories
- **Artisan**: Artisan services or products
- **Location**: Geospatial data for users and artisans
- **Review**: User reviews for curators and artisans
- **Tip**: Payments between users

## Directory Structure

- `interfaces.ts`: TypeScript interfaces for all models
- `validation.ts`: Validation rules for model data
- `__tests__/`: Unit tests for models

## Database Schema

The database schema is defined in `prisma/schema.prisma`. This file contains the Prisma schema definition for all models, including their fields, relationships, and indexes.

## Validation

Model validation is implemented using express-validator. The validation rules are defined in `validation.ts` and are used to validate incoming request data before it is processed by the controllers.

## Testing

Unit tests for the models are located in the `__tests__/` directory. These tests ensure that the models behave as expected and that the database constraints are enforced correctly.

## Usage

To use these models in your code, import the Prisma client and the relevant interfaces:

```typescript
import prisma from '../database/client';
import { IUser, UserRole } from './interfaces';

// Example: Create a new user
async function createUser(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>) {
  return prisma.user.create({
    data: userData,
  });
}

// Example: Find a user by ID
async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}
```

## Documentation

For a complete overview of the database schema, including entity relationships and indexing strategy, see the [schema documentation](../../docs/schema.md).
