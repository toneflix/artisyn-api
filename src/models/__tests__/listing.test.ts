import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Create a new instance of PrismaClient for testing
const prisma = new PrismaClient();

describe('Listing Model', () => {
  let userId: string;
  let categoryId: string;
  let locationId: string;

  // Set up test data
  beforeAll(async () => {
    // Create a user
    const userData = {
      email: 'listing-test@example.com',
      password: await bcrypt.hash('password123', 10),
      firstName: 'Listing',
      lastName: 'Test',
      role: UserRole.CURATOR,
    };

    const user = await prisma.user.create({
      data: userData,
    });

    userId = user.id;

    // Create a category
    const category = await prisma.category.create({
      data: {
        name: 'Test Category',
        description: 'Category for testing',
      },
    });

    categoryId = category.id;

    // Create a location
    const location = await prisma.location.create({
      data: {
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        latitude: 0,
        longitude: 0,
      },
    });

    locationId = location.id;
  });

  // Clean up after tests
  afterAll(async () => {
    await prisma.listing.deleteMany();
    await prisma.category.deleteMany();
    await prisma.location.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should create a new listing with fixed price', async () => {
    const listingData = {
      title: 'Test Listing',
      description: 'This is a test listing',
      price: 100,
      images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
      curatorId: userId,
      categoryId,
      locationId,
      isActive: true,
    };

    const listing = await prisma.listing.create({
      data: listingData,
    });

    expect(listing).toHaveProperty('id');
    expect(listing.title).toBe(listingData.title);
    expect(listing.price).toBe(listingData.price);
    expect(listing.curatorId).toBe(userId);
    expect(listing.isActive).toBe(true);
  });

  it('should create a new listing with price range', async () => {
    const listingData = {
      title: 'Test Listing with Range',
      description: 'This is a test listing with a price range',
      priceRange: { min: 50, max: 150 },
      images: ['https://example.com/image1.jpg'],
      curatorId: userId,
      categoryId,
      locationId,
      isActive: true,
    };

    const listing = await prisma.listing.create({
      data: listingData,
    });

    expect(listing).toHaveProperty('id');
    expect(listing.title).toBe(listingData.title);
    expect(listing.priceRange).toEqual(listingData.priceRange);
    expect(listing.price).toBeNull();
  });

  it('should update a listing', async () => {
    const listingData = {
      title: 'Listing to Update',
      description: 'This listing will be updated',
      price: 200,
      images: ['https://example.com/image.jpg'],
      curatorId: userId,
      categoryId,
      locationId,
    };

    const listing = await prisma.listing.create({
      data: listingData,
    });

    const updatedListing = await prisma.listing.update({
      where: { id: listing.id },
      data: {
        title: 'Updated Listing',
        price: 250,
        isActive: false,
      },
    });

    expect(updatedListing.title).toBe('Updated Listing');
    expect(updatedListing.price).toBe(250);
    expect(updatedListing.isActive).toBe(false);
  });

  it('should delete a listing', async () => {
    const listingData = {
      title: 'Listing to Delete',
      description: 'This listing will be deleted',
      price: 300,
      images: ['https://example.com/image.jpg'],
      curatorId: userId,
      categoryId,
      locationId,
    };

    const listing = await prisma.listing.create({
      data: listingData,
    });

    await prisma.listing.delete({
      where: { id: listing.id },
    });

    const deletedListing = await prisma.listing.findUnique({
      where: { id: listing.id },
    });

    expect(deletedListing).toBeNull();
  });

  it('should delete listings when a user is deleted', async () => {
    // Create a new user for this test
    const userData = {
      email: 'listing-cascade@example.com',
      password: await bcrypt.hash('password123', 10),
      firstName: 'Cascade',
      lastName: 'Test',
      role: UserRole.CURATOR,
    };

    const user = await prisma.user.create({
      data: userData,
    });

    // Create a listing for this user
    await prisma.listing.create({
      data: {
        title: 'Cascade Test Listing',
        description: 'This listing should be deleted when the user is deleted',
        price: 100,
        images: ['https://example.com/image.jpg'],
        curatorId: user.id,
        categoryId,
        locationId,
      },
    });

    // Delete the user
    await prisma.user.delete({
      where: { id: user.id },
    });

    // Check if the listing was also deleted (cascade)
    const listings = await prisma.listing.findMany({
      where: { curatorId: user.id },
    });

    expect(listings).toHaveLength(0);
  });
});
