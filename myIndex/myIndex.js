//  pages/act/myIndex/myIndex.js
var app = getApp()

let {
  api_GetDiscoverList,
  api_GetAllBanners,
  api_GetUserState,

} = require("../../api/getData.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: '你好',
    userInfo: {},
    userState: null,
    hasUserInfo: false,
    adminShow: false,
    showBack:false,

    swiperList: [],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    previousMargin: 0,
    nextMargin: 0,
    discoverList: [],
    
    curPage: -1,
    maxSize: 0,
    bottom: -1,
    //发现列表采用maxPage判断
    maxPage: 0,
    noDataFlag: false,
    club_info_unchecked: false,
    site_info_unchecked: false,
    shop_info_unchecked: false,
    minipro_info_unchecked: false,
    calendar_info_unchecked: false,
    ministory_info_unchecked: false,
    challenge14_unchecked: false,
    offeryes_unchecked: false,
    register_flag:false,
    showBack: false,
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    this.onLoad(currentPage.options);
  },

  onLoad: function () {
    /*获取发现列表*/
    this.getDiscoverList();
    this.setData({
      club_info_unchecked:wx.getStorageSync("club_info_1"),
      site_info_unchecked:wx.getStorageSync("site_info_0"),
      shop_info_unchecked:wx.getStorageSync("shop_info_2"),
      minipro_info_unchecked:wx.getStorageSync("minipro_info_3"),
      calendar_info_unchecked:wx.getStorageSync("calendar_info_5"),
      ministory_info_unchecked:wx.getStorageSync("ministory_info_4"),
      challenge14_unchecked:wx.getStorageSync("challenge14_6"),
      offeryes_unchecked:wx.getStorageSync("offeryes_7"),
      register_flag:getApp().globalData.userNotSignUp,
    })
    console.log(getApp().globalData.userNotSignUp)
    api_GetAllBanners((res) => {
      if (res.length) {
        this.setData({
          swiperList: res
        });
      } else {
        this.setData({
          swiperList: [{
            url: '',
            img: 'http://www.buaa.edu.cn/__local/D/A6/CF/285952AD92970F08226AECCD5E3_C8F39F61_106FF.jpg',
            title: '学院路校区'
          }, {
            url: '',
            img: 'http://www.buaa.edu.cn/__local/8/18/50/33226DE0493305EA215E7F40655_C7255710_15B18.jpg',
            title: '图书馆'
          }, {
            url: '',
            img: 'http://www.buaa.edu.cn/__local/6/CE/0C/E18BA593FC960A0B53E7C1CD455_6532815F_38D87.jpg',
            title: '沙河校区'
          }]
        })
      }
      console.log("#########--轮播图--##########", this.data.swiperList)
    })
    if (app.globalData.userInfoByToken) {
      console.log('userInfoByToken###############', app.globalData.userInfoByToken)
      this.setData({
        userInfo: app.globalData.userInfoByToken,
        hasUserInfo: true,
        adminShow: this.hasAuthorities(['ROLE_013_Admin', 'ROLE_005_Admin', 'ROLE_010_Admin'])
      })
    }
    /* 获取用户状态，包括信用分等 */
    api_GetUserState((res) => {
      console.log('用户状态==>', res.data.data)
      this.setData({
        userState: res.data.data
      })
    })

    /* 问候语设置 */
    let now = new Date();
    let hour = now.getHours();
    if (hour < 6) {
      this.setData({
        motto: "凌晨好！"
      })
    } else if (hour < 9) {
      this.setData({
        motto: "早上好！"
      })
    } else if (hour < 12) {
      this.setData({
        motto: "上午好！"
      })
    } else if (hour < 14) {
      this.setData({
        motto: "中午好！"
      })
    } else if (hour < 17) {
      this.setData({
        motto: "下午好！"
      })
    } else if (hour < 19) {
      this.setData({
        motto: "傍晚好！"
      })
    } else if (hour < 22) {
      this.setData({
        motto: "晚上好！"
      })
    } else {
      this.setData({
        motto: "夜里好！"
      })
    };

  
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refresh();
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 1000,
    })
    this.refresh()
  },

  /**
   * 验证用户权限
   */
  hasAuthorities: function (checkList) {
    let authList = wx.getStorageSync("allAuthorities")
    for (let j = 0; j < checkList.length; j++) {
      for (let i = 0; i < authList.length; i++) {
        if (authList[i] === checkList[j]) {
          return true
        }
      }
    }
    return false
  },

  login(userinfo) { // 参数来额外接收用户数据
    app.login(userinfo, (err, res) => {
      if (err) return console.log('login function has error') // 如果登录方法出错则报错
      console.log('登录后存在全局变量中的用户信息==>', app.globalData)
      // 登录完毕后，调用用户数据等信息，使用 that.setData 写入
      this.setData({
        userInfo: app.globalData.userInfoByToken,
        hasUserInfo: true
      })
      /* 获取用户状态，包括信用分等 */
      api_GetUserState((res) => {
        console.log('用户状态==>', res.data.data)
        this.setData({
          userState: res.data.data
        })
      })
      let authList = wx.getStorageSync("allAuthorities")
      console.log('用户权限==>', authList)
      if (authList) {
        this.setData({
          adminShow: this.hasAuthorities(['ROLE_013_Admin', 'ROLE_005_Admin', 'ROLE_010_Admin'])
        })
      }
    })
  },

  logout: function (e) {
    this.setData({
      hasUserInfo: false,
      adminShow: false,
      userInfo: {},
      userState: null,
    })
    app.globalData.authoList = null,
      app.globalData.userInfoByToken = null
  },
  getDiscoverList: function (e) {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 3000,
    });
    if (this.data.curPage == this.data.maxPage) {
      console.log("==> 到达底部");
      this.setData({
        noDataFlag: true
      })
      wx.hideToast()
      return
    } else {
      let params = {
        page: this.data.curPage + 1,
        size: 3
      };
      let tmp = this.data.discoverList
      api_GetDiscoverList(params, (res) => {
        console.log("#########--获取发现列表--##########", res.data)
        //下拉刷新停止
        wx.stopPullDownRefresh()
        wx.hideToast()
        res.data.data.list.forEach(i => {
          // 临时处理
          if (i.headImgLink == "") {
            i.headImgLink = '/images/discDemo-2.35x1.jpg'
          }
          tmp.push(i)
        })
        this.setData({
          bottom: tmp.length,
          discoverList: tmp,
          curPage: res.data.data.curPage,
          maxPage: res.data.data.maxPage - 1,
        })
      })
    }
  },
  refresh: function (e) {
    console.log('动作:下拉刷新')
    /* 获取用户状态，包括信用分等 */
    api_GetUserState((res) => {
      console.log('用户状态==>', res.data.data)
      this.setData({
        userState: res.data.data
      })
      //下拉刷新停止
      wx.stopPullDownRefresh()
      wx.hideToast()
    })
  }

})