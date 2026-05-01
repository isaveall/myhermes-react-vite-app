import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  const features = [
    {
      icon: '🔒',
      title: '安全可靠',
      description: '采用先进的加密技术和权限管理，确保您的文件安全无虞。'
    },
    {
      icon: '⚡',
      title: '高速传输',
      description: '优化的传输算法，支持大文件快速上传和下载。'
    },
    {
      icon: '📱',
      title: '多端同步',
      description: '支持Web、移动端访问，随时随地管理您的文件。'
    },
    {
      icon: '🔄',
      title: '智能管理',
      description: '自动分类、智能搜索，让文件管理更高效。'
    },
    {
      icon: '🌐',
      title: '团队协作',
      description: '支持团队文件共享和协作，提升工作效率。'
    },
    {
      icon: '📊',
      title: '数据统计',
      description: '详细的数据分析和报告，帮助您了解使用情况。'
    }
  ];

  const teamMembers = [
    { name: '张三', role: '产品经理', avatar: '👨‍💼', bio: '10年产品经验，专注于用户体验设计' },
    { name: '李四', role: '前端开发', avatar: '👨‍💻', bio: 'React专家，热爱创造精美的用户界面' },
    { name: '王五', role: '后端开发', avatar: '👨‍🔧', bio: 'Node.js专家，专注于系统架构设计' },
    { name: '赵六', role: 'UI设计师', avatar: '👩‍🎨', bio: '5年设计经验，追求极致的视觉体验' },
  ];

  const milestones = [
    { year: '2023', event: '项目启动，完成基础架构设计' },
    { year: '2024 Q1', event: '发布v1.0版本，支持基础文件上传' },
    { year: '2024 Q2', event: '发布v2.0版本，增加团队协作功能' },
    { year: '2024 Q3', event: '计划推出移动端应用' },
    { year: '2024 Q4', event: '计划集成AI智能分类功能' },
  ];

  return (
    <div className="about-page">
      {/* 页头 */}
      <div className="about-header">
        <h1>关于 Hermes 文件管理系统</h1>
        <p className="about-subtitle">
          我们致力于为企业和个人提供安全、高效、易用的文件管理解决方案
        </p>
      </div>

      {/* 公司介绍 */}
      <div className="company-intro">
        <div className="intro-content">
          <h2>我们的使命</h2>
          <p>
            Hermes 文件管理系统诞生于2023年，我们的使命是简化文件管理流程，
            让每个人都能轻松、安全地管理自己的数字资产。我们相信，好的工具应该
            让工作更高效，让协作更顺畅。
          </p>
          <p>
            通过不断的技术创新和用户反馈，我们已经帮助数百家企业提升了文件管理效率，
            减少了数据丢失风险，优化了团队协作流程。
          </p>
        </div>
        <div className="intro-stats">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">企业用户</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">日活跃用户</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">系统可用性</div>
          </div>
        </div>
      </div>

      {/* 核心功能 */}
      <div className="features-section">
        <h2>核心功能</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 团队介绍 */}
      <div className="team-section">
        <h2>我们的团队</h2>
        <p className="team-description">
          我们是一支充满激情和创造力的团队，致力于为用户提供最好的文件管理体验。
        </p>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <div className="member-avatar">{member.avatar}</div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <div className="member-role">{member.role}</div>
                <p className="member-bio">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 发展历程 */}
      <div className="milestones-section">
        <h2>发展历程</h2>
        <div className="timeline">
          {milestones.map((milestone, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-year">{milestone.year}</div>
              <div className="timeline-content">
                <div className="timeline-dot"></div>
                <div className="timeline-event">{milestone.event}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 技术栈 */}
      <div className="tech-stack">
        <h2>技术栈</h2>
        <div className="tech-grid">
          <div className="tech-item">
            <div className="tech-icon">⚛️</div>
            <div className="tech-name">React 19</div>
            <div className="tech-desc">前端框架</div>
          </div>
          <div className="tech-item">
            <div className="tech-icon">🚀</div>
            <div className="tech-name">Vite</div>
            <div className="tech-desc">构建工具</div>
          </div>
          <div className="tech-item">
            <div className="tech-icon">🟢</div>
            <div className="tech-name">Node.js</div>
            <div className="tech-desc">后端运行环境</div>
          </div>
          <div className="tech-item">
            <div className="tech-icon">🗄️</div>
            <div className="tech-name">MongoDB</div>
            <div className="tech-desc">数据库</div>
          </div>
          <div className="tech-item">
            <div className="tech-icon">☁️</div>
            <div className="tech-name">AWS S3</div>
            <div className="tech-desc">对象存储</div>
          </div>
          <div className="tech-item">
            <div className="tech-icon">🔐</div>
            <div className="tech-name">JWT</div>
            <div className="tech-desc">身份验证</div>
          </div>
        </div>
      </div>

      {/* 联系我们 */}
      <div className="contact-cta">
        <h2>想要了解更多？</h2>
        <p>我们随时准备为您提供帮助和支持。</p>
        <div className="cta-buttons">
          <button className="cta-btn primary">查看文档</button>
          <button className="cta-btn secondary">联系我们</button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;