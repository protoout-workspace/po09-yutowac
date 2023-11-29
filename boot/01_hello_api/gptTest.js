const fetchTagInfo = async (tagName) => {
    try {
      const url = `https://qiita.com/api/v2/tags/${encodeURIComponent(tagName)}`;
      const response = await fetch(url, { method: 'GET' });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const main = async () => {
    const tagName = 'JavaScript'; // ここで取得したいタグを指定
    const tagInfo = await fetchTagInfo(tagName);
  
    if (tagInfo) {
      console.log(tagInfo);
    }
  };
  
  main();
  