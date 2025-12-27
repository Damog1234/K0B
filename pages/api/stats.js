export default async function handler(req, res) {
  const guildId = "1237055789441487021";
  try {
    const pages = Array.from({ length: 50 }, (_, i) => i);
    const requests = pages.map(page => 
      fetch(`https://mee6.xyz/api/plugins/levels/leaderboard/${guildId}?page=${page}`).then(r => r.json())
    );
    const results = await Promise.all(requests);
    const allPlayers = results.flatMap(data => data.players || []);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(allPlayers);
  } catch (err) {
    return res.status(500).json({ error: "MEE6 API Lag" });
  }
}
