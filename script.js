document.addEventListener("DOMContentLoaded", function () {
    const fetchButton = document.getElementById("fetchButton");
    const redditLink = document.getElementById("redditLink");
    const mediaContainer = document.getElementById("mediaContainer");
    const errorElement = document.getElementById("error");

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
            const mediaData = await fetchRedditMedia(link);

            // Display the downloaded media content
            displayMediaContent(mediaData);
            errorElement.textContent = "";
        } catch (error) {
            displayError("An error occurred while fetching content.");
            console.error("Error:", error);
        }
    });

    function isValidRedditLink(link) {
        const redditLinkRegex = /^https?:\/\/(www\.)?reddit\.com\/r\/[^\/]+\/comments\/[a-z0-9]+\/.*/i;
        return redditLinkRegex.test(link);
    }

    async function fetchRedditMedia(link) {
        const redditApiUrl = `https://www.reddit.com/api/info.json?url=${link}`;
        
        try {
            const response = await fetch(redditApiUrl);

            if (!response.ok) {
                throw new Error("Failed to fetch media data from Reddit API");
            }

            const data = await response.json();

            if (data && data.data && data.data.children.length > 0) {
                const post = data.data.children[0].data;
                const mediaData = {
                    title: post.title,
                    videoUrl: post.media ? post.media.reddit_video.fallback_url : null,
                    gifUrl: post.preview ? post.preview.images[0].source.url : null,
                };

                return mediaData;
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
            <p>Video URL: <a href="${mediaData.videoUrl}" target="_blank">${mediaData.videoUrl}</a></p>
            <p>GIF URL: <a href="${mediaData.gifUrl}" target="_blank">${mediaData.gifUrl}</a></p>
        `;
    }

    function displayError(message) {
        errorElement.textContent = message;
    }
});