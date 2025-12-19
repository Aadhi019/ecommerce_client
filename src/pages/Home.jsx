import { useState, useEffect } from 'react';
import { Row, Col, Input, Select, Spin, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const { Search } = Input;
const { Option } = Select;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: 'newest',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 12
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setPagination({
        total: data.total,
        current: data.currentPage,
        pageSize: filters.limit
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Products</h1>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <Search
            placeholder="Search products..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            className="flex-1 min-w-64"
          />
          
          <Select
            placeholder="Category"
            allowClear
            size="large"
            className="w-48"
            onChange={(value) => handleFilterChange('category', value)}
          >
            {categories.map(category => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
          </Select>
          
          <Select
            defaultValue="newest"
            size="large"
            className="w-48"
            onChange={(value) => handleFilterChange('sort', value)}
          >
            <Option value="newest">Newest</Option>
            <Option value="price_low">Price: Low to High</Option>
            <Option value="price_high">Price: High to Low</Option>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {products.map(product => (
              <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          )}

          {pagination.total > 0 && (
            <div className="flex justify-center mt-8">
              <Pagination
                current={pagination.current}
                total={pagination.total}
                pageSize={pagination.pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;