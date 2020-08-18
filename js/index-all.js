
// 全局处理 阻止浏览器默认动作
(function () {
    // 全局阻止浏览器默认动作
    var app = document.querySelector('#app'); // 获取元素
    app.addEventListener('touchstart', function (event) {
       event.preventDefault();  // 阻止默认事件
    });

    // 让链接恢复链接的功能
    var aNodes = document.querySelectorAll('a[href]');  // 获取所有的超链接
    aNodes.forEach(function (aNode) {
        //监听事件
        aNode.addEventListener('touchend', function () {
            location.href = this.href;
        });
    });
    
})();


// 实现移动端屏幕适配
(function () {
    // 获取视口宽度
    var viewW = document.documentElement.clientWidth;

    // 计算字体大小
    var fontSize = viewW / 16;

    // 设置根元素的字体大小
    document.documentElement.style.fontSize = fontSize + 'px';
})();


// header
(function () {
    // 让input获取焦点的
    var inputNode = document.querySelector('#header input'); // 获取input元素
    inputNode.addEventListener('touchstart', function (event) {
        this.focus(); //手动获取焦点
        event.stopPropagation(); //阻止冒泡
        event.preventDefault(); // 阻止默认动作
    });
    // 失去焦点
    document.addEventListener('touchstart', function () {
        inputNode.blur();
    });

    // 菜单按钮
    var menuBtn = document.querySelector('#header .menu-btn'); // 菜单按钮元素
    var menuList = document.querySelector('#header .menu-list');  // 子菜单元素
    // 触摸菜单按钮
    menuBtn.addEventListener('touchstart', function (event) {
        this.classList.toggle('open');
        menuList.classList.toggle('open');

        event.stopPropagation(); // 阻止冒泡
        event.preventDefault(); // 阻止默认动作
    });
    // 触摸其他地方，收起菜单
    document.addEventListener('touchstart', function () {
        menuBtn.classList.remove('open');
        menuList.classList.remove('open');
    });
})();

// 导航可以拖动
(function () {
    // 获取元素
    var nav = document.querySelector('#main .nav');
    var navList = nav.querySelector('.nav-list');  // 被拖动的元素

    // 触摸开始
    nav.addEventListener('touchstart', function (event) {
        var touch = event.changedTouches[0];  // 获取触摸对象
        this.startX = touch.clientX;   // 记录触点的开始位置
        this.eleX = transformCss(navList, 'translateX');  // navList初始位置
        this.startTime = (new Date).getTime();
        this.dstX = 0;

        // 去掉过渡
        navList.style.transition = 'none';
    });

    // 触摸移动
    nav.addEventListener('touchmove', function (event) {
        var touch = event.changedTouches[0]; // 获取触点对象
        var endX = touch.clientX;  // 计算触点的结束位置
        this.dstX = endX - this.startX;   // 手指滑动的距离

        // 计算navList的偏移量  起始位置+手指划过的距离
        var translateX = this.eleX + this.dstX;


        // 限制偏移量范围
        if (translateX > 0) {
            // translateX在增大，但是增幅减小
            // 计算比例，随着translateX变大，比例变小 （最大值 从接近1开始 变小幅度不大）
            var scale = 1 - translateX / (nav.clientWidth * 2);
            // 重新计算translateX
            translateX = translateX * scale;
        } else if (translateX < nav.clientWidth - navList.offsetWidth) {
            // 计算navList距离右边的距离
            var rigthX = nav.clientWidth - (navList.offsetWidth + translateX);
            // 计算比例
            var scale = 1 - rigthX / (nav.clientWidth * 2);

            // 重新计算偏移位置
            translateX = (nav.clientWidth - navList.offsetWidth) - rigthX * scale;
        }

        // 设置navlList偏移
        transformCss(navList, 'translateX', translateX);

    });

    // 触摸结束
    nav.addEventListener('touchend', function (event) {
        var endTime = (new Date).getTime();  // 获取时间戳
        var dstTime = endTime - this.startTime;  // 计算时间差
        var speed = this.dstX / dstTime * 200;  // 速度


        // 获取当前的偏移位置
        var translateX = transformCss(navList, 'translateX');

        // 给偏移位置加速
        translateX += speed;

        var bezier = '';
        // 位置判断 临界值
        if (translateX > 0) {
            translateX = 0;
            bezier = 'cubic-bezier(0.08, 1.44, 0.6, 1.46)';
        } else if (translateX < nav.clientWidth - navList.offsetWidth) {
            translateX = nav.clientWidth - navList.offsetWidth;
            bezier = 'cubic-bezier(0.08, 1.44, 0.6, 1.46)';
        }

        // 添加过渡效果
        navList.style.transition = '.5s transform ' + bezier;

        // 重新设置当前偏移位置
        transformCss(navList, 'translateX', translateX);


    });
})();

