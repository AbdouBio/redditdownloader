document.addEventListener("DOMContentLoaded", function () {
  const fetchButton = document.getElementById("fetchButton");
  const redditLink = document.getElementById("redditLink");
  const mediaContainer = document.getElementById("mediaContainer");
  const errorElement = document.getElementById("error");

  // Define your Reddit API credentials
  const clientId = "nx5989FajF9Z0f3MDAi9Tw";
  const clientSecret = "xdE1WorHz6KJIVETNUYq8VIsxN7u7w";
  const basicAuth = btoa(`${clientId}:${clientSecret}`);

  fetchButton.addEventListener("click", async function () {
    const link = redditLink.value.trim();

    if (!link) {
      displayError("Please enter a Reddit post URL.");
      return;
    }

    if (!isValidRedditLink(link)) {
      displayError("Invalid Reddit post link. Please enter a valid Reddit post URL.");
      return;
    }

    try {
      const mediaData = await fetchRedditMedia(link, basicAuth);

      if (mediaData) {
        // Display the downloaded media content
        displayMediaContent(mediaData);
        errorElement.textContent = "";
      } else {
        displayError("No media data found for this Reddit post link.");
      }
    } catch (error) {
      displayError("An error occurred while fetching content.");
      console.error("Error:", error);
    }
  });

  function isValidRedditLink(link) {
    const redditLinkRegex = /^https?:\/\/(www\.)?reddit\.com\/r\/[^\/]+\/comments\/[a-z0-9]+\/.*/i;
    return redditLinkRegex.test(link);
  }

  async function fetchRedditMedia(link, basicAuth) {
    const redditApiUrl = `https://oauth.reddit.com/api/info.json?url=${link}`;
    
    try {
      const response = await fetch(redditApiUrl, {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "User-Agent": "YourApp/1.0" // Provide a user-agent for your app
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch media data from Reddit API");
      }

      const data = await response.json();

      if (data && data.data && data.data.children.length > 0) {
        const post = data.data.children[0].data;
        return {
          title: post.title,
          videoUrl: post.media ? post.media.reddit_video.fallback_url : null,
          gifUrl: post.preview ? post.preview.images[0].source.url : null,
        };
      } else {
        throw new Error("No data found for this Reddit post link.");
      }
    } catch (error) {
      console.error("Reddit API Error:", error);
      throw error;
    }
  }

  function displayMediaContent(mediaData) {
    // Customize this part to display the media content as needed
    mediaContainer.innerHTML = `
      <h3>Title: ${mediaData.title}</h3>
      <p>Video URL: <a href="${mediaData.videoUrl}" target="_blank">${mediaData.videoUrl || "Not available"}</a></p>
      <p>GIF URL: <a href="${mediaData.gifUrl}" target="_blank">${mediaData.gifUrl || "Not available"}</a></p>
    `;
  }

  function displayError(message) {
    errorElement.textContent = message;
  }
});
