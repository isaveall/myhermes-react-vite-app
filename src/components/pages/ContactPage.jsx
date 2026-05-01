import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    contactMethod: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const contactMethods = [
    { id: 'email', label: '电子邮件', icon: '📧', value: 'support@hermes.com' },
    { id: 'phone', label: '联系电话', icon: '📞', value: '+86 400-123-4567' },
    { id: 'address', label: '办公地址', icon: '📍', value: '北京市海淀区中关村软件园' },
    { id: 'hours', label: '工作时间', icon: '🕐', value: '周一至周五 9:00-18:00' },
  ];

  const faqs = [
    {
      question: '如何注册账号？',
      answer: '点击首页右上角的"注册"按钮，填写基本信息即可完成注册。'
    },
    {
      question: '文件大小有限制吗？',
      answer: '单个文件最大支持10GB，总存储空间根据套餐不同而有所区别。'
    },
    {
      question: '支持哪些文件格式？',
      answer: '支持所有常见文件格式，包括文档、图片、视频、压缩包等。'
    },
    {
      question: '数据安全如何保障？',
      answer: '我们采用银行级加密技术，多重备份机制，确保您的数据安全。'
    },
    {
      question: '如何升级套餐？',
      answer: '在"系统设置" - "账户管理"中可以查看和升级您的套餐。'
    },
    {
      question: '技术支持响应时间？',
      answer: '工作日2小时内响应，紧急问题提供7x24小时技术支持。'
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      contactMethod: 'email'
    });

    // 3秒后重置成功状态
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  return (
    <div className="contact-page">
      {/* 页头 */}
      <div className="contact-header">
        <h1>联系我们</h1>
        <p className="contact-subtitle">
          我们随时准备为您提供帮助和支持，请选择您喜欢的方式联系我们
        </p>
      </div>

      <div className="contact-content">
        {/* 左侧：联系表单 */}
        <div className="contact-form-section">
          <div className="form-header">
            <h2>发送消息</h2>
            <p>填写以下表单，我们的团队将在24小时内回复您</p>
          </div>

          {submitSuccess && (
            <div className="success-message">
              ✅ 消息发送成功！我们已收到您的咨询，将尽快回复。
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">姓名 *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="请输入您的姓名"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">邮箱 *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="请输入您的邮箱地址"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">主题 *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">请选择咨询主题</option>
                <option value="technical">技术支持</option>
                <option value="billing">账单问题</option>
                <option value="feature">功能建议</option>
                <option value="bug">问题反馈</option>
                <option value="other">其他</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="contactMethod">首选联系方式</label>
              <div className="contact-method-options">
                {['email', 'phone'].map(method => (
                  <label key={method} className="method-option">
                    <input
                      type="radio"
                      name="contactMethod"
                      value={method}
                      checked={formData.contactMethod === method}
                      onChange={handleChange}
                    />
                    <span>{method === 'email' ? '电子邮件' : '电话'}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">详细描述 *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="请详细描述您的问题或需求..."
                rows="6"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? '发送中...' : '发送消息'}
              </button>
              <button
                type="button"
                className="reset-btn"
                onClick={() => setFormData({
                  name: '',
                  email: '',
                  subject: '',
                  message: '',
                  contactMethod: 'email'
                })}
              >
                重置表单
              </button>
            </div>
          </form>
        </div>

        {/* 右侧：联系信息 */}
        <div className="contact-info-section">
          {/* 联系卡片 */}
          <div className="contact-cards">
            {contactMethods.map(method => (
              <div key={method.id} className="contact-card">
                <div className="contact-icon">{method.icon}</div>
                <div className="contact-details">
                  <h3>{method.label}</h3>
                  <p>{method.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 社交媒体 */}
          <div className="social-section">
            <h3>关注我们</h3>
            <div className="social-links">
              <a href="#" className="social-link wechat" title="微信公众号">
                <span className="social-icon">💬</span>
                <span>微信</span>
              </a>
              <a href="#" className="social-link weibo" title="微博">
                <span className="social-icon">🐦</span>
                <span>微博</span>
              </a>
              <a href="#" className="social-link github" title="GitHub">
                <span className="social-icon">🐙</span>
                <span>GitHub</span>
              </a>
              <a href="#" className="social-link zhihu" title="知乎">
                <span className="social-icon">📚</span>
                <span>知乎</span>
              </a>
            </div>
          </div>

          {/* 常见问题 */}
          <div className="faq-section">
            <h3>常见问题</h3>
            <div className="faq-list">
              {faqs.slice(0, 4).map((faq, index) => (
                <div key={index} className="faq-item">
                  <div className="faq-question">
                    <span className="faq-icon">❓</span>
                    {faq.question}
                  </div>
                  <div className="faq-answer">{faq.answer}</div>
                </div>
              ))}
            </div>
            <a href="#" className="view-all-faq">查看全部问题 →</a>
          </div>

          {/* 紧急联系 */}
          <div className="emergency-contact">
            <div className="emergency-icon">🚨</div>
            <div className="emergency-content">
              <h4>紧急技术支持</h4>
              <p>遇到紧急问题？请拨打：</p>
              <div className="emergency-phone">+86 400-888-9999</div>
              <p className="emergency-note">7x24小时服务，仅限紧急情况</p>
            </div>
          </div>
        </div>
      </div>

      {/* 地图位置 */}
      <div className="map-section">
        <h2>我们的位置</h2>
        <div className="map-placeholder">
          <div className="map-content">
            <div className="map-marker">📍</div>
            <div className="map-info">
              <h3>北京总部</h3>
              <p>北京市海淀区中关村软件园二期</p>
              <p>邮编：100193</p>
            </div>
          </div>
          <div className="map-actions">
            <button className="map-btn">查看大图</button>
            <button className="map-btn">导航前往</button>
          </div>
        </div>
      </div>

      {/* 响应时间 */}
      <div className="response-time">
        <h3>服务响应时间承诺</h3>
        <div className="time-grid">
          <div className="time-item">
            <div className="time-icon">⚡</div>
            <div className="time-details">
              <div className="time-title">紧急问题</div>
              <div className="time-value">30分钟内响应</div>
            </div>
          </div>
          <div className="time-item">
            <div className="time-icon">📧</div>
            <div className="time-details">
              <div className="time-title">邮件咨询</div>
              <div className="time-value">24小时内回复</div>
            </div>
          </div>
          <div className="time-item">
            <div className="time-icon">💬</div>
            <div className="time-details">
              <div className="time-title">在线客服</div>
              <div className="time-value">工作日 9:00-18:00</div>
            </div>
          </div>
          <div className="time-item">
            <div className="time-icon">📞</div>
            <div className="time-details">
              <div className="time-title">电话支持</div>
              <div className="time-value">7x24小时服务</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;