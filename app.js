// 密码管理器应用 - 主JavaScript文件

document.addEventListener('DOMContentLoaded', function() {
    // 初始化应用
    initApp();
});

// 应用状态
const appState = {
    passwords: [],
    currentPasswordId: null,
    searchQuery: '',
    currentCategory: 'all',
    currentTab: 'all',
    passwordHistory: []
};

// 初始化应用
function initApp() {
    loadPasswords();
    loadPasswordHistory();
    setupEventListeners();
    updateUI();
}

// 从localStorage加载密码
function loadPasswords() {
    const saved = localStorage.getItem('vaultguard_passwords');
    if (saved) {
        try {
            appState.passwords = JSON.parse(saved);
        } catch (e) {
            console.error('加载密码时出错:', e);
            appState.passwords = [];
        }
    }
}

// 加载密码生成历史
function loadPasswordHistory() {
    const saved = localStorage.getItem('vaultguard_password_history');
    if (saved) {
        try {
            appState.passwordHistory = JSON.parse(saved);
        } catch (e) {
            console.error('加载密码历史时出错:', e);
            appState.passwordHistory = [];
        }
    }
}

// 保存密码到localStorage
function savePasswords() {
    localStorage.setItem('vaultguard_passwords', JSON.stringify(appState.passwords));
    updateUI();
}

// 保存密码历史
function savePasswordHistory() {
    // 只保留最近10个生成的密码
    if (appState.passwordHistory.length > 10) {
        appState.passwordHistory = appState.passwordHistory.slice(-10);
    }
    localStorage.setItem('vaultguard_password_history', JSON.stringify(appState.passwordHistory));
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索功能
    document.getElementById('search-btn').addEventListener('click', toggleSearch);
    document.getElementById('clear-search').addEventListener('click', clearSearch);
    document.getElementById('search-input').addEventListener('input', handleSearch);

    // 添加密码按钮
    document.getElementById('add-btn').addEventListener('click', showAddModal);
    document.getElementById('quick-add').addEventListener('click', showAddModal);
    document.getElementById('add-first-btn').addEventListener('click', showAddModal);

    // 设置按钮
    document.getElementById('settings-btn').addEventListener('click', showSettingsModal);

    // 模态框控制
    document.getElementById('close-add-modal').addEventListener('click', hideAddModal);
    document.getElementById('cancel-password').addEventListener('click', hideAddModal);
    document.getElementById('close-generator-modal').addEventListener('click', hideGeneratorModal);
    document.getElementById('close-settings-modal').addEventListener('click', hideSettingsModal);

    // 密码表单
    document.getElementById('password-form').addEventListener('submit', handleSavePassword);
    document.getElementById('toggle-password').addEventListener('click', togglePasswordVisibility);
    document.getElementById('generate-from-modal').addEventListener('click', showGeneratorModal);

    // 生成器功能
    document.getElementById('quick-generate').addEventListener('click', showGeneratorModal);
    document.getElementById('password-length').addEventListener('input', updatePasswordLength);
    document.getElementById('regenerate-password').addEventListener('click', generatePassword);
    document.getElementById('use-password').addEventListener('click', useGeneratedPassword);
    document.getElementById('copy-generated').addEventListener('click', copyGeneratedPassword);
    document.getElementById('refresh-generated').addEventListener('click', generatePassword);

    // 快捷操作
    document.getElementById('quick-import').addEventListener('click', handleImport);
    document.getElementById('quick-export').addEventListener('click', handleExport);
    document.getElementById('quick-backup').addEventListener('click', handleBackup);
    document.getElementById('quick-security').addEventListener('click', handleSecurityCheck);
    
    // 查看全部按钮
    document.getElementById('view-all').addEventListener('click', function() {
        showToast('查看全部功能即将推出!');
    });

    // 筛选和排序按钮
    document.getElementById('filter-btn').addEventListener('click', function() {
        showToast('筛选功能即将推出!');
    });
    document.getElementById('sort-btn').addEventListener('click', function() {
        showToast('排序功能即将推出!');
    });

    // 顶部标签页
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            switchTab(tab);
        });
    });

    // 设置功能
    document.getElementById('backup-now').addEventListener('click', handleBackup);
}

// 切换标签页
function switchTab(tab) {
    appState.currentTab = tab;
    
    // 更新按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });
    
    // 根据标签页更新显示
    updateUI();
}

