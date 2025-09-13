import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import DarkModeToggle from '../common/DarkModeToggle';
import TransactionTable from '../transactions/TransactionTable';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: [],
    school_id: [],
    date_from: '',
    date_to: '',
    search: '',
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc'
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    current: 1,
    limit: 10
  });
  const [stats, setStats] = useState({
    totalRevenue: 0,
    completed: 0,
    pending: 0,
    failed: 0
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      
      // Mock API call - replace with actual API
      const mockResponse = {
        data: {
          data: [
            {
              collect_id: 'COL001',
              school_id: 'SCH001',
              gateway: 'Cashfree',
              order_amount: 5500,
              transaction_amount: 5500,
              status: 'completed',
              custom_order_id: 'ORD_001_123456',
              createdAt: '2025-09-10T10:00:00Z'
            },
            {
              collect_id: 'COL002',
              school_id: 'SCH002',
              gateway: 'Razorpay',
              order_amount: 7200,
              transaction_amount: 7150,
              status: 'pending',
              custom_order_id: 'ORD_002_123457',
              createdAt: '2025-09-09T15:30:00Z'
            },
            {
              collect_id: 'COL003',
              school_id: 'SCH001',
              gateway: 'Paytm',
              order_amount: 4800,
              transaction_amount: 4800,
              status: 'failed',
              custom_order_id: 'ORD_003_123458',
              createdAt: '2025-09-08T12:15:00Z'
            }
          ],
          pagination: {
            total: 150,
            pages: 15,
            current: filters.page,
            limit: filters.limit
          }
        }
      };

      // Replace this with: const response = await transactionAPI.getAllTransactions(filters);
      const response = mockResponse;
      
      setTransactions(response.data.data);
      setPagination(response.data.pagination);
      
      // Calculate stats
      const calculatedStats = calculateStats(response.data.data);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] && (Array.isArray(filters[key]) ? filters[key].length > 0 : filters[key] !== '')) {
        if (Array.isArray(filters[key])) {
          params.set(key, filters[key].join(','));
        } else {
          params.set(key, filters[key]);
        }
      }
    });
    window.history.pushState({}, '', `${window.location.pathname}?${params}`);
  }, [filters]);

  const loadFiltersFromURL = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFilters = { ...filters };
    
    params.forEach((value, key) => {
      if (key === 'status' || key === 'school_id') {
        urlFilters[key] = value.split(',');
      } else if (key === 'page' || key === 'limit') {
        urlFilters[key] = parseInt(value);
      } else {
        urlFilters[key] = value;
      }
    });
    
    setFilters(urlFilters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load filters from URL on mount
  useEffect(() => {
    loadFiltersFromURL();
  }, [loadFiltersFromURL]);

  // Fetch transactions when filters change
  useEffect(() => {
    fetchTransactions();
    updateURL();
  }, [fetchTransactions, updateURL]);

  const calculateStats = (transactions) => {
    return transactions.reduce((acc, txn) => {
      acc.totalRevenue += txn.transaction_amount || 0;
      if (txn.status === 'completed') acc.completed++;
      if (txn.status === 'pending') acc.pending++;
      if (txn.status === 'failed') acc.failed++;
      return acc;
    }, { totalRevenue: 0, completed: 0, pending: 0, failed: 0 });
  };

  const handleFilterChange = (key, value) => {
    if (key === 'clear') {
      setFilters({
        status: [],
        school_id: [],
        date_from: '',
        date_to: '',
        search: '',
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: 'desc'
      });
      return;
    }
    
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to first page when filtering, except for page changes
    }));
  };

  const handleSort = (column) => {
    setFilters(prev => ({
      ...prev,
      sort: column,
      order: prev.sort === column && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">📊</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                School Payment Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/school-transactions"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
              >
                School Transactions
              </Link>
              <Link 
                to="/status-check"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
              >
                Status Check
              </Link>
              <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, User</span>
              <DarkModeToggle />
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{stats.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                <span className="text-2xl">❌</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.failed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Transaction Table */}
        <TransactionTable 
          transactions={transactions}
          loading={loading}
          filters={filters}
          pagination={pagination}
          onFilterChange={handleFilterChange}
          onSort={handleSort}
        />
      </div>
    </div>
  );
};

export default Dashboard;
