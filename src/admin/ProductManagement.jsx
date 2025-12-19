import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Upload, message, Popconfirm, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import AdminLayout from './AdminLayout';
import api from '../services/api';
import { formatPrice } from '../utils/currency';

const { TextArea } = Input;
const { Option } = Select;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products?limit=100');
      setProducts(data.products);
    } catch (error) {
      message.error('Failed to fetch products');
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

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
      
      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('images', file.originFileObj);
        }
      });

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Product updated successfully');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Product created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      setFileList([]);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      message.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setFileList(product.images?.map((img, index) => ({
      uid: index,
      name: `image-${index}`,
      status: 'done',
      url: img.url
    })) || []);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'image',
      render: (images) => (
        <Image
          width={50}
          height={50}
          src={images[0]?.url}
          style={{ objectFit: 'cover' }}
        />
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatPrice(price)
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="space-x-2">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Product Management</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Add Product
          </Button>
        </div>

        <Table
          dataSource={products}
          columns={columns}
          rowKey="_id"
          loading={loading}
        />

        <Modal
          title={editingProduct ? 'Edit Product' : 'Add Product'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
            setFileList([]);
            setEditingProduct(null);
          }}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true, message: 'Please enter product name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter description' }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              <Form.Item name="discountPrice" label="Discount Price">
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select>
                  {categories.map(cat => (
                    <Option key={cat._id} value={cat._id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="stock"
                label="Stock"
                rules={[{ required: true, message: 'Please enter stock' }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>
            </div>

            <Form.Item label="Images">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                multiple
              >
                <div>
                  <UploadOutlined />
                  <div>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default ProductManagement;