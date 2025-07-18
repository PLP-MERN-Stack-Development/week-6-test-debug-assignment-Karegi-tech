// posts.test.js - Integration tests for posts API endpoints

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');

const Post = require('../../../server/src/models/Post');
const User = require('../../../server/src/models/User');
const { generateToken } = require('../../utils/auth'); // ✅ Corrected import

let mongoServer;
let token;
let userId;
let postId;

// Setup in-memory MongoDB server before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  // Create a test user
  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  });
  userId = user._id;
  token = generateToken(user);

  // Create a test post
  const post = await Post.create({
    title: 'Test Post',
    content: 'This is a test post content',
    author: userId,
    category: mongoose.Types.ObjectId(),
    slug: 'test-post',
  });
  postId = post._id;
});

// Clean up after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clean up database between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    if (collection.collectionName !== 'users' && collection.collectionName !== 'posts') {
      await collection.deleteMany({});
    }
  }
});

describe('POST /api/posts', () => {
  it('should create a new post when authenticated', async () => {
    const newPost = {
      title: 'New Test Post',
      content: 'This is a new test post content',
      category: mongoose.Types.ObjectId().toString(),
    };

    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(newPost);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(newPost.title);
    expect(res.body.content).toBe(newPost.content);
    expect(res.body.author).toBe(userId.toString());
  });

  it('should return 401 if not authenticated', async () => {
    const newPost = {
      title: 'Unauthorized Post',
      content: 'This should not be created',
      category: mongoose.Types.ObjectId().toString(),
    };

    const res = await request(app).post('/api/posts').send(newPost);
    expect(res.status).toBe(401);
  });

  it('should return 400 if validation fails', async () => {
    const invalidPost = {
      content: 'This post is missing a title',
      category: mongoose.Types.ObjectId().toString(),
    };

    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidPost);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/posts', () => {
  it('should return all posts', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should filter posts by category', async () => {
    const categoryId = mongoose.Types.ObjectId().toString();

    await Post.create({
      title: 'Filtered Post',
      content: 'This post should be filtered by category',
      author: userId,
      category: categoryId,
      slug: 'filtered-post',
    });

    const res = await request(app).get(`/api/posts?category=${categoryId}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].category).toBe(categoryId);
  });

  it('should paginate results', async () => {
    const posts = [];
    for (let i = 0; i < 15; i++) {
      posts.push({
        title: `Pagination Post ${i}`,
        content: `Content for pagination test ${i}`,
        author: userId,
        category: mongoose.Types.ObjectId(),
        slug: `pagination-post-${i}`,
      });
    }
    await Post.insertMany(posts);

    const page1 = await request(app).get('/api/posts?page=1&limit=10');
    const page2 = await request(app).get('/api/posts?page=2&limit=10');

    expect(page1.status).toBe(200);
    expect(page2.status).toBe(200);
    expect(page1.body.length).toBe(10);
    expect(page2.body.length).toBeGreaterThan(0);
  });
});

describe('GET /api/posts/:id', () => {
  it('should return a post by ID', async () => {
    const res = await request(app).get(`/api/posts/${postId}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(postId.toString());
    expect(res.body.title).toBe('Test Post');
  });

  it('should return 404 for non-existent post', async () => {
    const fakeId = mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/posts/${fakeId}`);
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/posts/:id', () => {
  it('should update a post when authenticated as author', async () => {
    const updates = {
      title: 'Updated Title',
      content: 'Updated content',
    };

    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updates);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updates.title);
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app).put(`/api/posts/${postId}`).send({ title: 'Unauthorized' });
    expect(res.status).toBe(401);
  });

  it('should return 403 if not the author', async () => {
    const otherUser = await User.create({
      username: 'notauthor',
      email: 'no@auth.com',
      password: 'pass',
    });
    const otherToken = generateToken(otherUser);

    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Invalid' });

    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/posts/:id', () => {
  it('should delete a post when authenticated as author', async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const deleted = await Post.findById(postId);
    expect(deleted).toBeNull();
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app).delete(`/api/posts/${postId}`);
    expect(res.status).toBe(401);
  });
});
