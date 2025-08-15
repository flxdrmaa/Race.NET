export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Ekstrak data dari body request
  const { territory, bet, carType, nitrous, altRoad, type } = req.body;

  // Validasi semua field wajib
  if (!territory || !bet || !carType || !nitrous || !altRoad || !type) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Ambil konfigurasi dari variabel lingkungan
  const forumChannelId = process.env.FORUM_CHANNEL_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  // Validasi variabel lingkungan
  if (!forumChannelId || !botToken) {
    return res.status(500).json({ message: 'Server configuration error: Missing Discord credentials' });
  }

  // Format konten pesan untuk Discord
  const messageContent = `
Territory yang digunakan : **${territory}**
Jumlah uang taruhan : ${bet}
Jenis Mobil : ${carType}
Nitrous : ${nitrous}
Alternative Road : ${altRoad}
Tipe : ${type}
  `.trim();

  try {
    // Kirim permintaan ke Discord API untuk membuat thread
    const response = await fetch(`https://discord.com/api/v10/channels/${forumChannelId}/threads`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Challenge: ${territory}`,
        auto_archive_duration: 1440, // Durasi arsip dalam menit (24 jam)
        message: { content: messageContent },
      }),
    });

    // Ambil data respons dari Discord
    const data = await response.json();

    // Periksa status respons
    if (!response.ok) {
      console.error('Discord API Error:', data); // Log error untuk debugging
      return res.status(400).json({ message: 'Failed to create challenge', error: data });
    }

    // Berhasil, kembalikan respons sukses
    res.status(200).json({ message: 'Challenge created!', data });
  } catch (error) {
    console.error('Error in handler:', error); // Log error untuk debugging
    res.status(500).json({ message: 'Error creating challenge', error: error.message });
  }
}
