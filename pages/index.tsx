import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "../components/Modal";
import cloudinary from "../utils/cloudinary";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import { FloatingPopover } from "../components/FloatingPopover";
import { Combobox } from "@headlessui/react";
import Member from "../components/Member";

import debounce from "lodash.debounce";

const PAGE_LOAD_EVENT = "rudder_page_loaded";
const PHOTO_CLICK_EVENT = "rudder_photo_clicked";
const PHOTO_SEARCH_EVENT = "rudder_photo_searched";

const DEFAULT_ANALYTICS_PAYLOAD = {
  currency: "USD",
  user_actual_id: 12345,
};

const Home: NextPage = ({
  images,
  rudder,
}: {
  images: ImageProps[];
  rudder: any;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const [analyticsEvent, setAnalyticsEvent] = useState(PAGE_LOAD_EVENT);
  const [analyticsPayload, setAnalyticsPayload] = useState(
    DEFAULT_ANALYTICS_PAYLOAD
  );

  useEffect(() => {
    rudder.identify("CC4FA6EE-0796-442A-883E-499AC6B495A0", {
      firstName: "Joshua",
      lastName: "Hayes",
      email: "joshua@somedomain.com",
    });

    rudder.track("rudder_custom_test_event", {
      ...analyticsPayload,
    });

    rudder.track(
      PAGE_LOAD_EVENT,
      {
        ...analyticsPayload,
      },
      () => {
        console.log("track call");
      }
    );
  }, [lastViewedPhoto]);

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  const onPhotoClick = ({ ...photo }) => {
    rudder.track(PHOTO_CLICK_EVENT, {
      photo,
    });
  };

  const filteredImages = !searchTerm
    ? images
    : images.filter((image) => {
        return (
          image.id.toString() === searchTerm ||
          image.public_id
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      });

  const debouncedTrackingSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm) {
        rudder.track(PHOTO_SEARCH_EVENT, {
          searchTerm,
        });
      }
    }, 500),
    []
  );

  return (
    <>
      <Head>
        <title>Centr + Rudderstack Hackday!</title>
        <meta
          property="og:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
        />
        <meta
          name="twitter:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
        />
      </Head>
      <main className="mx-auto max-w-[1960px]">
        <FloatingPopover />
        {photoId && (
          <Modal
            rudder={rudder}
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div
          style={{
            background:
              'url("https://web-cdn.centr.com/deploy/static/images/homepage/rebrand-hero-desktop.jpg?v=1") no-repeat center/cover',
          }}
          className="relative mb-5 h-screen w-screen  overflow-hidden rounded-lg bg-white/10 p-12"
        >
          <div
            style={{
              background:
                "linear-gradient(270.03deg, rgba(23, 28, 33, 0) 0.03%, rgba(23, 28, 33, 0.63) 54.68%, rgba(23, 28, 33, 0.9) 99.97%)",
            }}
            className={"absolute bottom-0 left-0 right-0 top-0 z-0"}
          ></div>
          <div className="relative z-10 flex h-full w-full flex-col">
            <div className="mb-8 flex w-full flex-shrink-0 flex-col gap-3">
              <div className="mb-5 flex items-center gap-16">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={(251 / 40) * 32}
                    height={32}
                    fill={"#F1EF17"}
                    viewBox="0 0 251 40"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.8127 30.2287C25.6906 39.357 37.9309 42.683 42.1465 37.6566C44.8419 34.4453 43.6084 28.5959 39.5259 22.4096C39.358 22.1302 38.9639 22.1189 38.7581 22.3646C38.6834 22.4526 38.6465 22.5611 38.6465 22.6707C38.6465 22.7587 38.6711 22.8468 38.7182 22.9256C41.4412 27.3807 42.2295 31.3701 40.3909 33.5608C37.1693 37.4007 27.1043 34.2559 17.9094 26.5413C15.7832 24.757 13.8914 22.8857 12.277 21.0143C13.5597 19.5228 14.9693 18.0016 16.4865 16.4844C25.1132 7.8567 33.9201 2.67472 36.1538 4.90844C37.7876 6.54226 35.4536 11.6946 30.7036 17.7201C30.4989 17.9791 30.5204 18.3517 30.7548 18.5861C31.0179 18.8492 31.4601 18.8564 31.7007 18.5656C38.4919 11.1786 41.6613 4.25736 38.3066 0.902695C35.0687 -2.33527 24.07 3.41281 13.7419 13.742C12.3579 15.127 11.0567 16.5223 9.84878 17.9094C6.27094 12.8042 5.02714 8.07884 7.0899 5.61991C8.85988 3.51109 12.6926 3.51006 17.3105 5.21452C17.5061 5.28618 17.7251 5.22988 17.8592 5.07018C17.9391 4.976 17.9759 4.86135 17.9759 4.74874C17.9759 4.55731 17.8674 4.37202 17.6699 4.30138C11.0987 1.57834 5.37213 1.47494 2.75043 4.59928C-0.221371 8.14128 1.58341 14.8865 6.71625 21.7545C1.03881 29.2469 -1.4969 35.9082 0.902653 38.3077C2.97053 40.3766 8.20471 38.7776 14.4094 34.6603C14.7574 34.4453 14.7922 33.9611 14.5066 33.6765C14.2947 33.4646 13.962 33.4288 13.7102 33.5915C9.49765 36.3197 6.16345 37.4099 4.90635 36.1528C3.40765 34.6541 5.24826 30.198 9.22534 24.8225C10.8704 26.6693 12.7418 28.4925 14.8127 30.2287ZM81.7483 25.0426H87.1668C87.565 25.0426 87.8526 25.4162 87.7615 25.8042C86.0468 33.1359 80.9068 37.2185 72.6138 37.2185C63.5489 37.2185 56.4312 30.9555 56.4312 21.6848C56.4312 12.4674 63.5489 6.15527 72.6138 6.15527C81.9418 6.15527 86.5587 12.2678 87.9274 18.021C88.0195 18.409 87.7298 18.7826 87.3316 18.7826H81.8865C81.6152 18.7826 81.3818 18.6014 81.3009 18.3424C80.051 14.3684 76.7168 11.8665 72.6148 11.8665C67.4554 11.8665 63.248 15.8241 63.248 21.6848C63.248 27.4964 67.2537 31.5072 72.6148 31.5072C74.7431 31.5072 76.6093 30.8787 78.0957 29.7536C79.4798 28.7095 80.5373 27.2425 81.1689 25.4613C81.2569 25.2135 81.4852 25.0426 81.7483 25.0426ZM182.978 12.3671C182.592 12.3671 182.277 12.0518 182.277 11.6658V7.35709C182.277 6.97115 182.592 6.65585 182.978 6.65585H211.433C211.819 6.65585 212.134 6.97115 212.134 7.35709V11.6658C212.134 12.0518 211.819 12.3671 211.433 12.3671H200.612V36.1129C200.612 36.4435 200.342 36.7138 200.01 36.7138H194.399C194.069 36.7138 193.799 36.4435 193.799 36.1129V12.3671H182.978ZM108.135 31.0035V24.1907H123.967C124.353 24.1907 124.668 23.8754 124.668 23.4895V19.1807C124.668 18.7948 124.353 18.4795 123.967 18.4795H108.136V12.368H125.47C125.855 12.368 126.171 12.0527 126.171 11.6668V7.35801C126.171 6.97207 125.855 6.65677 125.47 6.65677H101.923C101.593 6.65677 101.322 6.92703 101.322 7.25768V36.1138C101.322 36.4444 101.593 36.7147 101.923 36.7147H125.769C126.155 36.7147 126.471 36.3994 126.471 36.0134V31.7047C126.471 31.3188 126.155 31.0035 125.769 31.0035H108.135ZM164.648 6.65688H170.259C170.556 6.65688 170.858 6.9558 170.858 7.25779V36.1118C170.858 36.4148 170.555 36.7168 170.258 36.7168H165.647L140.295 10.8633C140.073 10.637 139.949 10.333 139.949 10.0167V7.25779C139.949 6.92713 140.219 6.65688 140.55 6.65688H145.156L164.043 25.8543V7.26188C164.043 6.92918 164.315 6.65688 164.648 6.65688ZM140.555 36.7168C140.222 36.7168 139.95 36.4445 139.95 36.1118H139.951V15.7013L146.59 22.469C146.7 22.5826 146.763 22.7341 146.763 22.8928V36.1159C146.763 36.4466 146.492 36.7168 146.162 36.7168H140.555ZM224.154 6.65688C223.824 6.65688 223.553 6.92713 223.553 7.25779V36.1159C223.553 36.4466 223.824 36.7168 224.154 36.7168H229.765C230.096 36.7168 230.366 36.4466 230.366 36.1159V27.2988H236.829L242.941 36.2162C243.142 36.5162 243.492 36.7168 243.743 36.7168H250.406C250.706 36.7168 250.806 36.5663 250.806 36.3657C250.806 36.2654 250.756 36.0658 250.505 35.7146L245.445 28.3C244.744 27.2476 243.842 26.2956 243.842 26.2956V26.1952C247.85 24.7917 250.606 21.736 250.606 17.1775C250.606 10.6145 245.396 6.65688 238.082 6.65688H224.154ZM230.366 21.8855V12.3671H237.63C241.387 12.3671 243.792 14.221 243.792 17.1764C243.792 20.1319 241.387 21.8855 237.63 21.8855H230.366Z"
                      fill={"#F1EF17"}
                    />
                  </svg>
                </div>
                <Image
                  src={"/g404.png"}
                  width={260}
                  height={32}
                  alt={"rudderstack"}
                />
                <h1 className="text-4xl font-bold text-white">Hackday</h1>
              </div>
              <div className="mb-16 flex flex-wrap items-center gap-4">
                <Member name="Geetha Sravanthi" avatarUrl={"/geetha.jpeg"} />
                <Member name="Jordy Lee" avatarUrl={"/jordy.jpeg"} />
                <Member name="Joshua Hayes" avatarUrl={"/josh.png"} />
                <Member name="Thuận Nguyễn" avatarUrl={"/thuan.jpeg"} />
              </div>
              <div>
                <h1 className="mb-5 text-6xl font-bold text-white">
                  Rudderstack anlaytics
                </h1>
                <h2 className="text-xl font-bold text-white">
                  Deliver trustworthy, real-time data
                </h2>
                <p className="text-md text-white">
                  RudderStack makes it easy to collect and send customer data to
                  the tools and teams that need it
                </p>
              </div>
            </div>
            <div className="h-auto w-full flex-grow-0 rounded-lg bg-white/30 p-4 backdrop-blur-sm">
              <h2 className="mb-5 text-xl font-bold text-white">
                All tracking events
              </h2>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Event name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        On
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        Identify event
                      </th>
                      <td className="px-6 py-4">Page loads</td>
                      <td className="px-6 py-4">
                        Send first name, last name, email to Rudderstack data
                        plane
                      </td>
                    </tr>
                    <tr className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        rudder_custom_test_event
                      </th>
                      <td className="px-6 py-4">Page loads</td>
                      <td className="px-6 py-4">
                        Test event for braze analytics tracking
                      </td>
                    </tr>
                    <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        rudder_page_loaded
                      </th>
                      <td className="px-6 py-4">Page loads</td>
                      <td className="px-6 py-4">Track page loaded event</td>
                    </tr>
                    <tr className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        rudder_photo_clicked
                      </th>
                      <td className="px-6 py-4">Photo clicked</td>
                      <td className="px-6 py-4">Track photo clicked event</td>
                    </tr>
                    <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        rudder_photo_opened
                      </th>
                      <td className="px-6 py-4">Photo opened</td>
                      <td className="px-6 py-4">Track photo opened event</td>
                    </tr>
                    <tr className="border-b bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                      >
                        rudder_photo_searched
                      </th>
                      <td className="px-6 py-4">on change photo searched</td>
                      <td className="px-6 py-4">Track photo searched event</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4 mt-16">
          <h3 className="mb-5 text-center text-3xl font-bold text-white">
            Photos gallery
          </h3>
          <form>
            <Combobox>
              <div className="relative mx-auto w-1/4 cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                <Combobox.Input
                  placeholder={"Search for photos by name or id"}
                  value={searchTerm}
                  className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                  onChange={(event) => {
                    const value = event.target.value;
                    setSearchTerm(value);

                    if (value) {
                      debouncedTrackingSearch(value);
                    }
                  }}
                />
              </div>
            </Combobox>
          </form>
        </div>
        <div className="columns-1 gap-4 p-8 sm:columns-2 xl:columns-3  2xl:columns-4">
          {filteredImages.map(
            ({ id, public_id, format, blurDataUrl, ...rest }) => (
              <Link
                key={id}
                href={`/?photoId=${id}`}
                as={`/p/${id}`}
                ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
                shallow
                className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
              >
                <Image
                  onClick={() =>
                    onPhotoClick({ id, public_id, format, ...rest })
                  }
                  alt="Next.js Conf photo"
                  className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                  style={{ transform: "translate3d(0, 0, 0)" }}
                  placeholder="blur"
                  blurDataURL={blurDataUrl}
                  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                  width={720}
                  height={480}
                  sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
                />
                <h2 className="text-center font-semibold text-white">
                  {public_id?.split("/")[1]}
                </h2>
              </Link>
            )
          )}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12"></footer>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute();
  let reducedResults: ImageProps[] = [];

  let i = 0;
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    });
    i++;
  }

  const blurImagePromises = results.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  return {
    props: {
      images: reducedResults,
    },
  };
}
