import express from 'express';
import cors from 'cors';
import { nanoid } from 'nanoid';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['http://localhost:8088', 'http://localhost'] 
    : 'http://localhost:5173', // Vite dev server (порт 5173)
  credentials: true
}));
app.use(express.json());

// In-memory storage for shared lists
const sharedLists = new Map();

// Helper function to get unique recipes from items
const getUniqueRecipes = (items) => {
  const recipes = new Set(items.map(item => item.recipeId));
  return Array.from(recipes);
};

// POST /api/lists/share - Create shared list
app.post('/api/lists/share', (req, res) => {
  try {
    const { items, recipes } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    // Generate short unique ID (8 characters)
    const shareId = nanoid(8);
    const now = Date.now();

    // Store list data
    const listData = {
      shareId,
      items,
      recipes: recipes || getUniqueRecipes(items),
      createdAt: now,
      updatedAt: now,
      viewsCount: 0,
    };

    sharedLists.set(shareId, listData);

    // Generate share URL
    const shareUrl = process.env.NODE_ENV === 'production'
      ? `http://localhost:8088/s/${shareId}`
      : `http://localhost:5173/s/${shareId}`;

    console.log(`✅ Created list with ID: ${shareId}`);

    res.json({
      shareId,
      url: shareUrl,
      expiresAt: now + (90 * 24 * 60 * 60 * 1000), // 90 days
    });
  } catch (error) {
    console.error('Error creating shared list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/lists/share/:id - Get shared list
app.get('/api/lists/share/:id', (req, res) => {
  try {
    const { id } = req.params;

    const listData = sharedLists.get(id);

    if (!listData) {
      console.log(`❌ List not found: ${id}`);
      return res.status(404).json({ error: 'Список не найден' });
    }

    // Increment views count
    listData.viewsCount += 1;

    console.log(`📖 Retrieved list: ${id} (views: ${listData.viewsCount})`);

    res.json({
      items: listData.items,
      recipes: listData.recipes,
      metadata: {
        createdAt: listData.createdAt,
        updatedAt: listData.updatedAt,
      },
      viewsCount: listData.viewsCount,
    });
  } catch (error) {
    console.error('Error retrieving shared list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/lists/share/:id - Update shared list
app.patch('/api/lists/share/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    const listData = sharedLists.get(id);

    if (!listData) {
      console.log(`❌ List not found for update: ${id}`);
      return res.status(404).json({ error: 'Список не найден' });
    }

    // Update items and timestamp
    listData.items = items;
    listData.updatedAt = Date.now();
    listData.recipes = getUniqueRecipes(items);

    console.log(`🔄 Updated list: ${id}`);

    res.json({
      items: listData.items,
      recipes: listData.recipes,
      metadata: {
        createdAt: listData.createdAt,
        updatedAt: listData.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating shared list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Shared lists in memory: ${sharedLists.size}`);
});

