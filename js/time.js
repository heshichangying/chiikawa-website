document.addEventListener('DOMContentLoaded', () => {
    // 页面加载时设置星期几
    const now = new Date();
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekdaySpan = document.getElementById('weekday');
    if (weekdaySpan) {
        weekdaySpan.textContent = `星期${weekdays[now.getDay()]}`;
    }

    // 缓存 DOM 元素
    const yearSpan = document.getElementById('time-year');
    const monthSpan = document.getElementById('time-month');
    const daySpan = document.getElementById('time-day');
    const hourSpan = document.getElementById('time-hour');
    const minuteSpan = document.getElementById('time-min'); // Fixed from time-minute
    const secondSpan = document.getElementById('time-second');

    // 更新时间函数
    function updateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        // 仅当值发生变化且元素存在时更新
        if (yearSpan && yearSpan.textContent !== year) yearSpan.textContent = year;
        if (monthSpan && monthSpan.textContent !== month) monthSpan.textContent = month;
        if (daySpan && daySpan.textContent !== day) daySpan.textContent = day;
        if (hourSpan && hourSpan.textContent !== hours) hourSpan.textContent = hours;
        if (minuteSpan && minuteSpan.textContent !== minutes) minuteSpan.textContent = minutes;
        if (secondSpan && secondSpan.textContent !== seconds) secondSpan.textContent = seconds;
    }

    // 初始时间显示
    updateTime();

    // 每秒更新时间
    setInterval(updateTime, 1000);
});