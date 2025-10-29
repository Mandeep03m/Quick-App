import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResults } from '../redux/slices/scrapeSlice';
import Loader from '../components/Loader';

const GoogleScraper = () => {
  const [keyword, setKeyword] = useState('');
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { results, loading, error } = useSelector((state) => state.scraper);

  const handleChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    // Clear error when user starts typing
    if (errors.keyword) {
      setErrors(prev => ({
        ...prev,
        keyword: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!keyword.trim()) {
      newErrors.keyword = 'Search keyword is required';
    } else if (keyword.trim().length < 2) {
      newErrors.keyword = 'Keyword must be at least 2 characters';
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
      await dispatch(fetchResults(keyword.trim())).unwrap();
    } catch (error) {
      console.error('Scraping failed:', error);
    }
  };

  const handleClear = () => {
    setKeyword('');
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Google Scraper</h1>
          <p className="mt-2 text-gray-600">
            Search Google and extract results for research and analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Search</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-2">
                    Search Keyword *
                  </label>
                  <input
                    type="text"
                    id="keyword"
                    value={keyword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.keyword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter search keyword..."
                  />
                  {errors.keyword && (
                    <p className="mt-1 text-sm text-red-600">{errors.keyword}</p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={!keyword.trim() || loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-semibold transition-colors"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <Loader size="sm" text="" />
                        <span className="ml-2">Searching...</span>
                      </div>
                    ) : (
                      'Search'
                    )}
                  </button>
                  
                  {keyword && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
                {results.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {results.length} result{results.length !== 1 ? 's' : ''} found
                  </span>
                )}
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader size="lg" text="Searching Google..." />
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {result.title || 'No title available'}
                          </h3>
                          
                          {result.url && (
                            <p className="text-sm text-blue-600 mb-2 truncate">
                              <a
                                href={result.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {result.url}
                              </a>
                            </p>
                          )}
                          
                          {result.description && (
                            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-2">
                              {result.description}
                            </p>
                          )}
                          
                          {result.snippet && (
                            <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                              {result.snippet}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Enter a keyword and click search to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleScraper;
