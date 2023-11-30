export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const externalRes = await fetch(url);
    const data = await externalRes.json();

    if (!externalRes.ok) {
      return res.status(externalRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed fetching data" });
  }
}
