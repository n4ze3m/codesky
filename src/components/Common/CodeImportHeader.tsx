import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";

type Props = {
  avatar: string;
  displayName: string;
  handle: string;
  time?: string;
  noBorder?: boolean;
};

export const CodeImportHeader: React.FC<Props> = ({
  avatar,
  displayName,
  handle,
  time,
  noBorder,
}) => {
  return (
    <Link to={`/u/${handle}`}>
      <div
        className={`${noBorder ? "" : "px-2 sm:px-3 py-2 border-b border-[#2d2d2d]"}`}
      >
        <div className="code-line mb-2 gap-1 sm:gap-2 flex-wrap">
          <img
            src={avatar}
            alt={displayName}
            className="size-4 sm:size-5 ring-2 ring-[#2d2d2d]"
          />
          <span className="syntax-keyword">import</span>
          <span className="text-[#d4d4d4] text-sm sm:text-base break-all"> {displayName} </span>
          <span className="syntax-keyword">from</span>
          <span className="syntax-string text-sm sm:text-base break-all">{` '${handle}';`}</span>
        </div>
        <div className="mt-2 code-line syntax-comment">
          <span className="text-[10px] sm:text-xs">
            {time
              ? `// ${formatDistanceToNow(new Date(time), {
                  addSuffix: true,
                })}`
              : ""}
          </span>
        </div>
      </div>
    </Link>
  );
};
