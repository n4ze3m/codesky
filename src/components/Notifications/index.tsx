import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../../lib/api";
import { Notification } from "@atproto/api/dist/client/types/app/bsky/notification/listNotifications";
import { Link } from "@tanstack/react-router";
import { toCamelCase } from "../../utils/to-camelcase";
import { CodePost } from "../Common/CodePost";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import {
  AtSign,
  GitFork,
  GitPullRequest,
  MessageCircle,
  Star,
  UserPlus,
} from "lucide-react";
import { GitCloneLoading } from "../Common/Loading";

export const NotificationsBody = () => {
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();

  const updateSeen = async () => {
    await agent.updateSeenNotifications();
    queryClient.invalidateQueries({
      queryKey: ["getUserNotification"],
    });
  };

  const groupNotifications = (notifs: Notification[]) => {
    let groups = notifs.reduce((p1: any[], p2) => {
      if ((p2.record as any)?.subject?.uri) {
        const exists = p1.findIndex(
          (i) =>
            i.reason == p2.reason &&
            i.subjectUri == (p2.record as any).subject.uri
        );
        if (exists > -1) {
          p1[exists].datas.push(p2);
          return p1;
        } else {
          const newData = {
            subjectUri: (p2.record as any).subject.uri,
            reason: p2.reason,
            post: p2.post || p2.record,
            datas: [p2],
          };
          return [...p1, newData];
        }
      } else {
        if (p2.reason == "follow") {
          const exists = p1.findIndex((i) => i.reason == "follow");
          if (exists > -1) {
            p1[exists].datas.push(p2);
            return p1;
          }
        }
        return [
          ...p1,
          {
            subjectUri: p2.uri,
            reason: p2.reason,
            post: p2.post || p2.record,
            datas: [p2],
          },
        ];
      }
    }, []);

    if (!groups || !groups.length) return groups;

    groups = groups.filter(
      (i, index) =>
        i.subjectUri &&
        groups.findIndex((p) => p.subjectUri && p.subjectUri == i.subjectUri) ==
          index
    );

    return groups;
  };

  const { data, status, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["getAllNotifications"],
    initialPageParam: "",
    queryFn: async ({ pageParam = "" }) => {
      const data = await agent.listNotifications({
        cursor: pageParam,
      });
      
      if (data.data?.notifications?.filter((i) => !i.isRead).length) {
        await updateSeen();
      }

      const notificationResponse: Notification[] = [];
      const locNotifs = data.data?.notifications;
      const uniqueUris = [
        ...new Set(
          locNotifs
            ?.filter(
              (i) =>
                i.reason == "mention" ||
                i.reason == "like" ||
                i.reason == "reply" ||
                i.reason == "repost"
            )
            .map((i) => (i?.record as any)?.subject?.uri)
            ?.filter((i) => i && typeof i != "undefined")
        ),
      ];

      if (uniqueUris.length) {
        const chunkSize = 25;
        for (let i = 0; i < uniqueUris.length; i += chunkSize) {
          const chunk = uniqueUris.slice(i, i + chunkSize);
          const result = await agent.api.app.bsky.feed.getPosts({
            uris: chunk,
          });

          let newNotifs = [...locNotifs];
          for (let i = 0; i < newNotifs.length; i++) {
            const post = newNotifs[i];
            let notifIndex = result.data.posts.findIndex(
              (i) => post.reasonSubject == i.uri
            );
            if (notifIndex > -1) {
              newNotifs[i].post = result.data.posts[notifIndex];
            }
          }
          notificationResponse.push(...newNotifs);
        }
      } else {
        notificationResponse.push(...locNotifs);
      }

      return {
        groups: groupNotifications(notificationResponse),
        cursor: data.data.cursor,
      };
    },
    getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === "pending") {
    return (
      <GitCloneLoading name="notifications" />
    );
  }

  if (status === "error") {
    return (
      <div className="terminal-window">
        <pre className="text-red-500">
          <code>Error: Failed to fetch notifications</code>
        </pre>
      </div>
    );
  }

  const renderNotificationIcon = (reason: string) => {
    const iconClass = "w-4 h-4 text-[#569cd6]";
    switch (reason) {
      case "like":
        return <Star className={iconClass} />;
      case "repost":
        return <GitFork className={iconClass} />;
      case "reply":
        return <GitPullRequest className={iconClass} />;
      case "mention":
        return <AtSign className={iconClass} />;
      case "follow":
        return <UserPlus className={iconClass} />;
      default:
        return <MessageCircle className={iconClass} />;
    }
  };

  const renderNotificationGroup = (group: any) => {
    const firstNotif = group.datas[0];
    const author = firstNotif.author;

    return (
      <div className="terminal-window my-3" key={group.subjectUri}>
        <div className="border-b border-[#2d2d2d] p-3">
          <div className="flex items-center space-x-2">
            {renderNotificationIcon(group.reason)}
            <span className="text-[#569cd6]">git commit</span>
            <span className="text-[#d4d4d4]">-m</span>
            <span className="text-[#ce9178]">
              "{group.datas.length} {group.reason}{" "}
              {group.datas.length > 1 ? "notifications" : "notification"}"
            </span>
          </div>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="syntax-keyword">from</span>
            <div className="flex -space-x-2">
              {group.datas.slice(0, 3).map((notif) => (
                <Link
                  to={`/u/${notif.author.handle}`}
                  key={notif.author.did}
                  className="hover:z-10 relative"
                >
                  <img
                    src={notif.author.avatar}
                    alt={toCamelCase(
                      notif.author.displayName || notif.author.handle
                    )}
                    className="size-6 rounded-full border-2 border-[#1e1e1e]"
                  />
                </Link>
              ))}
              {group.datas.length > 3 && (
                <div className="size-6 rounded-full bg-[#2d2d2d] flex items-center justify-center text-xs text-[#d4d4d4] border-2 border-[#1e1e1e]">
                  +{group.datas.length - 3}
                </div>
              )}
            </div>
          </div>

          <div className="code-line gap-2">
            <span className="syntax-keyword">branch</span>
            <span className="text-[#d4d4d4]">--track</span>
            <Link
              to={`/u/${author.handle}`}
              className="text-[#4ec9b0] hover:underline"
            >
              {toCamelCase(author.displayName || author.handle)}
            </Link>
          </div>

          {group?.post && (
            <div className="mt-4 border-l-2 border-[#569cd6] pl-4">
              <CodePost post={{ post: group.post }} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-[#858585]">
          <span>notifications</span>
        </div>
      </div>
      <div className="space-y-4">
        {data?.pages.map((page, i) => (
          <div key={i}>
            {page.groups.map(renderNotificationGroup)}
          </div>
        ))}
      </div>
      <div ref={ref} className="h-10" />
    </>
  );
};