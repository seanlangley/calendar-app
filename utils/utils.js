export async function check_fetch(url, method, token, post_data = '') {
    try {
        var url = 'http://localhost:8000/' + url;
        let fetch_args = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        }
        if (token != ''){
            fetch_args.headers.Authorization = 'Token ' + token;
        }
        if (method == 'POST') {
            fetch_args.body = JSON.stringify(post_data);
        }
        let response = await fetch(url, fetch_args);
        let json = await response.json();
        if (response.status.toString()[0] != '2') {
            console.log(json);
            return undefined;
        }
        return json;
    } catch (error) {
        console.error(error);
    }
}

