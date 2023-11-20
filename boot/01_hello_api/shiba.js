async function fetchRandomShibeImage() {
    try {
        // 1から100のランダムな数を生成
        const count = Math.floor(Math.random() * 100) + 1;
        const response = await fetch(`http://shibe.online/api/shibes?count=${count}&urls=true&httpsUrls=true`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const imageUrls = await response.json();

        // 取得したURLの中からランダムに1つ選ぶ
        const randomIndex = Math.floor(Math.random() * imageUrls.length);
        const imageUrl = imageUrls[randomIndex];

        console.log(imageUrl);
    } catch (error) {
        console.error('Error fetching shibe image:', error);
    }
}

fetchRandomShibeImage();
