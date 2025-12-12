export const onRequestPost = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return new Response("Keine Datei hochgeladen", { status: 400 });
  }

  const csvText = await file.text();
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',');

  let xml = `<?xml version="1.0" encoding="utf-8"?>\n<phonebooks>\n<phonebook>\n`;

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const name = values[0] || '';
    const work = values[1] || '';
    const mobile = values[2] || '';
    const other = values[3] || '';

    // Hier ein Beispiel: wir nehmen mobile, sonst work, sonst other
    const number = mobile || work || other || '';

    xml += `  <contact>\n`;
    xml += `    <category>0</category>\n`;
    xml += `    <person>\n`;
    xml += `      <realName>${name}</realName>\n`;
    xml += `    </person>\n`;
    xml += `    <telephony nid="1">\n`;
    xml += `      <number type="home" prio="1" id="0">${number}</number>\n`;
    xml += `    </telephony>\n`;
    xml += `    <services />\n`;
    xml += `    <setup />\n`;
    xml += `    <features doorphone="0" />\n`;
    xml += `    <mod_time>${Math.floor(Date.now() / 1000)}</mod_time>\n`;
    xml += `    <uniqueid>${i}</uniqueid>\n`;
    xml += `  </contact>\n`;
  }

  xml += `</phonebook>\n</phonebooks>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Content-Disposition': 'attachment; filename="telefonbuch.xml"',
    },
  });
};
