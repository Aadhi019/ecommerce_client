import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Popconfirm, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import AdminLayout from './AdminLayout';
import api from '../services/api';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      message.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      if (values.description) {
        formData.append('description', values.description);
      }
      
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      }

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Category updated successfully');
      } else {
        await api.post('/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success('Category created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      setFileList([]);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      message.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    if (category.image?.url) {
      setFileList([{
        uid: '1',
        name: 'image',
        status: 'done',
        url: category.image.url
      }]);
    }
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      message.error('Failed to delete category');
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <Image
          width={50}
          height={50}
          src={image?.url}
          style={{ objectFit: 'cover' }}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
        />
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
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
          <h1 className="text-2xl font-bold">Category Management</h1>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            Add Category
          </Button>
        </div>

        <Table
          dataSource={categories}
          columns={columns}
          rowKey="_id"
          loading={loading}
        />

        <Modal
          title={editingCategory ? 'Edit Category' : 'Add Category'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
            setFileList([]);
            setEditingCategory(null);
          }}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="name"
              label="Category Name"
              rules={[{ required: true, message: 'Please enter category name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item label="Image">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                beforeUpload={() => false}
                maxCount={1}
              >
                <div>
                  <UploadOutlined />
                  <div>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default CategoryManagement;