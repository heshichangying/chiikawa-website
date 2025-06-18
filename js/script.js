$(window).on('load', function() {
    $('#autoWidth').lightSlider({
        item: 1,           // 每次显示1个滑块
        autoWidth: true,   // 自适应宽度
        loop: true,        // 循环播放
        auto: true,        // 自动播放
        pause: 3000,       // 每4秒切换
        speed: 500,        // 切换速度500毫秒
        controls: true,    // 显示左右箭头
        pauseOnHover: true,// 鼠标悬停时暂停
        onSliderLoad: function(el) {
            $('#autoWidth').removeClass('cs-hidden'); // 初始化后显示轮播图
            $(window).trigger('resize'); // 强制触发窗口调整
        }
    });
});