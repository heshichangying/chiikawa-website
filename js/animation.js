$(document).ready(() => {
    // 轮播图按钮动画
    $('.prev, .next').hover(
        function() {
            $(this).animate({ backgroundColor: 'rgba(0, 0, 0, 0.8)' }, 200);
        },
        function() {
            $(this).animate({ backgroundColor: 'rgba(0, 0, 0, 0.5)' }, 200);
        }
    );

    // 欢迎语淡入
    $('.welcome').hide().fadeIn(1000);

    // 滚动监听
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('header').addClass('scrolled');
        } else {
            $('header').removeClass('scrolled');
        }
    });
});