// src/controllers/bannerController.js - 轮播图控制器
const mockBanners = [
  { id: 1, image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=750&h=400', title: '春季鲜花特惠', link: '', sort: 1, status: 1 },
  { id: 2, image: 'https://images.unsplash.com/photo-1518882605630-8a6c87889c28?w=750&h=400', title: '玫瑰花束专区', link: '/pages/category/category?id=2', sort: 2, status: 1 },
  { id: 3, image: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=750&h=400', title: '新品上市', link: '', sort: 3, status: 1 }
];

exports.getBannerList = async (req, res) => {
  try {
    if (process.env.DEV_MODE === 'true' || req.headers['x-dev-mode'] === 'true') {
      return res.json({ code: 200, message: 'success', list: mockBanners });
    }
    // 真实数据库查询
    const banners = mockBanners;
    res.json({ code: 200, message: 'success', list: banners });
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取失败' });
  }
};

exports.addBanner = async (req, res) => {
  try {
    const { image, title, link, sort, status } = req.body;
    const newBanner = { id: Date.now(), image, title, link, sort: sort || 0, status: status || 1 };
    res.json({ code: 200, message: '添加成功', banner: newBanner });
  } catch (err) {
    res.status(500).json({ code: 500, message: '添加失败' });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    res.json({ code: 200, message: '更新成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: '更新失败' });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    res.json({ code: 200, message: '删除成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: '删除失败' });
  }
};