// 切换搜索栏
function toggleSearch() {
    const searchContainer = document.getElementById('search-container');
    searchContainer.classList.toggle('active');
    if (searchContainer.classList.contains('active')) {
        document.getElementById('search-input').focus();
    }
}

// 清除搜索
function clearSearch() {
    document.getElementById('search-input').value = '';
    appState.searchQuery = '';
    updateUI();
}

// 处理搜索输入
function handleSearch(e) {
    appState.searchQuery = e.target.value.toLowerCase();
    updateUI();
}

// 显示添加密码模态框
function showAddModal() {
    document.getElementById('add-modal').classList.add('active');
    document.getElementById('service-name').focus();
    appState.currentPasswordId = null;
    resetForm();
}

// 隐藏添加密码模态框
function hideAddModal() {
    document.getElementById('add-modal').classList.remove('active');
}

// 显示生成器模态框
function showGeneratorModal() {
    document.getElementById('generator-modal').classList.add('active');
    generatePassword();
    updatePasswordHistory();
}

// 隐藏生成器模态框
function hideGeneratorModal() {
    document.getElementById('generator-modal').classList.remove('active');
}

// 显示设置模态框
function showSettingsModal() {
    document.getElementById('settings-modal').classList.add('active');
}

// 隐藏设置模态框
function hideSettingsModal() {
    document.getElementById('settings-modal').classList.remove('active');
}

// 切换密码可见性
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('toggle-password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    toggleBtn.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
}

// 更新密码长度显示
function updatePasswordLength() {
    const length = document.getElementById('password-length').value;
    document.getElementById('length-value').textContent = length;
    generatePassword();
}

