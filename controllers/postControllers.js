import { client } from "../config/sanityClient.js";

// Fetch all blog posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await client.fetch('*[_type == "post"]{_id, title, slug, mainImage, content, publishedAt, }');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts" });
  }
};

// Fetch a single post by slug
export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{_id, title, slug, content, publishedAt, mainImage}`,
      { slug }
    );
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error fetching post" });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, slug, body, publishedAt, authorId } = req.body;
    const newPost = await client.create({
      _type: "post",
      title,
      slug: { current: slug },
      body,
      publishedAt,
      author: { _type: "reference", _ref: authorId },
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Error creating post" });
  }
};

// Update an existing post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedPost = await client.patch(id).set(updateData).commit();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Error updating post" });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await client.delete(id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
};
