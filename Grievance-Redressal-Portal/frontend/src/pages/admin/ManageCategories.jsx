import React, { useState, useEffect } from 'react';
import categoryService from '../../services/categoryService';
import Loading from '../../components/Loading';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await categoryService.getCategories();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Could not connect to Category API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSeedCategories = async () => {
    setSubmitting(true);
    setError('');
    setMsg('');
    try {
      const res = await categoryService.seedCategories();
      setMsg(res.message || 'Default categories seeded successfully into MongoDB Atlas!');
      fetchCategories();
    } catch (err) {
      console.error('Seed error:', err);
      setError(err.response?.data?.message || 'Failed to seed default categories.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setSubmitting(true);
    setError('');
    setMsg('');

    try {
      const payload = {
        name: newCatName.trim(),
        description: newCatDesc.trim() || 'No description provided.',
      };

      await categoryService.createCategory(payload);
      setMsg(`Category "${newCatName}" created successfully in MongoDB database!`);
      setNewCatName('');
      setNewCatDesc('');
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category on backend REST API.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;

    setError('');
    setMsg('');
    try {
      await categoryService.deleteCategory(id);
      setMsg(`Category "${name}" deleted successfully.`);
      fetchCategories();
    } catch {
      setError('Failed to delete category.');
    }
  };

  if (loading) return <Loading message="Loading grievance categories..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex-between items-center">
          <div>
            <h1 className="page-title">Manage Grievance Categories</h1>
            <p className="page-subtitle">
              Configure classification tags stored in MongoDB Atlas database
            </p>
          </div>
          <button
            className="btn btn-outline"
            onClick={handleSeedCategories}
            disabled={submitting}
          >
            ⚡ Seed Defaults into MongoDB
          </button>
        </div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="grid-cols-2 gap-6">
        {/* Category List */}
        <div className="card">
          <h2>Active Categories ({categories.length})</h2>
          {categories.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted mb-3">No categories found in MongoDB database.</p>
              <button
                className="btn btn-primary"
                onClick={handleSeedCategories}
                disabled={submitting}
              >
                + Seed Default Categories
              </button>
            </div>
          ) : (
            <div className="categories-list mt-3">
              {categories.map((cat) => (
                <div key={cat._id} className="category-item-card">
                  <div className="cat-item-info">
                    <span className="cat-item-title">🏷️ {cat.name}</span>
                    <p className="cat-item-desc">{cat.description}</p>
                  </div>
                  <button
                    className="btn btn-sm btn-danger-outline"
                    onClick={() => handleDeleteCategory(cat._id, cat.name)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Category Form */}
        <div className="card">
          <h2>Add New Category</h2>
          <form onSubmit={handleAddCategory} className="mt-3">
            <div className="form-group">
              <label htmlFor="catName">Category Name *</label>
              <input
                type="text"
                id="catName"
                className="form-control"
                placeholder="e.g. Transport & Bus Service"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="catDesc">Description</label>
              <textarea
                id="catDesc"
                className="form-control"
                rows="3"
                placeholder="Brief description of grievances belonging to this category..."
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
              {submitting ? 'Saving to Database...' : '+ Add Category'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
