$(document).ready(() => {
    // Modal Handling
    function openModal(modalId) {
        $(`#${modalId}`).css('display', 'flex').attr('aria-hidden', 'false');
    }

    function closeModal(modalId) {
        $(`#${modalId}`).css('display', 'none').attr('aria-hidden', 'true');
        $(`#${modalId} form`)[0].reset();
        $(`#${modalId} .error`).text('');
        $(`#${modalId} .toggle-password`).text('显示');
        $(`#${modalId} input[type="text"], input[type="password"]`).attr('type', 'text').filter('[name="password"], [name="confirm-password"], [name="login-password"]').attr('type', 'password');
    }

    $('.modal-trigger').on('click', function() {
        const modalId = $(this).data('modal');
        openModal(modalId);
    });

    $('.modal-close').on('click', function() {
        const modalId = $(this).closest('.modal').attr('id');
        closeModal(modalId);
    });

    $('.modal').on('click', function(e) {
        if (e.target === this) {
            const modalId = $(this).attr('id');
            closeModal(modalId);
        }
    });

    $(document).on('keydown', e => {
        if (e.key === 'Escape') {
            $('.modal').each(function() {
                if ($(this).css('display') === 'flex') {
                    closeModal($(this).attr('id'));
                }
            });
        }
    });

    // Generate CAPTCHA
    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        const answer = num1 + num2;
        $('.captcha-text').text(`${num1} + ${num2} = ?`);
        return answer;
    }

    let captchaAnswer = generateCaptcha();

    // Refresh CAPTCHA
    $('.refresh-captcha').on('click', () => {
        captchaAnswer = generateCaptcha();
        $('#captcha').val('');
    });

    // Initialize Date Picker
    $('#birthdate').datepicker({
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        changeYear: true,
        yearRange: '1900:2025'
    });

    // Toggle Password Visibility
    $('.toggle-password').on('click', function() {
        const $input = $(this).siblings('input[type="password"], input[type="text"]');
        const type = $input.attr('type') === 'password' ? 'text' : 'password';
        $input.attr('type', type);
        $(this).text(type === 'password' ? '显示' : '隐藏');
    });

    // Registration Form Submission
    $('#register-form').on('submit', function(e) {
        e.preventDefault();
        $('.error').text('');

        const username = $('#username').val().trim();
        const password = $('#password').val();
        const confirmPassword = $('#confirm-password').val();
        const birthdate = $('#birthdate').val();
        const favoriteCharacter = $('input[name="favorite-character"]:checked').val();
        const region = $('#region').val();
        const captcha = $('#captcha').val();

        let isValid = true;

        // Username Validation (3-15 chars, alphanumeric)
        if (!username) {
            $('#username').siblings('.error').text('用户名不能为空');
            isValid = false;
        } else if (!/^[a-zA-Z0-9]{3,15}$/.test(username)) {
            $('#username').siblings('.error').text('用户名需为3-15个字母或数字');
            isValid = false;
        }

        // Password Validation (6-20 chars, at least one letter and one number)
        if (!password) {
            $('#password').siblings('.error').text('密码不能为空');
            isValid = false;
        } else if (!/^(?=.*[a-zA-Z])(?=.*\d).{6,20}$/.test(password)) {
            $('#password').siblings('.error').text('密码需为6-20个字符，包含字母和数字');
            isValid = false;
        }

        // Confirm Password
        if (password !== confirmPassword) {
            $('#confirm-password').siblings('.error').text('两次密码不一致');
            isValid = false;
        }

        // Birthdate
        if (!birthdate) {
            $('#birthdate').siblings('.error').text('请选择生日');
            isValid = false;
        }

        // Favorite Character
        if (!favoriteCharacter) {
            $('input[name="favorite-character"]').siblings('.error').text('请选择喜欢的角色');
            isValid = false;
        }

        // Region
        if (!region) {
            $('#region').siblings('.error').text('请选择地区');
            isValid = false;
        }

        // CAPTCHA
        if (!captcha || parseInt(captcha) !== captchaAnswer) {
            $('#captcha').siblings('.error').text('验证码错误');
            isValid = false;
        }

        if (isValid) {
            // Store user data in localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.some(user => user.username === username)) {
                $('#username').siblings('.error').text('用户名已存在');
                return;
            }
            users.push({
                username,
                password,
                birthdate,
                favoriteCharacter,
                region
            });
            localStorage.setItem('users', JSON.stringify(users));

            // Display user info
            $('#user-details').html(`
                <p><strong>用户名:</strong> ${username}</p>
                <p><strong>生日:</strong> ${birthdate}</p>
                <p><strong>喜欢的角色:</strong> ${favoriteCharacter}</p>
                <p><strong>地区:</strong> ${region}</p>
            `);
            $('#user-info').show();
            closeModal('register-modal');
            captchaAnswer = generateCaptcha();
        }
    });

    // Login Form Submission
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        $('.error').text('');

        const username = $('#login-username').val().trim();
        const password = $('#login-password').val();

        let isValid = true;

        if (!username) {
            $('#login-username').siblings('.error').text('用户名不能为空');
            isValid = false;
        }
        if (!password) {
            $('#login-password').siblings('.error').text('密码不能为空');
            isValid = false;
        }

        if (isValid) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                $('#user-details').html(`
                    <p><strong>用户名:</strong> ${user.username}</p>
                    <p><strong>生日:</strong> ${user.birthdate}</p>
                    <p><strong>喜欢的角色:</strong> ${user.favoriteCharacter}</p>
                    <p><strong>地区:</strong> ${user.region}</p>
                `);
                $('#user-info').show();
                closeModal('login-modal');
                // Show success message
                $('#success-message').css('display', 'block');
                setTimeout(() => {
                    $('#success-message').css('display', 'none');
                }, 3000);
            } else {
                $('#login-username').siblings('.error').text('用户名或密码错误');
            }
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