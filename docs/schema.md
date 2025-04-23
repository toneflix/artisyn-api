# Artisyn Database Schema

## Overview

This document outlines the database schema for the Artisyn platform, which connects local artisans with users through community-curated listings.

## Entity Relationship Diagram

```
+----------------+       +----------------+       +----------------+
|      User      |       |    Curator     |       |    Listing     |
+----------------+       +----------------+       +----------------+
| id             |<----->| id             |       | id             |
| email          |       | userId         |       | title          |
| password       |       | verificationSt.|       | description    |
| walletAddress  |       | specialties    |       | price          |
| firstName      |       | experience     |       | priceRange     |
| lastName       |       | portfolio      |       | images         |
| role           |       | certificates   |<------| curatorId      |
| avatar         |       | verifiedAt     |       | categoryId     |
| bio            |       | createdAt      |       | subcategoryId  |
| phone          |       | updatedAt      |       | locationId     |
| createdAt      |       +----------------+       | isActive       |
| updatedAt      |                                | createdAt      |
+----------------+                                | updatedAt      |
       |                                          +----------------+
       |                                                  |
       |                                                  |
       v                                                  v
+----------------+       +----------------+       +----------------+
|    Location    |       |    Category    |       |  Subcategory   |
+----------------+       +----------------+       +----------------+
| id             |       | id             |       | id             |
| address        |       | name           |<------| name           |
| city           |       | description    |       | description    |
| state          |       | icon           |       | categoryId     |
| country        |       | createdAt      |       | createdAt      |
| postalCode     |       | updatedAt      |       | updatedAt      |
| latitude       |       +----------------+       +----------------+
| longitude      |
| createdAt      |
| updatedAt      |
+----------------+
       ^
       |
       |
+----------------+       +----------------+
|     Review     |       |      Tip       |
+----------------+       +----------------+
| id             |       | id             |
| rating         |       | amount         |
| comment        |       | currency       |
| authorId       |       | message        |
| targetId       |       | status         |
| listingId      |       | senderId       |
| createdAt      |       | receiverId     |
| updatedAt      |       | listingId      |
+----------------+       | txHash         |
                         | createdAt      |
                         | updatedAt      |
                         +----------------+
```

## Models

### User

The User model represents both regular users (finders) and curators on the platform.

- **id**: Unique identifier (UUID)
- **email**: User's email address (unique)
- **password**: Hashed password
- **walletAddress**: Blockchain wallet address (optional, unique)
- **firstName**: User's first name
- **lastName**: User's last name
- **role**: User role (USER, CURATOR, ADMIN)
- **avatar**: URL to user's profile picture (optional)
- **bio**: User's biography (optional)
- **phone**: User's phone number (optional)
- **createdAt**: Timestamp of creation
- **updatedAt**: Timestamp of last update

### Curator

The Curator model extends the User model with curator-specific information.

- **id**: Unique identifier (UUID)
- **userId**: Reference to User model (one-to-one)
- **verificationStatus**: Status of curator verification (PENDING, VERIFIED, REJECTED)
- **specialties**: Array of curator's specialties
- **experience**: Years of experience
- **portfolio**: URL to curator's portfolio (optional)
- **certificates**: Array of URLs to certificates
- **verifiedAt**: Timestamp of verification (optional)
- **createdAt**: Timestamp of creation
- **updatedAt**: Timestamp of last update

### Category

The Category model represents the main categories for listings.

- **id**: Unique identifier (UUID)
- **name**: Category name (unique)
- **description**: Category description (optional)
- **icon**: URL to category icon (optional)
- **createdAt**: Timestamp of creation
- **updatedAt**: Timestamp of last update

### Subcategory

The Subcategory model represents subcategories within main categories.

- **id**: Unique identifier (UUID)
- **name**: Subcategory name
- **description**: Subcategory description (optional)
- **categoryId**: Reference to Category model
- **createdAt**: Timestamp of creation
- **updatedAt**: Timestamp of last update

### Listing

The Listing model represents artisan services or products.

- **id**: Unique identifier (UUID)
- **title**: Listing title
- **description**: Detailed description
- **price**: Fixed price (optional)
- **priceRange**: Min and max price for variable pricing (optional)
- **images**: Array of URLs to listing images
- **curatorId**: Reference to User model (curator)
- **categoryId**: Reference to Category model
- **subcategoryId**: Reference to Subcategory model (optional)
- **locationId**: Reference to Location model
- **isActive**: Whether the listing is active
- **createdAt**: Timestamp of creation
- **updatedAt**: Timestamp of last update

### Location

The Location model stores geospatial data for users and listings.

- **id**: Unique identifier (UUID)
- **address**: Street address (optional)
- **city**: City name
- **state**: State or province
- **country**: Country name
- **postalCode**: Postal code (optional)
- **latitude**: Geographic latitude
- **longitude**: Geographic longitude
- **createdAt**: Timestamp of creation
- **updatedAt**: Timestamp of last update

### Review

The Review model represents user reviews for curators and listings.

- **id**: Unique identifier (UUID)
- **rating**: Numeric rating (1-5)
- **comment**: Review text (optional)
- **authorId**: Reference to User model (reviewer)
- **targetId**: Reference to User model (reviewed curator)
- **listingId**: Reference to Listing model (optional)
- **createdAt**: Timestamp of creation
- **updatedAt**: Timestamp of last update

### Tip

The Tip model represents payments between users.

- **id**: Unique identifier (UUID)
- **amount**: Tip amount
- **currency**: Currency code (default: ETH)
- **message**: Message from sender (optional)
- **status**: Tip status (PENDING, COMPLETED, CANCELLED, REFUNDED)
- **senderId**: Reference to User model (sender)
- **receiverId**: Reference to User model (receiver)
- **listingId**: Reference to Listing model (optional)
- **txHash**: Blockchain transaction hash (optional)
- **createdAt**: Timestamp of creation
- **updatedAt**: Timestamp of last update

## Relationships

- **User-Curator**: One-to-one relationship. A user can have one curator profile.
- **User-Listing**: One-to-many relationship. A curator can have multiple listings.
- **Category-Subcategory**: One-to-many relationship. A category can have multiple subcategories.
- **Category-Listing**: One-to-many relationship. A category can have multiple listings.
- **Subcategory-Listing**: One-to-many relationship. A subcategory can have multiple listings.
- **Location-User**: One-to-many relationship. A location can be associated with multiple users.
- **Location-Listing**: One-to-many relationship. A location can have multiple listings.
- **User-Review (author)**: One-to-many relationship. A user can write multiple reviews.
- **User-Review (target)**: One-to-many relationship. A user can receive multiple reviews.
- **Listing-Review**: One-to-many relationship. A listing can have multiple reviews.
- **User-Tip (sender)**: One-to-many relationship. A user can send multiple tips.
- **User-Tip (receiver)**: One-to-many relationship. A user can receive multiple tips.
- **Listing-Tip**: One-to-many relationship. A listing can have multiple tips.

## Indexing Strategy

The following fields are indexed to improve query performance:

- **User**: email, walletAddress, role
- **Curator**: userId, verificationStatus
- **Category**: name
- **Subcategory**: categoryId, name+categoryId (unique)
- **Listing**: curatorId, categoryId, subcategoryId, locationId, isActive
- **Location**: city, state, country, latitude+longitude
- **Review**: authorId, targetId, listingId, rating
- **Tip**: senderId, receiverId, listingId, status, txHash