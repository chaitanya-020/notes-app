import { sendOk, sendError } from '../utils/http.js';
import Note from '../models/Note.js';
import mongoose from 'mongoose';


export async function listNotes(req, res, next) {
  try {
    const { q = '', tag = '' } = req.query;
    const filter = { userId: req.userId };
    if (q) {
      const rx = new RegExp(q, 'i');
      filter.$or = [{ title: rx }, { content: rx }];
    }
    if (tag) filter.tags = { $in: [tag] };

    // Use Documents (not lean) so toJSON works uniformly
    const docs = await Note.find(filter).sort({ createdAt: -1 });
    const notes = docs.map(d => d.toJSON());   // -> includes { id, ... }
    return sendOk(res, notes);
  } catch (err) { next(err); }
}


export async function getNote(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid note id');
    }
    const doc = await Note.findOne({ _id: req.params.id, userId: req.userId });
    if (!doc) return sendError(res, 404, 'Note not found');
    return sendOk(res, doc.toJSON());
  } catch (err) { next(err); }
}


export async function createNote(req, res, next) {
  try {
    const { title, content, tags = [] } = req.body || {};
    if (!title || !title.trim())  return sendError(res, 400, 'Title is required');
    if (!content || !content.trim()) return sendError(res, 400, 'Content is required');

    const note = await Note.create({
      userId: req.userId,
      title: title.trim(),
      content: content.trim(),
      tags: Array.isArray(tags) ? tags : [],
    });
    return sendOk(res, note.toJSON());
  } catch (err) { next(err); }
}

export async function updateNote(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid note id');
    }
    const { title, content, tags } = req.body || {};
    if (title !== undefined && !title.trim())   return sendError(res, 400, 'Title cannot be empty');
    if (content !== undefined && !content.trim()) return sendError(res, 400, 'Content cannot be empty');

    const updates = {};
    if (title !== undefined)   updates.title = title.trim();
    if (content !== undefined) updates.content = content.trim();
    if (tags !== undefined)    updates.tags = Array.isArray(tags) ? tags : [];

    const doc = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!doc) return sendError(res, 404, 'Note not found');
    return sendOk(res, doc.toJSON());
  } catch (err) { next(err); }
}

export async function deleteNote(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return sendError(res, 400, 'Invalid note id');
    }
    const doc = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!doc) return sendError(res, 404, 'Note not found');
    return sendOk(res, doc.toJSON());
  } catch (err) { next(err); }
}

