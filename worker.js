const json = (data, status = 200) => Response.json(data, {status, headers: {"Cache-Control": "no-store"}});
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/rsvp") return handleRsvp(request);
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

async function handleRsvp(request) {
  if (request.method !== "POST") return json({error: "Phương thức không được hỗ trợ."}, 405);
  const url = new URL(request.url);
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
    if (size > 4096) { await reader.cancel(); return json({error: "Nội dung quá dài."}, 413); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  let input;
  try { input = JSON.parse(new TextDecoder().decode(bytes)); } catch { return json({error: "JSON không hợp lệ."}, 400); }
  const name = typeof input?.name === "string" ? input.name.trim() : "";
  const attending = input?.attendance === "Có, tôi sẽ tham dự";
  const guests = typeof input?.guests === "string" ? input.guests.replace(/ người$/, "") : "";
  if (!name || [...name].length > 120 ||
      !["Có, tôi sẽ tham dự", "Rất tiếc, tôi không thể tham dự"].includes(input?.attendance) ||
      !["1","2","3","4","5","6"].includes(guests) ||
      !["Nhà Trai","Nhà Gái"].includes(input?.guestSide)) {
    return json({error: "Vui lòng điền đầy đủ thông tin hợp lệ."}, 422);
  }
  const payload = new URLSearchParams({
    "fvv": "1", "pageHistory": "0",
    "entry.559352220": name,
    "entry.877086558": attending ? "Có, tôi sẽ tới đó" : "Rất tiếc, tôi không thể tham dự",
    "entry.877086558_sentinel": "",
    "entry.924523986": guests,
    "entry.1647591272": input.guestSide
  });
  try {
    const response = await fetch("https://docs.google.com/forms/d/e/1FAIpQLSeLOwl5-elRvvJNoZNJfN0lYnCpibcLrBGTS0AV_LBpoD0gZQ/formResponse", {
      method: "POST", body: payload,
      headers: {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", "Accept-Language": "en"},
      redirect: "follow", signal: AbortSignal.timeout(15000)
    });
    // A form's HTTP 200 alone can also be a validation page. Require its confirmation view.
    let confirmation = false;
    const transformed = new HTMLRewriter().on(".vHW8K, .freebirdFormviewerViewResponseConfirmationMessage", {
      element() { confirmation = true; }
    }).transform(response);
    const bodyReader = transformed.body?.getReader();
    let total = 0;
    if (bodyReader) while (true) {
      const {done, value} = await bodyReader.read();
      if (done) break;
      total += value.length;
      if (total > 1048576) { await bodyReader.cancel(); break; }
    }
    if (!response.ok || !confirmation) {
      console.warn(JSON.stringify({event: "rsvp_unconfirmed", status: response.status}));
      return json({error: "Chưa xác minh được Google Forms đã ghi nhận. Vui lòng liên hệ cô dâu/chú rể trước khi gửi lại để tránh trùng."}, 502);
    }
    return json({ok: true});
  } catch (error) {
    console.warn(JSON.stringify({event: "rsvp_upstream_error", type: error.name}));
    return json({error: "Kết nối Google Forms bị gián đoạn. Vui lòng liên hệ cô dâu/chú rể kiểm tra trước khi gửi lại để tránh trùng."}, 504);
  }
}
