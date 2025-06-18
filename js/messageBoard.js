
$(function () {
  // 头像映射
  const avatars = {
    chiikawa: "../images/c3.jpg",
    hachiware: "../images/c1.jpg",
    usagi: "../images/c2.jpg"
  };

  // 数据及元素引用
  let messages = [];
  let undoStack = [];
  const ITEMS_PER_PAGE = 10;
  let currentPage = 1;
  const $board = $("#message-board");
  const $form = $("#message-form");
  const $nicknameInput = $("#nickname");
  const $roleSelect = $("#role");
  const $messageInput = $("#message");
  const $charCount = $(".char-count");
  const $notification = $("#chiikawa-notification");
  const $notificationText = $("#notification-text");
  const $loadMoreBtn = $("#load-more-btn");
  const $undoBtn = $("#undo-btn");
  const $avatarPreviewImg = $("#avatar-preview-img");

  // 格式化时间
  function formatTime(timestamp) {
    const now = Date.now();
    const diff = (now - timestamp) / 1000;
    if (diff < 60) return "刚刚";
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
    const d = new Date(timestamp);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  // 显示通知
  function showNotification(text) {
    $notificationText.text(text);
    $notification.show().delay(3000).fadeOut();
  }

  // 保存到本地存储
  function saveMessages() {
    if (messages.length > 100) {
      messages = messages.slice(-100); // 限制存储 100 条
    }
    localStorage.setItem("messages", JSON.stringify(messages));
  }

  // 从本地存储读取
  function loadMessages() {
    const data = localStorage.getItem("messages");
    if (data) {
      messages = JSON.parse(data);
    }
  }

  // 创建留言泡泡 DOM
  function createMessageBubble(msgObj, idx) {
    const $div = $("<div>")
      .addClass("message-bubble")
      .css({ top: msgObj.top + "px", left: msgObj.left + "px" })
      .attr("data-index", idx);

    const $avatar = $("<img>")
      .addClass("avatar")
      .attr("src", avatars[msgObj.character] || avatars.chiikawa)
      .attr("alt", `Avatar for ${msgObj.character}`);

    const $content = $("<div>").addClass("bubble-content");

    const $nick = $("<div>")
      .addClass("nickname")
      .text(DOMPurify.sanitize(msgObj.nickname || "匿名"));
    const $timeSpan = $("<span>")
      .addClass("timestamp")
      .text(formatTime(msgObj.timestamp));
    $nick.append($timeSpan);

    const $textDiv = $("<div>")
      .addClass("text")
      .text(DOMPurify.sanitize(msgObj.message));

    const $actions = $("<div>").addClass("actions");

    const $likeBtn = $("<button>")
      .addClass("like-btn")
      .html(`👍 <span class="like-count">${msgObj.likes || 0}</span>`)
      .on("click", function () {
        msgObj.likes = (msgObj.likes || 0) + 1;
        $(this).find(".like-count").text(msgObj.likes);
        saveMessages();
      });

    const $editBtn = $("<button>")
      .addClass("edit-btn")
      .text("✏️")
      .on("click", function () {
        const currentNickname = DOMPurify.sanitize($nicknameInput.val().trim() || "匿名");
        if (currentNickname !== msgObj.nickname) {
          showNotification("只能编辑自己的留言哦~");
          return;
        }
        $nicknameInput.val(msgObj.nickname);
        $roleSelect.val(msgObj.character);
        $messageInput.val(msgObj.message);
        $avatarPreviewImg.attr("src", avatars[msgObj.character]);
        messages.splice(idx, 1);
        renderMessages();
        showNotification("请修改后重新提交~");
      });

    const $deleteBtn = $("<button>")
      .addClass("delete-btn")
      .text("🗑️")
      .on("click", function () {
        undoStack.push(messages.splice(idx, 1)[0]);
        renderMessages();
        $undoBtn.prop("disabled", false);
        showNotification("留言已删除，可撤销~");
      });

    $actions.append($likeBtn, $editBtn, $deleteBtn);
    $content.append($nick, $textDiv, $actions);
    $div.append($avatar, $content);

    // 拖拽（使用 jQuery UI）
    $div.draggable({
      containment: "parent",
      start: function () {
        $(this).addClass("dragging");
      },
      stop: function (event, ui) {
        $(this).removeClass("dragging");
        const idx = +$(this).attr("data-index");
        messages[idx].top = ui.position.top;
        messages[idx].left = ui.position.left;
        saveMessages();
      }
    });

    return $div;
  }

  // 渲染留言
  function renderMessages() {
    $board.empty();
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = Math.min(start + ITEMS_PER_PAGE, messages.length);
    const visibleMessages = messages.slice(start, end);

    visibleMessages.forEach((msg, i) => {
      $board.append(createMessageBubble(msg, start + i));
    });

    $loadMoreBtn.toggle(end < messages.length);
    $undoBtn.prop("disabled", undoStack.length === 0);
  }

  // 提交留言
  $form.on("submit", function (e) {
    e.preventDefault();
    const character = $roleSelect.val();
    const nickname = DOMPurify.sanitize($nicknameInput.val().trim() || "匿名");
    const message = DOMPurify.sanitize($messageInput.val().trim());

    if (!message) {
      showNotification("留言不能为空哦~");
      return;
    }

    const newMsg = {
      character,
      nickname,
      message,
      likes: 0,
      timestamp: Date.now(),
      top: Math.random() * ($board.height() - 100),
      left: Math.random() * ($board.width() - 300)
    };

    messages.unshift(newMsg); // 新留言插入到数组开头
    currentPage = 1; // 重置到第一页
    renderMessages();
    showNotification("留言提交成功！");

    $form[0].reset();
    $avatarPreviewImg.attr("src", avatars.chiikawa);
    $charCount.text("0 / 200");
  });

  // 撤销删除
  $undoBtn.on("click", function () {
    if (undoStack.length === 0) return;
    messages.unshift(undoStack.pop());
    currentPage = 1;
    renderMessages();
    showNotification("已撤销删除！");
  });

  // 加载更多
  $loadMoreBtn.on("click", function () {
    currentPage++;
    renderMessages();
  });

  // 字符计数
  $messageInput.on("input", function () {
    $charCount.text(`${$(this).val().length} / 200`);
    $(this).css("height", "auto").css("height", this.scrollHeight + "px");
  });

  // 动态头像预览
  $roleSelect.on("change", function () {
    $avatarPreviewImg.attr("src", avatars[$(this).val()] || avatars.chiikawa);
  });

  // 初始化
  loadMessages();
  renderMessages();
  $avatarPreviewImg.attr("src", avatars.chiikawa);
});