// app.js - Flora花店小程序
App({
  onLaunch() {
    // 小程序启动时执行
    console.log('Flora花店小程序启动');
    
    // 获取系统信息
    this.getSystemInfo();
    
    // 检查登录状态
    this.checkLoginStatus();
  },

  onShow() {
    // 小程序从前台进入后台时执行
    console.log('Flora花店小程序显示');
  },

  onHide() {
    // 小程序从后台进入前台时执行
    console.log('Flora花店小程序隐藏');
  },

  // 获取系统信息
  getSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      this.globalData.systemInfo = systemInfo;
      this.globalData.statusBarHeight = systemInfo.statusBarHeight;
      this.globalData.screenWidth = systemInfo.screenWidth;
      this.globalData.screenHeight = systemInfo.screenHeight;
    } catch (e) {
      console.error('获取系统信息失败', e);
    }
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.isLogin = true;
      this.globalData.token = token;
    }
  },

  // 微信登录
  wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            this.globalData.code = res.code;
            resolve(res.code);
          } else {
            reject(new Error('登录失败！' + res.errMsg));
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  // 全局数据
  globalData: {
    isLogin: false,
    token: '',
    code: '',
    userInfo: null,
    systemInfo: null,
    statusBarHeight: 0,
    screenWidth: 375,
    screenHeight: 667,
    // API基础URL - 开发时替换为实际后端地址
    baseUrl: 'http://localhost:3000/api',
    // 主题配色
    theme: {
      primaryColor: '#333333',
      accentColor: '#000000'
    }
  }
});
