export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { territory, bet, carType, nitrous, altRoad, type } = req.body;

  const forumChannelId = process.env.FORUM_CHANNEL_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  const messageContent = `
Territory yang digunakan : **${territory}**
Jumlah uang taruhan : ${bet}
Jenis Mobil : ${carType}
Nitrous : ${nitrous}
Alternative Road : ${altRoad}
Tipe : ${type}
  `;

  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${forumChannelId}/threads`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bot ${botToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Challenge: ${territory}`,
          auto_archive_duration: 1440,
          message: { content: messageContent },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ message: 'Failed to create challenge', error: data });
    }

    return res.status(200).json({ message: 'Challenge created!', data });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating challenge', error: error.message });
  }
}
