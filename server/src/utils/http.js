export function sendOk(res, data = null) {
  return res.json({ ok: true, data });
}
export function sendError(res, status = 400, message = 'Bad request') {
  return res.status(status).json({ ok: false, error: { message } });
}
