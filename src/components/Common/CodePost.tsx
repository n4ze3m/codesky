import {
  FeedViewPost,
  PostView,
  ReasonRepost,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { toCamelCase } from "../../utils/to-camelcase";
import { useState } from "react";
import { Image } from "./Image";
import {
  AppBskyEmbedExternal,
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
} from "@atproto/api";
import { GitFork,  } from "lucide-react";
import QuoteBlock from "./QuoteBlock";
import { CodeImportHeader } from "./CodeImportHeader";
import { isTypeVideo, videoInformations } from "../../utils/video";
import { Star } from "./Star";
import { Repost } from "./Repost";
import { Comment } from "./Comment";

type Props = {
  post: FeedViewPost;
  isCompose?: boolean;
};

export const CodePost = ({ post, isCompose }: Props) => {
  const author = post?.post?.author;
  // @ts-ignore
  const content = post?.post?.record?.text;
  const displayName = toCamelCase(author?.displayName || "");
  const embed = post?.post?.embed as
    | AppBskyEmbedImages.View
    | AppBskyEmbedExternal.View
    | AppBskyEmbedRecord.View
    | AppBskyEmbedRecordWithMedia.View;

  const mainPost = post?.post;
  if (!mainPost) {
    return (
      <div className="terminal-window">
        <pre className="text-red-500">
          <code>
            Error: Post not found Status: 404 Message: This post has been
            deleted or is no longer available
          </code>
        </pre>
      </div>
    );
  }
  const renderActions = ({ post }: { post: FeedViewPost | PostView }) => {
    if (isCompose) return null;

    return (
      <div className="p-2 border-t border-[#2d2d2d]">
        <div className="code-line gap-2 flex flex-wrap items-center">
          <span className="syntax-keyword">const</span>
          <span className="text-[#d4d4d4]"> actions </span>
          <span className="syntax-operator">=</span>
          <span className="text-[#d4d4d4]"> {`{ `}</span>
          <Star post={post} />
          <span className="text-[#d4d4d4]">, </span>
          <Comment post={post} />
          <span className="text-[#d4d4d4]">, </span>
          <Repost post={post} />
          <span className="text-[#d4d4d4]"> {`}`}</span>
        </div>
      </div>
    );
  };

  const renderRepostHeader = () => {
    if (!post.reason) return null;
    return (
      <div className="p-3 border-b border-[#2d2d2d]">
        <div className="flex items-center space-x-2">
          <GitFork className="w-4 h-4 text-[#569cd6]" />
          <span className="text-sm text-[#569cd6]">
            Reposted by
            {/* {post.repost.type === 'repost' ? 'Forked' : 'Fork with changes'} by */}
          </span>
          {/* <img */}
          {/* src={post.repost.author.avatar} */}
          {/* alt={post.repost.author.name} */}
          {/* className="w-6 h-6 rounded-full" */}
          {/* /> */}
          <img
            src={(post.reason as ReasonRepost).by.avatar}
            alt={toCamelCase(
              (post.reason as ReasonRepost).by.displayName || ""
            )}
            className="size-4 rounded-full"
          />
          <span className="text-sm">
            {toCamelCase((post.reason as ReasonRepost).by.displayName || "")}
          </span>
        </div>
        {/* {post.repost.type === 'quote' && post.repost.content && (
          <div className="mt-2 pl-6 border-l-2 border-[#2d2d2d] text-[#d4d4d4]">
            <div className="syntax-comment">// Fork message:</div>
            <div className="text-sm">{post.repost.content}</div>
          </div>
        )} */}
      </div>
    );
  };

  const renderImages = (rImages: any) => {
    const [showImages, setShowImages] = useState(false);

    const images = rImages?.map((e: { alt: string; thumb: string }) => {
      return {
        alt: e?.alt,
        image: e?.thumb,
      };
    });

    if (!images.length) return null;

    return (
      <div>
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

  const renderVideo = (rVideo: any) => {
    const [showVideo, setShowVideo] = useState(false);
    const videoInfo = videoInformations(rVideo);

    return (
      <div>
        <div className="code-line syntax-comment">{"// Videos"}</div>
        <div
          className="code-line gap-2 cursor-pointer hover:opacity-80 hover:outline hover:outline-1 hover:outline-[#4a4a4a] rounded-md transition-all duration-200 group"
          onClick={() => setShowVideo(!showVideo)}
        >
          <span className="syntax-keyword">for</span>
          <span className="syntax-for-loop text-[#d4d4d4]">{` (const image of ${displayName}.videos)`}</span>
          <span className="text-[#d4d4d4]">{` {`}</span>
          <span className="ml-2 text-xs text-[#6e6e6e] group-hover:text-[#8e8e8e]">
            Click to view
          </span>
        </div>
        {showVideo && (
          <div className="ml-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {videoInfo.map(
                (
                  video: {
                    ratio: { height: number; width: number };
                    playlist: any;
                    thumbnail: any;
                    cid: any;
                  },
                  index: number
                ) => (
                  <div key={index} className="relative w-full">
                    <div
                      className="rounded-lg overflow-hidden bg-[#1e1e1e] shadow-lg"
                      style={{
                        paddingBottom: `${(video.ratio.height / video.ratio.width) * 100}%`,
                      }}
                    >
                      <video
                        className="absolute inset-0 w-full h-full object-cover"
                        poster={video.thumbnail}
                        controls
                        playsInline
                      >
                        <source
                          src={`https://ipfs.io/ipfs/${video.cid}`}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </div>
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

  const renderContent = (content?: string, embed?: any) => {
    return (
      <div className="p-4">
        {content && (
          <div className="code-line gap-2 mb-3">
            <span className="syntax-keyword">const</span>
            <span className="text-[#d4d4d4]"> content </span>
            <span className="syntax-operator">=</span>
            <span className="syntax-string">{` \`${content}\`;`}</span>
          </div>
        )}
        {embed && (
          <>
            {/* @ts-ignore */}
            {embed.images && renderImages(embed.images || [])}
            {/* @ts-ignore */}
            {embed.media &&
              // @ts-ignore
              embed?.media?.images &&
              // @ts-ignore
              renderImages(embed.media?.images || [])}
            {
              // @ts-ignore
              isTypeVideo(embed["$type"] || "") && renderVideo(embed)
            }
          </>
        )}
      </div>
    );
  };

  const renderQuote = (embed: any) => {
    if (!embed?.record) return null;

    if (isCompose) return null;

    return <QuoteBlock embed={embed as any} />;
  };

  if (!!post.reply && !post.reason) {
    return (
      <div className="reply-thread-container bg-[#1e1e1e] rounded-lg border border-[#2d2d2d]">
        <div className="thread-header border-b border-[#2d2d2d] p-2">
          <div className="code-line gap-1">
            <span className="syntax-keyword">class </span>
            <span className="text-[#4ec9b0]">ThreadResponse </span>
            <span className="text-[#d4d4d4]">extends </span>
            <span className="text-[#4ec9b0]">Thread </span>
            <span className="text-[#d4d4d4]">{`{`}</span>
          </div>
        </div>

        <div className="thread-content p-4">
          {post.reply.parent.cid != post.reply.root.cid &&
            // @ts-ignore
            post.reply.parent.author.did == post.reply.root.author.did && (
              <div className="parent-thread">
                <div className="code-line syntax-comment mb-2">
                  // Parent Thread
                </div>
                <CodePost post={{ post: post.reply.parent as any }} />
              </div>
            )}

          {(post.reply.parent.record as any)?.reply?.parent.cid !=
          (post.reply.parent.record as any)?.reply?.root.cid ? (
            <div className="expand-thread my-2">
              <div className="code-line gap-1">
                <span className="syntax-keyword">async </span>
                <span className="text-[#dcdcaa]">loadPreviousReplies</span>
                <span className="text-[#d4d4d4]">{`() {`}</span>
                <span className="text-[#569cd6] cursor-pointer hover:underline ml-2">
                  await thread.fetchMore()
                </span>
                <span className="text-[#d4d4d4]">{`}`}</span>
              </div>
            </div>
          ) : null}

          <div className="replies-container">
            <div className="code-line mb-2">
              <span className="syntax-keyword">constructor </span>
              <span className="text-[#d4d4d4]">{`() {`}</span>
            </div>

            <div className="pl-6 border-l-2 border-[#569cd6]">
              <div className="code-line syntax-comment">// Original Post</div>
              <CodePost post={{ post: post.reply.parent as any }} />
            </div>

            <div className="mt-4 pl-6 border-l-2 border-[#4ec9b0]">
              <div className="code-line syntax-comment">// Reply</div>
              <CodePost post={{ post: post.post as any }} />
            </div>

            <div className="code-line mt-2">
              <span className="text-[#d4d4d4]">{`}`}</span>
            </div>
          </div>
        </div>

        <div className="thread-footer border-t border-[#2d2d2d] p-2">
          <div className="code-line">
            <span className="text-[#d4d4d4]">{`}`}</span>
            <span className="syntax-comment ml-2">// End ThreadResponse</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`terminal-window ${isCompose ? "!rounded-b-none" : ""}`}>
      {renderRepostHeader()}
      <CodeImportHeader
        avatar={author?.avatar || ""}
        displayName={displayName}
        handle={author?.handle}
        time={post?.post?.indexedAt}
      />
      {renderContent(content, embed)}
      {renderQuote(embed)}
      {renderActions({
        post: mainPost,
      })}
    </div>
  );
};
