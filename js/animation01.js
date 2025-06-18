$(document).ready(() => {
    // Initialize Tabs
    const $tabs = $('.tab');
    const $panes = $('.tab-pane');

    function applyRandomEffects($pane) {
        const colors = ['#ff69b4', '#ff1493', '#ffd1dc', '#6a6a74'];
        const fontSizes = [16, 18, 20, 22, 24];
        const fontStyles = ['normal', 'italic'];
        $pane.find('.tab-text').each(function() {
            $(this).css({
                'color': colors[Math.floor(Math.random() * colors.length)],
                'font-size': `${fontSizes[Math.floor(Math.random() * fontSizes.length)]}px`,
                'font-style': fontStyles[Math.floor(Math.random() * fontStyles.length)]
            });
        });
        $pane.find('.tab-image').each(function() {
            $(this).css({
                'border-radius': `${Math.random() * 50}%`,
                'opacity': 0.7 + Math.random() * 0.3
            });
        });
    }

    // Tab Click Handler
    $tabs.on('click', function() {
        $tabs.removeClass('active');
        $panes.removeClass('active');
        $(this).addClass('active');
        const tabId = $(this).data('tab');
        const $pane = $(`#${tabId}`);
        $pane.addClass('active');
        applyRandomEffects($pane);
    });

    // Initialize First Tab
    applyRandomEffects($panes.filter('.active'));

    // Make Tabs Container Draggable
    $('.tabs-container').draggable({
        handle: '.tabs-list',
        containment: 'body',
        scroll: false,
        start: function() {
            console.log('Dragging started');
        },
        stop: function() {
            console.log('Dragging stopped');
        }
    });

    // Make Tabs Container Resizable
    $('.tabs-container').resizable({
        minWidth: 300,
        minHeight: 200,
        handles: 'se'
    });

    // Make Tabs Reorderable
    $('.tabs-list').sortable({
        axis: 'x',
        containment: 'parent',
        update: function() {
            const activeTab = $tabs.filter('.active').data('tab');
            $panes.removeClass('active');
            $(`#${activeTab}`).addClass('active');
        }
    });

    // Scroll Listener (Debounced)
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