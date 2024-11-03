import {
  AppBskyActorDefs,
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
} from "@atproto/api";
import { toCamelCase } from "../../utils/to-camelcase";
import { CodeImportHeader } from "./CodeImportHeader";
import { Image } from "./Image";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { postLink } from "../../lib/post-link";

export default function QuoteBlock(props: {
  embed: AppBskyEmbedRecord.View | AppBskyEmbedRecordWithMedia.View;
  author?: AppBskyActorDefs.ProfileView;
  uri?: string;
  isQuote?: boolean;
  isNotif?: boolean;
  post?: any;
}) {
  const { author: propsAuthor, uri: propsUri, isQuote } = props;
  let embed = isQuote
    ? props.embed
    : props.embed.record?.author
      ? props.embed
      : props.embed.record;
  const author =
    propsAuthor ||
    //@ts-ignore
    embed?.record?.author ||
    (embed?.author as AppBskyActorDefs.ProfileView | any);
  // @ts-ignore
  const uri = propsUri || embed?.record?.uri || (embed?.uri as string);
  //@ts-ignore
  const displayName = toCamelCase(author?.displayName || "");
  //   const renderTerminalHeader = () => (
  //     <div className="terminal-header !py-1 !px-2">
  //       <div className="flex-1 text-center text-sm text-[#858585]">quote.js</div>
  //     </div>
  //   );

  if (!(embed && uri && author)) return null;

  const renderImages = (rImages: any) => {
    const [showImages, setShowImages] = useState(false);

    const images = rImages?.images?.map((e: { alt: string; thumb: string }) => {
      return {
        alt: e?.alt,
        image: e?.thumb,
      };
    });

    if (!images.length) return null;

    return (
      <div className="mt-4 ">
        <div className="code-line syntax-comment">{"// Images"}</div>
        <div
          className="code-line gap-2 cursor-pointer hover:opacity-80 hover:outline hover:outline-1 hover:outline-[#4a4a4a] rounded-md transition-all duration-200 group"
          onClick={() => setShowImages(!showImages)}
        >
          <span className="syntax-keyword">for</span>
          <span className="syntax-for-loop text-[#d4d4d4]">{` (const image of ${displayName}.images)`}</span>
          <span className="text-[#d4d4d4]">{` {`}</span>
          <span className="ml-2 text-xs text-[#6e6e6e] group-hover:text-[#8e8e8e]">
            Click to view
          </span>
        </div>

        {showImages && (
          <div className="ml-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {images.map(
                (img: { image: string; alt: string }, index: number) => (
                  <div key={index} className="relative aspect-square">
                    <Image src={img.image} alt={img.alt} />
                  </div>
                )
              )}
            </div>
          </div>
        )}

        <div className="code-line gap-2">
          <span className="text-[#d4d4d4]">{`}`}</span>
        </div>
      </div>
    );
  };
  return (
    <Link to={`/post/${postLink(props?.post, uri)}`}>
      <div className="border-t p-2 border-[#2d2d2d]">
        <CodeImportHeader
          noBorder
          avatar={author?.avatar || ""}
          displayName={displayName}
          handle={author?.handle}
          //@ts-ignore
          time={embed?.record?.indexedAt}
        />

        <div className="code-line gap-2">
          <span className="syntax-keyword">const</span>
          <span className="text-[#d4d4d4]"> c </span>
          <span className="syntax-operator">=</span>
          {/* @ts-ignore */}
          <span className="syntax-string">{` \`${(embed.record.value || (embed.record as any))?.text}\`;`}</span>
        </div>
        {isQuote
          ? ""
          : // @ts-ignore
            AppBskyEmbedImages.isView((embed.record.embeds as any)[0])
            ? // @ts-ignore
              renderImages((embed.record.embeds as any)[0])
            : ""}
      </div>
    </Link>
  );
}
