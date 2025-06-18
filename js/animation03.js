$(document).ready(() => {
    $('.prev, .next').hover(
        function() {
            $(this).animate({ backgroundColor: '#ff1493' }, 200);
        },
        function() {
            $(this).animate({ backgroundColor: '#ff69b4' }, 200);
        }
    );

    let timeout;
    $(window).scroll(function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if ($(window).scrollTop() > 50) {
                $('header').addClass('scrolled');
            } else {
                $('header').removeClass('scrolled');
            }
        }, 100);
    });
});