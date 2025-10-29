import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog, updateBlog, fetchBlogs } from '../redux/slices/blogSlice';
import Loader from '../components/Loader';

const BlogForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, blogs } = useSelector((state) => state.blogs);

  // Load blog data for editing
  useEffect(() => {
    if (isEdit && blogs.length === 0) {
      dispatch(fetchBlogs());
    } else if (isEdit && blogs.length > 0) {
      const blog = blogs.find(b => b._id === id);
      if (blog) {
        setFormData({
          title: blog.title,
          content: blog.content
        });
      }
    }
  }, [isEdit, id, blogs, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } 

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEdit) {
        await dispatch(updateBlog({
          id,
          blogData: {
            title: formData.title.trim(),
            content: formData.content.trim()
          }
        })).unwrap();
      } else {
        await dispatch(createBlog({
          title: formData.title.trim(),
          content: formData.content.trim()
        })).unwrap();
      }
      navigate('/blogs');
    } catch (error) {
      console.error(isEdit ? 'Update blog failed:' : 'Create blog failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isEdit ? 'Update your blog post' : 'Share your thoughts and ideas with the world'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter a compelling title for your blog post"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
              <textarea
                id="content"
                name="content"
                rows={12}
                value={formData.content}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical leading-relaxed ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Write your blog post content here..."
                style={{ lineHeight: '1.6' }}
              />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.content.length} characters (minimum 50)
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/blogs')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader size="sm" text="" />
                    <span className="ml-2">Publishing...</span>
                  </div>
                ) : (
                  'Publish Post'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogForm;
