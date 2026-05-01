import React, { useState } from 'react';
import './HelpCenter.css';

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState([]);

  // 分类数据
  const categories = [
    { id: 'getting-started', name: '快速开始', icon: '🚀', count: 5 },
    { id: 'file-management', name: '文件管理', icon: '📁', count: 8 },
    { id: 'account-security', name: '账户安全', icon: '🔒', count: 6 },
    { id: 'billing', name: '计费与套餐', icon: '💰', count: 4 },
    { id: 'troubleshooting', name: '故障排除', icon: '🔧', count: 7 },
    { id: 'api', name: 'API 文档', icon: '⚙️', count: 3 },
  ];

  // FAQ数据
  const faqs = {
    'getting-started': [
      { id: 1, question: '如何注册账户？', answer: '点击右上角的"注册"按钮，填写邮箱、用户名和密码即可完成注册。注册后请检查邮箱完成验证。' },
      { id: 2, question: '如何上传第一个文件？', answer: '登录后点击左侧菜单的"文件上传"，将文件拖放到上传区域或点击选择文件。支持最大10GB的单个文件。' },
      { id: 3, question: '支持哪些文件格式？', answer: '支持所有常见文件格式，包括图片（JPG、PNG、GIF）、文档（PDF、DOC、PPT）、视频（MP4、AVI、MOV）、音频（MP3、WAV）等。' },
      { id: 4, question: '如何分享文件给他人？', answer: '在文件管理页面选择文件，点击"分享"按钮，可以生成分享链接或设置密码保护。分享链接有效期可自定义。' },
      { id: 5, question: '如何下载文件？', answer: '在文件列表中找到要下载的文件，点击下载按钮即可。支持批量下载，最多可同时下载10个文件。' },
    ],
    'file-management': [
      { id: 1, question: '如何创建文件夹？', answer: '在文件管理页面点击"新建文件夹"按钮，输入文件夹名称即可。支持多级文件夹嵌套。' },
      { id: 2, question: '如何批量操作文件？', answer: '勾选多个文件后，可以使用顶部的工具栏进行批量下载、分享、移动、删除等操作。' },
      { id: 3, question: '文件大小限制是多少？', answer: '免费用户单个文件最大1GB，高级用户最大10GB。如需上传更大文件，请联系客服升级套餐。' },
      { id: 4, question: '文件保存期限是多久？', answer: '免费用户文件保存30天，高级用户永久保存。重要文件建议定期备份。' },
      { id: 5, question: '如何恢复已删除的文件？', answer: '删除的文件会在回收站保留30天，期间可以随时恢复。30天后将永久删除无法恢复。' },
      { id: 6, question: '支持文件版本管理吗？', answer: '高级套餐支持文件版本管理，可以保存最多10个历史版本，随时回滚到任意版本。' },
      { id: 7, question: '如何设置文件权限？', answer: '在文件详情页可以设置查看、编辑、下载等权限，支持按用户或用户组设置不同权限。' },
      { id: 8, question: '如何搜索文件？', answer: '使用顶部的搜索框，支持按文件名、类型、大小、修改时间等条件搜索。支持模糊搜索和高级搜索语法。' },
    ],
    'account-security': [
      { id: 1, question: '如何修改密码？', answer: '在个人中心的安全设置页面可以修改密码。建议定期更换密码，使用强密码组合。' },
      { id: 2, question: '如何启用双重验证？', answer: '在安全设置页面开启双重验证，可以使用Google Authenticator或短信验证码增强账户安全。' },
      { id: 3, question: '如何查看登录记录？', answer: '在安全设置页面可以查看最近的登录记录，包括时间、地点和设备信息。发现异常请立即修改密码。' },
      { id: 4, question: '账户被锁定了怎么办？', answer: '连续5次密码错误会导致账户锁定30分钟。可以通过邮箱重置密码或联系客服解锁。' },
      { id: 5, question: '如何注销账户？', answer: '在账户设置页面可以申请注销账户。请注意，注销后将无法恢复所有数据，请提前备份重要文件。' },
      { id: 6, question: '数据安全如何保障？', answer: '所有文件都经过AES-256加密存储，传输使用TLS 1.3加密。我们定期进行安全审计和漏洞扫描。' },
    ],
    'billing': [
      { id: 1, question: '有哪些套餐可以选择？', answer: '提供免费版、个人版、团队版和企业版四种套餐，存储空间和功能逐级增加。' },
      { id: 2, question: '如何升级套餐？', answer: '在账户设置页面选择要升级的套餐，支持支付宝、微信支付、信用卡等多种支付方式。' },
      { id: 3, question: '可以开发票吗？', answer: '所有付费套餐都支持开具增值税普通发票或专用发票，请在支付后30天内申请。' },
      { id: 4, question: '如何取消订阅？', answer: '在账户设置页面可以随时取消订阅，剩余时间将继续享受服务，到期后自动降级为免费版。' },
    ],
    'troubleshooting': [
      { id: 1, question: '上传速度很慢怎么办？', answer: '1. 检查网络连接；2. 尝试更换浏览器；3. 文件过大可尝试分片上传；4. 联系客服检查服务器状态。' },
      { id: 2, question: '文件上传失败怎么办？', answer: '1. 检查文件大小是否超限；2. 检查文件格式是否支持；3. 清除浏览器缓存后重试；4. 联系技术支持。' },
      { id: 3, question: '无法登录账户怎么办？', answer: '1. 检查用户名密码是否正确；2. 尝试重置密码；3. 检查账户是否被锁定；4. 清除浏览器Cookie后重试。' },
      { id: 4, question: '分享链接无法访问怎么办？', answer: '1. 检查链接是否过期；2. 检查是否设置了访问密码；3. 联系文件所有者确认权限；4. 链接可能已被删除。' },
      { id: 5, question: '页面加载缓慢怎么办？', answer: '1. 检查网络连接；2. 清除浏览器缓存；3. 尝试使用Chrome或Firefox浏览器；4. 禁用浏览器插件后重试。' },
      { id: 6, question: '移动端无法正常使用？', answer: '1. 确保使用最新版本App；2. 检查手机存储空间；3. 重启App后重试；4. 联系客服获取帮助。' },
      { id: 7, question: '数据丢失了怎么办？', answer: '1. 检查回收站是否有备份；2. 联系技术支持尝试恢复；3. 重要数据建议定期本地备份。' },
    ],
    'api': [
      { id: 1, question: '如何获取API密钥？', answer: '在开发者中心页面可以申请API密钥，需要验证邮箱和手机号。每个账户最多可创建5个API密钥。' },
      { id: 2, question: 'API调用频率限制是多少？', answer: '免费版每分钟100次，个人版每分钟500次，团队版每分钟2000次，企业版无限制。' },
      { id: 3, question: '有哪些API接口可用？', answer: '提供文件上传、下载、管理、用户认证、统计分析等完整API接口，详细文档请参考开发者文档。' },
    ],
  };

  // 热门文章
  const popularArticles = [
    { id: 1, title: '文件上传完整指南', category: 'getting-started', views: 1245 },
    { id: 2, title: '如何安全分享敏感文件', category: 'account-security', views: 892 },
    { id: 3, title: '批量操作文件技巧', category: 'file-management', views: 756 },
    { id: 4, title: 'API集成最佳实践', category: 'api', views: 543 },
    { id: 5, title: '移动端使用教程', category: 'getting-started', views: 432 },
  ];

  // 联系方式
  const contactMethods = [
    { type: 'email', label: '客服邮箱', value: 'support@example.com', icon: '📧' },
    { type: 'phone', label: '客服电话', value: '400-123-4567', icon: '📞' },
    { type: 'chat', label: '在线客服', value: '工作日 9:00-18:00', icon: '💬' },
    { type: 'forum', label: '社区论坛', value: 'community.example.com', icon: '👥' },
  ];

  // 切换FAQ展开状态
  const toggleFaq = (faqId) => {
    if (expandedFaqs.includes(faqId)) {
      setExpandedFaqs(expandedFaqs.filter(id => id !== faqId));
    } else {
      setExpandedFaqs([...expandedFaqs, faqId]);
    }
  };

  // 过滤FAQ
  const filteredFaqs = faqs[activeCategory].filter(faq => 
    searchQuery === '' || 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="help-center">
      {/* 头部 */}
      <div className="help-header">
        <div className="header-content">
          <div className="search-container">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="搜索问题或关键词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchQuery('')}
                >
                  ✕
                </button>
              )}
            </div>
            <button className="search-btn">
              搜索
            </button>
          </div>
        </div>
      </div>

      <div className="help-content">
        {/* 主内容区 */}
        <div className="main-content">
          {/* 当前分类标题 */}
          <div className="category-header">
            <div className="category-info">
              <span className="category-icon-large">
                {categories.find(c => c.id === activeCategory)?.icon}
              </span>
              <div>
                <h2>{categories.find(c => c.id === activeCategory)?.name}</h2>
                <p className="category-description">
                  {filteredFaqs.length} 个相关问题
                </p>
              </div>
            </div>
            <button className="ask-btn">
              <span className="btn-icon">💬</span>
              提问
            </button>
          </div>

          {/* 分类导航 - 现在放在主内容区 */}
            <div className="categories-section">
              <h3>分类</h3>
              <ul className="category-list">
                {categories.map(category => (
                  <li 
                    key={category.id}
                    className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.name}</span>
                    <span className="article-count">{category.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQ列表 */}
            <div className="faq-section">
              {filteredFaqs.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>没有找到相关结果</h3>
                  <p>尝试使用其他关键词搜索，或直接联系我们获取帮助</p>
                  <button 
                    className="contact-btn"
                    onClick={() => window.scrollTo({ top: document.querySelector('.contact-section').offsetTop, behavior: 'smooth' })}
                  >
                    联系客服
                  </button>
                </div>
              ) : (
                <div className="faq-list">
                  {filteredFaqs.map(faq => (
                    <div 
                      key={faq.id} 
                      className={`faq-item ${expandedFaqs.includes(faq.id) ? 'expanded' : ''}`}
                    >
                      <div 
                        className="faq-question"
                        onClick={() => toggleFaq(faq.id)}
                      >
                        <h3>{faq.question}</h3>
                        <span className="toggle-icon">
                          {expandedFaqs.includes(faq.id) ? '−' : '+'}
                        </span>
                      </div>
                      {expandedFaqs.includes(faq.id) && (
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                          <div className="faq-actions">
                            <button className="action-btn helpful-btn">
                              <span className="btn-icon">👍</span>
                              有帮助
                            </button>
                            <button className="action-btn not-helpful-btn">
                              <span className="btn-icon">👎</span>
                              没帮助
                            </button>
                            <button className="action-btn share-btn">
                              <span className="btn-icon">↗️</span>
                              分享
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 热门文章 */}
            <div className="popular-section">
              <h3>热门文章</h3>
              <ul className="article-list">
                {popularArticles.map(article => (
                  <li key={article.id} className="article-item">
                    <span className="article-icon">📖</span>
                    <div className="article-content">
                      <h4>{article.title}</h4>
                      <div className="article-meta">
                        <span className="article-category">{article.category}</span>
                        <span className="article-views">{article.views} 阅读</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* 联系方式 */}
            <div className="contact-section">
              <h3>联系我们</h3>
              <div className="contact-methods">
                {contactMethods.map(method => (
                  <div key={method.type} className="contact-method">
                    <span className="method-icon">{method.icon}</span>
                    <div className="method-content">
                      <h4>{method.label}</h4>
                      <p>{method.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 相关资源 */}
            <div className="resources-section">
              <h3>相关资源</h3>
              <div className="resources-grid">
                <div className="resource-card">
                  <div className="resource-icon">📚</div>
                  <h4>用户手册</h4>
                  <p>完整的产品使用指南和教程</p>
                  <button className="resource-btn">查看手册</button>
                </div>
                <div className="resource-card">
                  <div className="resource-icon">🎥</div>
                  <h4>视频教程</h4>
                  <p>观看操作演示和技巧分享</p>
                  <button className="resource-btn">观看视频</button>
                </div>
                <div className="resource-card">
                  <div className="resource-icon">📝</div>
                  <h4>更新日志</h4>
                  <p>了解最新功能和改进</p>
                  <button className="resource-btn">查看更新</button>
                </div>
                <div className="resource-card">
                  <div className="resource-icon">👥</div>
                  <h4>用户社区</h4>
                  <p>与其他用户交流经验</p>
                  <button className="resource-btn">加入社区</button>
                </div>
              </div>
            </div>

          {/* 分页 */}
          {filteredFaqs.length > 0 && (
            <div className="pagination">
              <button className="pagination-btn" disabled>
                ← 上一页
              </button>
              <span className="pagination-info">
                第 1 页，共 1 页
              </span>
              <button className="pagination-btn" disabled>
                下一页 →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 底部CTA */}
      <div className="help-footer">
        <div className="footer-content">
          <h2>还没有找到答案？</h2>
          <p>我们的客服团队随时为您提供帮助</p>
          <div className="footer-actions">
            <button className="footer-btn contact-btn">
              <span className="btn-icon">📞</span>
              联系客服
            </button>
            <button className="footer-btn ticket-btn">
              <span className="btn-icon">🎫</span>
              提交工单
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;