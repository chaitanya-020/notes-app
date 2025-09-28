export function notFound(_req, res) {
  return res.status(404).json({ ok: false, error: { message: 'Not found' } });
}

export function onError(err, _req, res, _next) {
  console.error(err);
  return res.status(500).json({ ok: false, error: { message: 'Server error' } });
}
