// src/controllers/couponController.js - 优惠券控制器
const mockCoupons = [
  { id: 1, name: '新人专享券', type: 1, threshold: 100, value: 20, totalCount: 500, remainCount: 328, usedCount: 172, startTime: '2024-01-01', endTime: '2024-12-31', status: 1, description: '新用户首次下单专享' },
  { id: 2, name: '满200减50', type: 1, threshold: 200, value: 50, totalCount: 200, remainCount: 45, usedCount: 155, startTime: '2024-01-10', endTime: '2024-02-10', status: 1, description: '情人节活动优惠券' },
  { id: 3, name: '8折折扣券', type: 2, threshold: 0, value: 8, totalCount: 100, remainCount: 78, usedCount: 22, startTime: '2024-01-15', endTime: '2024-03-15', status: 1, description: '全店通用折扣券' }
];

exports.getCouponList = async (req, res) => {
  try {
    res.json({ code: 200, message: 'success', list: mockCoupons });
  } catch (err) {
    res.status(500).json({ code: 500, message: '获取失败' });
  }
};

exports.addCoupon = async (req, res) => {
  try {
    const { name, type, threshold, value, totalCount, description, startTime, endTime } = req.body;
    const newCoupon = { id: Date.now(), name, type, threshold, value, totalCount, remainCount: totalCount, usedCount: 0, startTime, endTime, status: 1, description };
    res.json({ code: 200, message: '添加成功', coupon: newCoupon });
  } catch (err) {
    res.status(500).json({ code: 500, message: '添加失败' });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    res.json({ code: 200, message: '更新成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: '更新失败' });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    res.json({ code: 200, message: '删除成功' });
  } catch (err) {
    res.status(500).json({ code: 500, message: '删除失败' });
  }
};
