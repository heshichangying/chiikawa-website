$(function(){
  const $slides = $('.carousel-slide'),
        $carousel = $('.carousel'),
        $indicators = $('.indicator'),
        $prev = $('.prev'),
        $next = $('.next'),
        $container = $('.carousel-container');
  let idx = 0, timer;

  function show(i){
    idx = i;
    $carousel.css('transform', `translateX(-${100 * idx}%)`);
    $slides.removeClass('active').eq(idx).addClass('active');
    $indicators.removeClass('active').eq(idx).addClass('active');
  }

  function start(){
    timer = setInterval(()=>show((idx+1)%$slides.length), 5000);
  }

  function stop(){
    clearInterval(timer);
  }

  $('.prev, .next').hover(() => $(this).addClass('hovered'), () => $(this).removeClass('hovered'));
  $prev.click(()=>{stop(); show((idx-1+$slides.length)%$slides.length); start();});
  $next.click(()=>{stop(); show((idx+1)%$slides.length); start();});
  $indicators.click(function(){stop(); show($(this).data('slide')); start();});
  $container.hover(stop, start);

  show(0);
  start();

  // 头部滚动变色
  let scrollT;
  $(window).on('scroll', () => {
    clearTimeout(scrollT);
    scrollT = setTimeout(()=>{
      $('header').toggleClass('scrolled', $(window).scrollTop()>50);
    }, 100);
  });
});