// 生成随机密码
function generatePassword() {
    const length = parseInt(document.getElementById('password-length').value);
    const includeUppercase = document.getElementById('include-uppercase').checked;
    const includeLowercase = document.getElementById('include-lowercase').checked;
    const includeNumbers = document.getElementById('include-numbers').checked;
    const includeSymbols = document.getElementById('include-symbols').checked;

    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    // 确保至少选择了一个字符集
    if (charset === '') {
        charset = lowercase + uppercase + numbers;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    document.getElementById('generated-password').value = password;
    updatePasswordStrength(password);
    
    // 添加到历史记录
    addToPasswordHistory(password);
}

// 添加到密码历史
function addToPasswordHistory(password) {
    const historyItem = {
        password: password,
        timestamp: new Date().toISOString(),
        strength: calculatePasswordStrength(password)
    };
    
    appState.passwordHistory.push(historyItem);
    savePasswordHistory();
    updatePasswordHistory();
}

// 更新密码历史显示
function updatePasswordHistory() {
    const historyList = document.getElementById('password-history');
    if (!historyList) return;
    
    historyList.innerHTML = appState.passwordHistory.slice().reverse().map(item => `
        <div class="history-item">
            <span class="history-password">${item.password}</span>
            <div class="history-actions">
                <button class="history-copy" data-password="${item.password}">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // 为复制按钮添加事件监听器
    document.querySelectorAll('.history-copy').forEach(btn => {
        btn.addEventListener('click', function() {
            const password = this.dataset.password;
            copyToClipboard(password);
        });
    });
}

// 计算密码强度
function calculatePasswordStrength(password) {
    let strength = 0;
    
    // 检查长度
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;

    // 检查字符种类
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    return Math.min(strength, 100);
}

// 更新密码强度指示器
function updatePasswordStrength(password) {
    let strength = calculatePasswordStrength(password);
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');

    // 更新UI
    strengthBar.style.width = `${strength}%`;

    // 根据强度设置颜色和文本
    if (strength < 40) {
        strengthBar.style.background = '#ff4757';
        strengthText.textContent = '弱';
    } else if (strength < 70) {
        strengthBar.style.background = '#ffa502';
        strengthText.textContent = '一般';
    } else if (strength < 90) {
        strengthBar.style.background = '#2ed573';
        strengthText.textContent = '强';
    } else {
        strengthBar.style.background = '#1e90ff';
        strengthText.textContent = '非常强';
    }
}

// 在表单中使用生成的密码
function useGeneratedPassword() {
    const generatedPassword = document.getElementById('generated-password').value;
    document.getElementById('password').value = generatedPassword;
    hideGeneratorModal();
}

// 复制生成的密码到剪贴板
function copyGeneratedPassword() {
    const passwordField = document.getElementById('generated-password');
    copyToClipboard(passwordField.value);
}

// 复制到剪贴板通用函数
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('密码已复制到剪贴板!');
    }).catch(err => {
        console.error('复制失败:', err);
        showToast('复制密码失败');
    });
}

// 处理保存密码
function handleSavePassword(e) {
    e.preventDefault();

    const service = document.getElementById('service-name').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const category = document.getElementById('category').value;
    const notes = document.getElementById('notes').value.trim();
    const url = document.getElementById('url').value.trim();
    const isFavorite = document.getElementById('is-favorite').checked;

    if (!service || !username || !password) {
        showToast('请填写所有必填字段');
        return;
    }

    const passwordData = {
        id: appState.currentPasswordId || Date.now().toString(),
        service,
        username,
        password,
        category,
        notes,
        url,
        isFavorite,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    if (appState.currentPasswordId) {
        // 更新现有密码
        const index = appState.passwords.findIndex(p => p.id === appState.currentPasswordId);
        if (index !== -1) {
            appState.passwords[index] = passwordData;
        }
    } else {
        // 添加新密码
        appState.passwords.push(passwordData);
    }

    savePasswords();
    hideAddModal();
    showToast(appState.currentPasswordId ? '密码已更新!' : '密码已保存!');
}

// 重置表单
function resetForm() {
    document.getElementById('password-form').reset();
    document.getElementById('password').type = 'password';
    document.getElementById('toggle-password').innerHTML = '<i class="fas fa-eye"></i>';
    document.getElementById('is-favorite').checked = false;
}

// 根据当前状态更新UI
function updateUI() {
    updateStats();
    updatePasswordList();
    updateSecurityStatus();
}

// 更新统计信息
function updateStats() {
    const total = appState.passwords.length;
    document.getElementById('total-passwords').textContent = total;
    document.getElementById('tab-password-count').textContent = total;
    
    // 计算安全指数
    const strongPasswords = appState.passwords.filter(p => {
        return calculatePasswordStrength(p.password) >= 70;
    }).length;
    
    const securityPercentage = total > 0 ? Math.round((strongPasswords / total) * 100) : 85;
    document.getElementById('secure-percentage').textContent = `${securityPercentage}%`;
    
    // 计算最近添加的密码（24小时内）
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentCount = appState.passwords.filter(p => {
        return new Date(p.createdAt) > oneDayAgo;
    }).length;
    document.getElementById('recent-count').textContent = recentCount;
}

// 更新密码列表显示
function updatePasswordList() {
    const container = document.getElementById('password-list');
    const filteredPasswords = filterPasswords();

    if (filteredPasswords.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-key"></i>
                <h4>未找到密码</h4>
                <p>${appState.searchQuery || appState.currentTab !== 'all' ? '尝试更改搜索或过滤条件' : '添加第一个密码开始使用'}</p>
                <button class="btn btn-primary" id="add-first-btn">
                    添加第一个密码
                </button>
            </div>
        `;
        // 重新附加事件监听器
        document.getElementById('add-first-btn')?.addEventListener('click', showAddModal);
        return;
    }

    // 根据当前标签页显示密码
    let displayPasswords = filteredPasswords;
    if (appState.currentTab === 'favorites') {
        displayPasswords = filteredPasswords.filter(p => p.isFavorite);
    } else if (appState.currentTab === 'categories') {
        // 按分类分组显示
        displayPasswords = filteredPasswords.slice(0, 10); // 限制显示数量
    }
    
    container.innerHTML = displayPasswords.map(password => `
        <div class="password-item" data-id="${password.id}">
            <div class="password-item-main">
                <div class="service-info">
                    <div class="service-icon">
                        <i class="fas fa-${getServiceIcon(password.service)}"></i>
                    </div>
                    <div class="service-details">
                        <h4>${escapeHtml(password.service)} ${password.isFavorite ? '<i class="fas fa-star" style="color: #ffd166; font-size: 0.9rem;"></i>' : ''}</h4>
                        <p>${escapeHtml(password.username)}</p>
                    </div>
                </div>
                <div class="password-actions">
                    <button class="action-btn copy-btn" title="复制密码">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="action-btn edit-btn" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="password-item-meta">
                <span class="category-badge ${password.category}">${getCategoryName(password.category)}</span>
                <span class="timestamp">${formatDate(password.updatedAt)}</span>
            </div>
        </div>
    `).join('');

    // 为密码项添加事件监听器
    document.querySelectorAll('.password-item').forEach(item => {
        const id = item.dataset.id;
        
        // 复制按钮
        item.querySelector('.copy-btn').addEventListener('click', () => copyPassword(id));
        
        // 编辑按钮
        item.querySelector('.edit-btn').addEventListener('click', () => editPassword(id));
        
        // 删除按钮
        item.querySelector('.delete-btn').addEventListener('click', () => deletePassword(id));
    });
}

// 根据搜索和分类过滤密码
function filterPasswords() {
    return appState.passwords.filter(password => {
        const matchesSearch = appState.searchQuery === '' || 
            password.service.toLowerCase().includes(appState.searchQuery) ||
            password.username.toLowerCase().includes(appState.searchQuery) ||
            (password.notes && password.notes.toLowerCase().includes(appState.searchQuery));
        
        return matchesSearch;
    });
}

// 获取服务图标
function getServiceIcon(service) {
    const serviceLower = service.toLowerCase();
    if (serviceLower.includes('google')) return 'google';
    if (serviceLower.includes('facebook')) return 'facebook';
    if (serviceLower.includes('twitter')) return 'twitter';
    if (serviceLower.includes('github')) return 'github';
    if (serviceLower.includes('apple')) return 'apple';
    if (serviceLower.includes('microsoft')) return 'microsoft';
    if (serviceLower.includes('amazon')) return 'amazon';
    if (serviceLower.includes('paypal')) return 'paypal';
    if (serviceLower.includes('bank')) return 'university';
    if (serviceLower.includes('mail') || serviceLower.includes('email')) return 'envelope';
    return 'globe';
}

// 获取分类名称
function getCategoryName(category) {
    const categoryMap = {
        'personal': '个人',
        'work': '工作',
        'social': '社交媒体',
        'finance': '财务',
        'other': '其他'
    };
    return categoryMap[category] || category;
}

// 格式化日期显示
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays} 天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`;
    return date.toLocaleDateString('zh-CN');
}

// 更新安全状态
function updateSecurityStatus() {
    const strongPasswords = appState.passwords.filter(p => {
        return calculatePasswordStrength(p.password) >= 70;
    }).length;
    
    const securityPercentage = appState.passwords.length > 0 ? 
        Math.round((strongPasswords / appState.passwords.length) * 100) : 85;
    
    document.getElementById('security-meter-fill').style.width = `${securityPercentage}%`;
}

// 复制密码到剪贴板
function copyPassword(id) {
    const password = appState.passwords.find(p => p.id === id);
    if (!password) return;

    copyToClipboard(password.password);
}

// 编辑密码
function editPassword(id) {
    const password = appState.passwords.find(p => p.id === id);
    if (!password) return;

    appState.currentPasswordId = id;
    
    document.getElementById('service-name').value = password.service;
    document.getElementById('username').value = password.username;
    document.getElementById('password').value = password.password;
    document.getElementById('category').value = password.category;
    document.getElementById('url').value = password.url || '';
    document.getElementById('notes').value = password.notes || '';
    document.getElementById('is-favorite').checked = password.isFavorite || false;
    
    showAddModal();
}

// 删除密码
function deletePassword(id) {
    if (confirm('确定要删除这个密码吗?')) {
        appState.passwords = appState.passwords.filter(p => p.id !== id);
        savePasswords();
        showToast('密码已删除');
    }
}

// 处理导入（占位符）
function handleImport() {
    showToast('导入功能即将推出!');
}

// 处理导出（占位符）
function handleExport() {
    if (appState.passwords.length === 0) {
        showToast('没有密码可导出');
        return;
    }

    const dataStr = JSON.stringify(appState.passwords, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `vaultguard-passwords-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.style.display = 'none';
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    showToast('密码导出成功!');
}

// 处理备份
function handleBackup() {
    showToast('备份功能即将推出!');
}

// 处理安全检查
function handleSecurityCheck() {
    const weakPasswords = appState.passwords.filter(p => {
        return calculatePasswordStrength(p.password) < 70;
    }).length;
    
    if (weakPasswords === 0) {
        showToast('所有密码都很安全!');
    } else {
        showToast(`发现${weakPasswords}个弱密码，建议修改`);
    }
}

// 显示提示通知
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 转义HTML以防止XSS攻击
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
