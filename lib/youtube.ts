export type ParsedYoutubeVideo = {
  videoId: string;
  embedUrl: string;
  thumbnail: string;
};

export function parseYoutubeUrl(raw: string): ParsedYoutubeVideo {
  const input = raw.trim();
  if (!input) {
    throw new Error("YouTube URL is required.");
  }

  let videoId = "";

  try {
    const url = new URL(input.startsWith("http") ? input : `https://${input}`);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (url.pathname.startsWith("/embed/")) {
        videoId = url.pathname.split("/embed/")[1]?.split("/")[0] ?? "";
      } else if (url.pathname.startsWith("/shorts/")) {
        videoId = url.pathname.split("/shorts/")[1]?.split("/")[0] ?? "";
      } else if (url.pathname.startsWith("/live/")) {
        videoId = url.pathname.split("/live/")[1]?.split("/")[0] ?? "";
      } else {
        videoId = url.searchParams.get("v") ?? "";
      }
    } else {
      throw new Error("Enter a valid YouTube video link.");
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Enter a valid YouTube video link.") {
      throw error;
    }
    throw new Error("Enter a valid YouTube video link.", { cause: error });
  }

  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    throw new Error("Enter a valid YouTube video link.");
  }

  return {
    videoId,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  };
}