// 导航可点击
(function () {
    // 获取元素
    var navItems = document.querySelectorAll('.nav .nav-list li');
    var isSwiper = false; // 标记是否正在滑动

    // 给每个导航元素监听
    navItems.forEach(function (navItem) {

        // 监听touchmove操作
        navItem.addEventListener('touchmove', function () {
            isSwiper = true;  //标记导航正在滑动
        });

        // 监听touchend
        navItem.addEventListener('touchend', function () {
            // 如果导航正在滑动
            if (isSwiper) {
                isSwiper = false;  // 重新恢复最初从状态
                return;
            }

            // 其他所有的导航取消选中
            navItems.forEach(function (item) {
                item.classList.remove('active');
            });

            // 当前点击的导航选中状态
            this.classList.add('active');
        });
    })
})();


// 轮播图
(function () {
    swiper({
        ele: document.querySelector('.swiper'),
        pagination: document.querySelector('.pagination'),
        isAutoPlay: true
    });
})();

// tab可拖动
(function () {
    // 获取所有的tab元素
    tabItems = document.querySelectorAll('#main .tab');

    // 对每个tab调用函数
    tabItems.forEach(function (tabItem) {
        tabSwiper(tabItem);
    });

    // tab滑动切换
    function tabSwiper(tabNode) {
        // 获取元素
        var tabContent = tabNode.querySelector('.tab-content');
        var tabList = tabContent.querySelector('.tab-list');
        var tabLoadings = tabContent.querySelectorAll('.tab-loading');
        var activeBorder = tabNode.querySelector('.active-border');
        var tabNavItems = tabNode.querySelectorAll('.tab-nav a');
        var index = 0; // 当前索引

        // 计算每个项目的宽度
        var itemWidth = tabList.offsetWidth;

        // tabContent位移变化
        transformCss(tabContent, 'translateX', -itemWidth);

        // touchstart
        tabList.addEventListener('touchstart', function (event) {
            var touch = event.changedTouches[0]; // 获取touch对象
            this.startX = touch.clientX; // 触点开始位置
            this.eleX = transformCss(tabContent, 'translateX');
            this.dstX = 0;

            tabContent.style.transition = 'none'; // 取消过渡

            // 把加载图片隐藏了
            tabLoadings.forEach(function (item) {
                item.style.opacity = '0';
            });
        });

        // touchmove
        tabList.addEventListener('touchmove', function (event) {
            var touch = event.changedTouches[0]; // 触点对象
            var endX = touch.clientX;  // 触点结束位置
            this.dstX = endX - this.startX;  // 触点滑动的距离

            // 计算偏移量
            var translateX = this.eleX + this.dstX;

            // 如果滑动的距离超过一半
            if (Math.abs(this.dstX) >= itemWidth/2) {
                tabContent.style.transition = '.5s';
                if (this.dstX < 0) {
                    translateX = -itemWidth * 2;
                } else if (this.dstX > 0){
                    translateX = 0;
                }
            }

            // 设置translateX 属性
            transformCss(tabContent, 'translateX', translateX);
        });

        // touchend
        tabList.addEventListener('touchend', function () {
            // 如果滑动距离小于一半
            if (Math.abs(this.dstX) < itemWidth / 2) {
                tabContent.style.transition = '.5s';
                transformCss(tabContent, 'translateX', -itemWidth);
            }
        });

        // tabLoading的过渡不要冒泡
        tabLoadings.forEach(function (tabLoadingItem) {
            tabLoadingItem.addEventListener('transitionend', function (event) {
                event.stopPropagation(); // 阻止冒泡
            });
        });

        // 过渡完成后
        tabContent.addEventListener('transitionend', function () {
            if (transformCss(tabContent, 'translateX') === -itemWidth) {
                return;
            }
            console.log('过渡完成');
            // 显示加载图
            tabLoadings.forEach(function (item) {
                item.style.opacity = 1;
            });

            // 2000ms 之后，加载新的数据
            setTimeout(function () {
                // 快速切换
                tabContent.style.transition = 'none';
                transformCss(tabContent, 'translateX', -itemWidth);

                // 隐藏加载图
                tabLoadings.forEach(function (item) {
                    item.style.opacity = 0;
                });
            }, 2000);

            // 导航切换
            if (tabList.dstX < 0) {
                index ++;  // 下一个
            } else if (tabList.dstX > 0){
                index --;  // 上一个
            }

            // 限定范围
            if (index < 0) {
                index = tabNavItems.length - 1;
            } else if (index > tabNavItems.length - 1) {
                index = 0;
            }

            // 切换导航
            transformCss(activeBorder, 'translateX', tabNavItems[0].offsetWidth * index);
        });
    }
})();
