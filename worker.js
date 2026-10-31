const json = (data, status = 200) => Response.json(data, {status, headers: {"Cache-Control": "no-store"}});
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/wishes/api.php") return env.ASSETS.fetch(request);
    try {
      if (request.method === "GET") {
        const {results} = await env.DB.prepare("SELECT id, name, wish, createdAt FROM wishes ORDER BY createdAt DESC, id DESC LIMIT 500").all();
        return json({messages: results});
      }
      if (request.method !== "POST") return json({error: "Phương thức không được hỗ trợ."}, 405);
      const origin = request.headers.get("Origin");
      if (origin && origin !== url.origin) return json({error: "Yêu cầu không hợp lệ."}, 403);
      if (!request.headers.get("Content-Type")?.includes("application/json")) return json({error: "Cần gửi JSON."}, 415);
      const reader = request.body?.getReader();
      if (!reader) return json({error: "Thiếu nội dung."}, 400);
      const chunks = []; let size = 0;
      while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        size += value.length;
        if (size > 8192) { await reader.cancel(); return json({error: "Nội dung quá dài."}, 413); }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size); let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      let input;
      try { input = JSON.parse(new TextDecoder().decode(bytes)); } catch { return json({error: "JSON không hợp lệ."}, 400); }
      const name = typeof input?.name === "string" ? input.name.trim() : "";
      const wish = typeof input?.wish === "string" ? input.wish.trim() : "";
      if (!name || !wish || [...name].length > 80 || [...wish].length > 1000) return json({error: "Tên tối đa 80 ký tự và lời chúc tối đa 1000 ký tự."}, 422);
      const message = {id: crypto.randomUUID(), name, wish, createdAt: new Date().toISOString()};
      await env.DB.prepare("INSERT INTO wishes (id, name, wish, createdAt) VALUES (?, ?, ?, ?)").bind(message.id, name, wish, message.createdAt).run();
      return json({message}, 201);
    } catch (error) {
      console.error(JSON.stringify({event: "wishes_error", message: error.message}));
      return json({error: "Chưa thể lưu lời chúc. Vui lòng thử lại."}, 503);
    }
  }
};
