const { API_URL, NODE_ENV, API_AUTH_TOKEN } = process.env;

const fetchData = async (endpoint: string) => {
  const url = `${API_URL}/${endpoint}`;
  const headers = { Authorization: `Bearer ${API_AUTH_TOKEN}` };
  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.error(`Error fetching data from ${url}: `, response.status);
      process.exit(1);
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}: `, error);
    process.exit(1);
  }
};

const getData = async () => {
  const correspondences = await fetchData('correspondence');
  const letters = await fetchData('letter');
  const recipients = await fetchData('recipient');
  return { correspondences, letters, recipients };
};

const getConfig = async () => {
  const { correspondences, letters, recipients } = await getData();
  return {
    output: 'export',
    env: {
      CORRESPONDENCES: JSON.stringify(correspondences),
      LETTERS: JSON.stringify(letters),
      RECIPIENTS: JSON.stringify(recipients),
    },
  };
};

module.exports = async () => await getConfig();
