const clientId = 'nx5989FajF9Z0f3MDAi9Tw';
const clientSecret = 'xdE1WorHz6KJIVETNUYq8VIsxN7u7w';
const userAgent = 'YourApp/1.0.0 (by /u/YourUsername)';

// Step 1: Authenticate and obtain an access token
const authData = new URLSearchParams({
  'grant_type': 'client_credentials',
});

const authHeaders = {
  'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
  'User-Agent': userAgent,
};

fetch('https://www.reddit.com/api/v1/access_token', {
  method: 'POST',
  headers: authHeaders,
  body: authData,
})
  .then(response => response.json())
  .then(data => {
    const accessToken = data.access_token;

    // Step 2: Use the access token to make authenticated requests
    const requestHeaders = {
      'Authorization': 'Bearer ' + accessToken,
      'User-Agent': userAgent,
    };

    // Example: Fetch content from a subreddit
    const subreddit = 'programming';
    fetch(`https://oauth.reddit.com/r/${subreddit}/.json`, {
      headers: requestHeaders,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Subreddit content:', data);
      })
      .catch(error => {
        console.error('Error fetching subreddit content:', error);
      });
  })
  .catch(error => {
    console.error('Authentication error:', error);
  });
