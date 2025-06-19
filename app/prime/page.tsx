import { Suspense } from "react";
import FeaturedBanner from "./components/home/FeaturedBanner";
import ContentRow from "./components/ContentRow";
import LoadingSkeleton from "./components/ui/LoadingSkeleton";
import {
  featuredContent,
  recentlyAdded,
  featuredOriginals,
  popularMovies,
  topTVShows,
} from "./lib/mockData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Stream Your Favorite Content",
  description:
    "Discover trending movies, TV shows, and exclusive originals on PrimeClone",
};

export default function HomePage() {
  return (
    <div className="pt-20 page-transition">
      <Suspense fallback={<LoadingSkeleton type="hero" />}>
        <FeaturedBanner content={featuredContent} />
      </Suspense>

      <div className="py-12 space-y-12">
        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow
            title="Featured Originals"
            items={featuredOriginals}
            seeMoreLink="#"
          />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow
            title="Trending Now"
            items={popularMovies}
            seeMoreLink="#"
          />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow
            title="Popular TV Shows"
            items={topTVShows}
            seeMoreLink="#"
          />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton type="row" />}>
          <ContentRow
            title="Recently Added"
            items={recentlyAdded}
            seeMoreLink="#"
          />
        </Suspense>
      </div>
    </div>
  );
}
