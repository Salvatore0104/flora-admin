// src/utils/wxpay.js - 微信支付工具
const crypto = require('crypto');
const axios = require('axios');
const config = require('../config').wxPay;

// 生成随机字符串
function generateNonceStr(length = 32) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 生成签名
function generateSignature(params) {
  const sortedKeys = Object.keys(params).sort();
  let stringA = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
  stringA += `&key=${config.key}`;
  return crypto.createHash('md5').update(stringA, 'utf8').digest('hex').toUpperCase();
}

// 统一下单
async function unifiedOrder(params) {
  const nonce_str = generateNonceStr();
  const out_trade_no = params.out_trade_no;
  const total_fee = params.total_fee;
  const body = params.body || '商品购买';
  const openid = params.openid;
  
  const data = {
    appid: config.appid,
    mch_id: config.mchid,
    nonce_str,
    body,
    out_trade_no,
    total_fee,
    spbill_create_ip: '127.0.0.1',
    notify_url: 'http://your-domain.com/api/pay/notify',
    trade_type: 'JSAPI',
    openid
  };
  
  data.sign = generateSignature(data);
  
  // 调用微信支付接口
  const response = await axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder', data);
  
  // 返回支付参数
  return {
    timeStamp: Math.floor(Date.now() / 1000).toString(),
    nonceStr: nonce_str,
    package: `prepay_id=${response.data.prepay_id}`,
    signType: 'MD5'
  };
}

// 验证支付回调
function verifyNotify(notifyData) {
  const sign = notifyData.sign;
  delete notifyData.sign;
  const calculatedSign = generateSignature(notifyData);
  return sign === calculatedSign && notifyData.result_code === 'SUCCESS';
}

// 退款
async function refund(params) {
  const data = {
    appid: config.appid,
    mch_id: config.mchid,
    nonce_str: generateNonceStr(),
    out_trade_no: params.out_trade_no,
    out_refund_no: params.out_refund_no,
    total_fee: params.total_fee,
    refund_fee: params.refund_fee,
    reason: params.reason
  };
  
  data.sign = generateSignature(data);
  
  const response = await axios.post('https://api.mch.weixin.qq.com/secapi/pay/refund', data, {
    cert: config.certPath,
    key: config.keyPath
  });
  
  return response.data;
}

module.exports = {
  unifiedOrder,
  verifyNotify,
  refund
};
