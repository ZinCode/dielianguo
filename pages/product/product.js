import Cart from '../cart/cart-model';
const app = getApp();
const cart = new Cart();

Page({
    data: {
        // 数据加载状态提示
        loadingHidden: true,
        // 购买数量picker选择范围
        countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        // 选择后的购买数目
        productCounts: 1,
        // 当前选择的tab的在数组中的位置
        currentTabsIndex: 0,
        // 购物车总数量
        cartTotalCounts: 0,
    },
    onLoad(option) {
        // this.data.id = option.id;
        this.setData({
            id: option.id
        })
    },
    onShow() {
        this.getProductDetail()
    },
    getProductDetail() {
        app.HttpService.getProductById({id: this.data.id})
            .then(res => {
                this.setData({
                    cartTotalCounts: cart.getCartTotalCounts().counts1,
                    product: res
                })
            })
    },
    //选择购买数目
    bindPickerChange(e) {
        this.setData({
            productCounts: this.data.countsArray[e.detail.value],
        })
    },

    //切换详情面板
    onTabsItemTap(e) {
        var index = e.currentTarget.dataset.index
        this.setData({
            currentTabsIndex: index
        });
    },

    /*添加到购物车*/
    onAddingToCartTap(events) {
        //防止快速点击，这是购物车的动画效果是否在执行
        if (this.data.isFly) {
            return;
        }
        // 先执行效果
        this._flyToCartEffect(events);
        // 再执行添加到购物车
        this.addToCart();
    },

    /*将商品数据添加到内存中*/
    addToCart() {
        var tempObj = {}, keys = ['id', 'name', 'main_img_url', 'price'];
        for (var key in this.data.product) {
            if (keys.indexOf(key) >= 0) {
                tempObj[key] = this.data.product[key];
            }
        }

        cart.add(tempObj, this.data.productCounts);
    },

    /*加入购物车动效*/
    _flyToCartEffect(events) {
        //获得当前点击的位置，距离可视区域左上角
        var touches = events.touches[0];
        var diff = {
            x: '25px',
            y: 25 - touches.clientY + 'px'
        },
            style = 'display: block;-webkit-transform:translate(' + diff.x + ',' + diff.y + ') rotate(350deg) scale(0)';  //移动距离
        this.setData({
            isFly: true,
            translateStyle: style
        });
        var that = this;
        setTimeout(() => {
            that.setData({
                isFly: false,
                translateStyle: '-webkit-transform: none;',  //恢复到最初状态
                isShake: true,
            });
            setTimeout(() => {
                var counts = that.data.cartTotalCounts + that.data.productCounts;
                that.setData({
                    isShake: false,
                    cartTotalCounts: counts
                });
            }, 200);
        }, 1000);
    },

    /*跳转到购物车*/
    onCartTap() {
        wx.switchTab({
            url: '/pages/cart/cart'
        });
    },

    /*下拉刷新页面*/
    onPullDownRefresh () {
        this._loadData(() => {
            wx.stopPullDownRefresh()
        });
    },

    //分享效果
    onShareAppMessage() {
        return {
            title: '零食商贩 Pretty Vendor',
            path: 'pages/product/product?id=' + this.data.id
        }
    }

})


