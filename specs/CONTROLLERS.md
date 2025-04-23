

---

# Artisyn.io Backend API

## Controller Format

Each controller should follow a consistent CRUD structure.

If additional methods are needed for a specific endpoint, create a **separate controller** dedicated to that logic.

### Example: `listings.controller.ts`

```ts
import { ListingService } from '../services/listing.service';

export class ListingsController {
  constructor(private listingService: ListingService) {}

  async getAll(req, res) {
    const { page = 1, perPage = 10, ...filters } = req.query;
    const result = await this.listingService.findAll(page, perPage, filters);

    return res.json({
      data: result.items,
      meta: {
        status: "success",
        message: "OK",
        code: 200,
        pagination: {
          from: (page - 1) * perPage + 1,
          to: Math.min(page * perPage, result.total),
          perPage: perPage,
          total: result.total
        }
      }
    });
  }

  async getOne(req, res) {
    const { id } = req.params;
    const item = await this.listingService.findById(id);

    if (!item) {
      return res.status(404).json({
        data: null,
        meta: {
          status: "error",
          message: "Listing not found",
          code: 404
        }
      });
    }

    return res.json({
      data: item,
      meta: {
        status: "success",
        message: "OK",
        code: 200
      }
    });
  }

  async create(req, res) {
    const newItem = await this.listingService.create(req.body, req.user.id);

    return res.status(201).json({
      data: newItem,
      meta: {
        status: "success",
        message: "Listing created successfully",
        code: 201
      }
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const updated = await this.listingService.update(id, req.body, req.user.id);

    if (!updated) {
      return res.status(404).json({
        data: null,
        meta: {
          status: "error",
          message: "Listing not found or permission denied",
          code: 404
        }
      });
    }

    return res.json({
      data: updated,
      meta: {
        status: "success",
        message: "Listing updated successfully",
        code: 200
      }
    });
  }

  async delete(req, res) {
    const { id } = req.params;
    const deleted = await this.listingService.delete(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({
        data: null,
        meta: {
          status: "error",
          message: "Listing not found or permission denied",
          code: 404
        }
      });
    }

    return res.json({
      data: null,
      meta: {
        status: "success",
        message: "Listing deleted successfully",
        code: 200
      }
    });
  }
}
```

---
