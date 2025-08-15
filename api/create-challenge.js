export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { territory, bet, carType, nitrous, altRoad, type } = req.body;

  if (!territory || !bet || !carType || !nitrous || !altRoad || !type) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const forumChannelId = process.env.FORUM_CHANNEL_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!forumChannelId || !botToken) {
    console.error('Missing environment variables:', { forumChannelId, botToken });
    return res.status(500).json({ message: 'Server configuration error: Missing Discord credentials' });
  }

  const messageContent = `
Territory yang digunakan : **${territory}**
Jumlah uang taruhan : ${bet}
Jenis Mobil : ${carType}
Nitrous : ${nitrous}
Alternative Road : ${altRoad}
Tipe : ${type}
  `.trim();

  try {
    // 1️⃣ Buat thread
    const threadResponse = await fetch(`https://discord.com/api/v10/channels/${forumChannelId}/threads`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Challenge: ${territory}`,
        auto_archive_duration: 1440, // 24 jam
        type: 11 // THREAD_PUBLIC
      }),
    });

    if (!threadResponse.ok) {
      const text = await threadResponse.text();
      console.error('Discord Thread Error:', text);
      return res.status(400).json({ message: 'Failed to create thread', error: text });
    }

    const threadData = await threadResponse.json();

    // 2️⃣ Kirim pesan ke thread
    const res = await fetch('/api/create-challenge', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});


    if (!messageResponse.ok) {
      const text = await messageResponse.text();
      console.error('Discord Message Error:', text);
      return res.status(400).json({ message: 'Failed to send message', error: text });
    }

    const messageData = await messageResponse.json();

    res.status(200).json({ message: 'Challenge created!', thread: threadData, message: messageData });

  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).json({ message: 'Error creating challenge', error: error.message });
  }
}
