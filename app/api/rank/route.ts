import { query, initDB } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await initDB();
    const openid = req.nextUrl.searchParams.get("openid");

    // Not logged in
    if (!openid) {
      return Response.json({
        ok: false,
        error: "未登录，请先授权微信登录后查看排行榜",
        code: "NOT_LOGGED_IN"
      }, { status: 401 });
    }

    // Check user exists
    const userRes = await query(`SELECT * FROM users WHERE openid = $1`, [openid]);
    if (userRes.rowCount === 0) {
      return Response.json({
        ok: false,
        error: "未登录，请先授权微信登录后查看排行榜",
        code: "NOT_LOGGED_IN"
      }, { status: 401 });
    }

    // Get friends + self, ordered by merit DESC
    const res = await query(
      `SELECT u.openid, u.nickname, u.avatar, u.merit
       FROM users u
       WHERE u.openid = $1
          OR u.openid IN (SELECT friend_openid FROM friendships WHERE user_openid = $1)
       ORDER BY u.merit DESC, u.updated_at ASC`,
      [openid]
    );

    const ranking = res.rows.map((row: any, idx: number) => ({
      rank: idx + 1,
      openid: row.openid,
      nickname: row.nickname,
      avatar: row.avatar,
      merit: Number(row.merit),
      is_self: row.openid === openid
    }));

    // If only self and no friends => empty state
    const hasFriends = ranking.length > 1;

    return Response.json({
      ok: true,
      ranking,
      total: ranking.length,
      has_friends: hasFriends,
      message: hasFriends ? null : "暂无好友排名数据，快邀请好友一起敲木鱼吧！"
    });
  } catch (e: any) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
