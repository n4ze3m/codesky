export const isTypeVideo = (type: string) => type === "app.bsky.embed.video#view";

export const videoInformations = (data: any) => {
    return [
        {
            ratio: data?.aspectRatio as { height: number; width: number; },
            playlist: data?.playlist,
            thumbnail: data?.thumbnail,
            cid: data?.cid
        }
    ]
}