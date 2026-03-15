import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <h1>🪵 敲木鱼 - 排行榜系统</h1>
      <p>好友功德排行榜 API 服务</p>
      <nav style={{ marginTop: "1.5rem" }}>
        <h2>API 接口</h2>
        <ul style={{ lineHeight: 2 }}>
          <li><code>GET /api/health</code> — 健康检查</li>
          <li><code>POST /api/init</code> — 初始化数据库</li>
          <li><code>POST /api/users</code> — 创建/更新用户</li>
          <li><code>POST /api/merit</code> — 更新功德值</li>
          <li><code>POST /api/friends</code> — 添加好友关系</li>
          <li><code>GET /api/rank?openid=xxx</code> — 获取好友排行榜</li>
        </ul>
      </nav>
      <div style={{ marginTop: "1.5rem" }}>
        <Link href="/rank">查看排行榜页面 →</Link>
      </div>
    </main>
  );
}
