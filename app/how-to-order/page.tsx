import { getActiveHowToOrderPosts } from "@/lib/data/howToOrderPosts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "How to Order",
  description: "How to order from Usamavet & Surgical.",
  alternates: {
    canonical: "/how-to-order",
  },
};

export default async function HowToOrderPage() {
  let posts: Awaited<ReturnType<typeof getActiveHowToOrderPosts>> = [];
  let loadError = "";

  try {
    posts = await getActiveHowToOrderPosts();
  } catch (error) {
    console.error("[how-to-order] Failed to load posts:", error);
    loadError = "Posts could not be loaded. Please try again.";
  }

  return (
    <div className="w-full bg-white min-h-[50vh]">
      {loadError ? (
        <div className="w-full px-4 py-16 text-center text-slate-600">{loadError}</div>
      ) : posts.length === 0 ? (
        <div className="w-full px-4 py-16 text-center text-slate-500">No posts yet.</div>
      ) : (
        <div className="w-full">
          {posts.map((post) => (
            <article key={post.id} className="w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt="How to order"
                className="w-full h-auto object-contain block"
              />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
