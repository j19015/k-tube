async function onClick(event){
    // data-url の値を取得
    const url = event.target.dataset.url;

    let result = "";
    try {
        const options = {};
        if (url === '/leapyear') {
            // url が /leapyear の場合は year を body に格納して POST する
            const yearText = document.querySelector('#year').value;

            if (!yearText.match(/^[0-9]+$/)) {
                throw new Error('数字を入力してください');
            }

            options.method = 'POST';
            options.headers = {
                'Content-Type': 'application/json'
            };

            const year = parseInt(yearText, 10)
            options.body = JSON.stringify({ year: year });
        } else {
            options.method = 'GET';
        }

        result += `[REQUEST] ${options.method} ${url}\n`;
        if (options.body) {
            result += `body: ${options.body}\n`;
        }

        response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const responseText = await response.text();
        result += `\n[RESPONSE] ${responseText}`;

    } catch (error) {
        result += `\n[ERROR] ${error.message}\n`;
    }

    document.querySelector("#result").innerText = result;
}

const hoge = document.querySelectorAll("#controller button").forEach((elm) => {
    // 各ボタンが押されたときに onClick が呼ばれるようにする
    elm.addEventListener('click', onClick);
});