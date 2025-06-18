document.addEventListener('DOMContentLoaded', () => {
    const createBtn = document.getElementById('create-btn');
    const copyBtn = document.getElementById('copy-btn');
    const insertBeforeBtn = document.getElementById('insert-before-btn');
    const insertAfterBtn = document.getElementById('insert-after-btn');
    const replaceBtn = document.getElementById('replace-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const photoContainer = document.getElementById('photo-container');
    const notification = document.getElementById('chiikawa-notification');
    const notificationText = document.getElementById('notification-text');

    const photos = [
        { path: '../images/a56.jpg', title: 'Chiikawa 56' },
        { path: '../images/a59.jpg', title: 'Chiikawa 59' },
        { path: '../images/a60.jpg', title: 'Hachiware 5' },
        { path: '../images/a61.jpg', title: 'Hachiware 6' },
        { path: '../images/a63.jpg', title: 'Usagi 3' }
    ];

    let nodeCounter = 6; // Start from 6 to avoid ID conflicts

    function showNotification(message) {
        notificationText.textContent = message;
        notification.style.display = 'flex';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    function clearIndicators() {
        document.querySelectorAll('.operation-indicators').forEach(ind => ind.innerHTML = '');
        document.querySelectorAll('.photo-node').forEach(node => node.classList.remove('selected'));
    }

    function showIndicator(node, type) {
        clearIndicators();
        node.classList.add('selected');
        const indicators = node.querySelector('.operation-indicators');
        const indicator = document.createElement('div');
        indicator.className = `indicator-text indicator-${type}`;
        indicator.textContent = type === 'insert-before' ? '插入前' :
                               type === 'insert-after' ? '插入后' :
                               type === 'replace' ? '替换' : '删除';
        indicators.appendChild(indicator);
        setTimeout(() => {
            clearIndicators();
        }, 2000);
    }

    function getPhotoIndexFromPrompt(promptMessage) {
        const photoList = photos.map((p, i) => `${i + 1}: ${p.title} (${p.path.split('/').pop()})`).join('\n');
        const input = prompt(`${promptMessage}\n可用照片:\n${photoList}\n请输入编号 (1-${photos.length}):`);
        const index = parseInt(input) - 1;
        return index >= 0 && index < photos.length ? index : null;
    }

    function getNodeIndexFromPrompt(promptMessage) {
        const nodes = Array.from(photoContainer.children);
        if (nodes.length === 0) {
            showNotification('没有可选择的照片！');
            return null;
        }
        const nodeList = nodes.map((n, i) => `${i + 1}: ${n.querySelector('img').alt}`).join('\n');
        const input = prompt(`${promptMessage}\n当前照片:\n${nodeList}\n请输入编号 (1-${nodes.length}):`);
        const index = parseInt(input) - 1;
        return index >= 0 && index < nodes.length ? index : null;
    }

    createBtn.addEventListener('click', () => {
        const photoIndex = getPhotoIndexFromPrompt('选择要创建的照片');
        if (photoIndex === null) {
            showNotification('无效照片选择！');
            return;
        }
        const newNode = document.createElement('div');
        newNode.className = 'photo-node';
        newNode.id = `photo-${nodeCounter++}`;
        newNode.dataset.photo = photos[photoIndex].path;
        newNode.innerHTML = `
            <img src="${photos[photoIndex].path}" alt="${photos[photoIndex].title}">
            <div class="operation-indicators"></div>
        `;
        photoContainer.appendChild(newNode);
        newNode.style.animation = 'fadeIn 0.5s ease';
        showNotification('新照片已创建！');
    });

    copyBtn.addEventListener('click', () => {
        const nodeIndex = getNodeIndexFromPrompt('选择要复制的照片');
        if (nodeIndex === null) {
            showNotification('无效选择！');
            return;
        }
        const targetNode = photoContainer.children[nodeIndex];
        const newNode = document.createElement('div');
        newNode.className = 'photo-node';
        newNode.id = `photo-${nodeCounter++}`;
        newNode.dataset.photo = targetNode.dataset.photo;
        newNode.innerHTML = `
            <img src="${targetNode.dataset.photo}" alt="${targetNode.querySelector('img').alt} (复制)">
            <div class="operation-indicators"></div>
        `;
        photoContainer.appendChild(newNode);
        newNode.style.animation = 'fadeIn 0.5s ease';
        showNotification('照片已复制！');
    });

    insertBeforeBtn.addEventListener('click', () => {
        const nodeIndex = getNodeIndexFromPrompt('选择在哪张照片前插入新照片');
        if (nodeIndex === null) {
            showNotification('无效选择！');
            return;
        }
        const photoIndex = getPhotoIndexFromPrompt('选择要插入的照片');
        if (photoIndex === null) {
            showNotification('无效照片选择！');
            return;
        }
        const newNode = document.createElement('div');
        newNode.className = 'photo-node';
        newNode.id = `photo-${nodeCounter++}`;
        newNode.dataset.photo = photos[photoIndex].path;
        newNode.innerHTML = `
            <img src="${photos[photoIndex].path}" alt="${photos[photoIndex].title}">
            <div class="operation-indicators"></div>
        `;
        const targetNode = photoContainer.children[nodeIndex];
        photoContainer.insertBefore(newNode, targetNode);
        newNode.style.animation = 'fadeIn 0.5s ease';
        showIndicator(targetNode, 'insert-before');
        showNotification('照片已插入到前面！');
    });

    insertAfterBtn.addEventListener('click', () => {
        const nodeIndex = getNodeIndexFromPrompt('选择在哪张照片后插入新照片');
        if (nodeIndex === null) {
            showNotification('无效选择！');
            return;
        }
        const photoIndex = getPhotoIndexFromPrompt('选择要插入的照片');
        if (photoIndex === null) {
            showNotification('无效照片选择！');
            return;
        }
        const newNode = document.createElement('div');
        newNode.className = 'photo-node';
        newNode.id = `photo-${nodeCounter++}`;
        newNode.dataset.photo = photos[photoIndex].path;
        newNode.innerHTML = `
            <img src="${photos[photoIndex].path}" alt="${photos[photoIndex].title}">
            <div class="operation-indicators"></div>
        `;
        const targetNode = photoContainer.children[nodeIndex];
        if (targetNode.nextSibling) {
            photoContainer.insertBefore(newNode, targetNode.nextSibling);
        } else {
            photoContainer.appendChild(newNode);
        }
        newNode.style.animation = 'fadeIn 0.5s ease';
        showIndicator(targetNode, 'insert-after');
        showNotification('照片已插入到后面！');
    });

    replaceBtn.addEventListener('click', () => {
        const nodeIndex = getNodeIndexFromPrompt('选择要替换的照片');
        if (nodeIndex === null) {
            showNotification('无效选择！');
            return;
        }
        const photoIndex = getPhotoIndexFromPrompt('选择替换的照片');
        if (photoIndex === null) {
            showNotification('无效照片选择！');
            return;
        }
        const newNode = document.createElement('div');
        newNode.className = 'photo-node';
        newNode.id = `photo-${nodeCounter++}`;
        newNode.dataset.photo = photos[photoIndex].path;
        newNode.innerHTML = `
            <img src="${photos[photoIndex].path}" alt="${photos[photoIndex].title}">
            <div class="operation-indicators"></div>
        `;
        const targetNode = photoContainer.children[nodeIndex];
        photoContainer.replaceChild(newNode, targetNode);
        newNode.style.animation = 'fadeIn 0.5s ease';
        showIndicator(newNode, 'replace');
        showNotification('照片已替换！');
    });

    deleteBtn.addEventListener('click', () => {
        const nodeIndex = getNodeIndexFromPrompt('选择要删除的照片');
        if (nodeIndex === null) {
            showNotification('无效选择！');
            return;
        }
        const targetNode = photoContainer.children[nodeIndex];
        if (confirm(`确定要删除照片 "${targetNode.querySelector('img').alt}" 吗？`)) {
            targetNode.style.animation = 'shake 0.3s ease';
            showIndicator(targetNode, 'delete');
            setTimeout(() => {
                photoContainer.removeChild(targetNode);
                showNotification('照片已删除！');
            }, 300);
        } else {
            showNotification('删除已取消！');
        }
    });
});