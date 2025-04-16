const express = require('express');
const upload = require('../utils/multerConfig');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
// const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// 获取文档列表
router.get('/', async (req, res) => {
  try {
    const documents = await Document.findAll();
    res.json({ code: 0, msg: 'success', data: documents });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

// 上传文件
router.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const category = req.body.category || '';
  const subcategory = req.body.subcategory || '';
  const uploadBy = req.body.uploadBy || '';
  if (!file) {
    return res.status(400).json({ code: 1, msg: 'No file uploaded' });
  }
  try {
    await Document.create({
      title: file.originalname,
      path: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      createdAt: new Date(),
      category,
      subcategory,
      uploadBy
    });
    res.json({ code: 0, msg: 'Upload success', data: { filename: file.filename, originalname: file.originalname } });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

// 预览文件
router.get('/:id/preview', async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await Document.findByPk(id);
    if (!doc) {
      return res.status(404).json({ code: 1, msg: 'File not found' });
    }
    const filePath = path.resolve('uploads', doc.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ code: 2, msg: 'File missing on server' });
    }
    res.setHeader('Content-Type', doc.mimetype);
    res.setHeader('Content-Disposition', 'inline; filename="' + encodeURIComponent(doc.title) + '"');
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

// 下载文件
router.get('/:id/download', async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await Document.findByPk(id);
    if (!doc) {
      return res.status(404).json({ code: 1, msg: 'File not found' });
    }
    const filePath = path.resolve('uploads', doc.path);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ code: 2, msg: 'File missing on server' });
    }
    res.download(filePath, doc.title);
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

// 更新文件分类和子分类
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { category, subcategory } = req.body;
    const doc = await Document.findByPk(id);
    if (!doc) {
      return res.status(404).json({ code: 1, msg: 'File not found' });
    }
    await Document.update({
      category: category || doc.category,
      subcategory: subcategory || doc.subcategory
    }, { where: { id } });
    res.json({ code: 0, msg: '更新成功' });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

// 删除文件
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await Document.findByPk(id);
    if (doc) {
      const filePath = path.resolve('uploads', doc.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    await Document.destroy({ where: { id } });
    res.json({ code: 0, msg: '删除成功' });
  } catch (err) {
    res.json({ code: 1, msg: err.message });
  }
});

module.exports = router;
