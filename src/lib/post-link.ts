export const postLink = (post: any, uri: string | null = null) => {
    if (!post && !uri) return '';
    if (uri) {
        return `${uri?.split('/')[2]}/${uri?.split('/')[uri?.split('/').length - 1]}`;
    }
    return `${post?.uri?.split('/')[2]}/${post?.uri?.split('/')[post?.uri?.split('/').length - 1]}`;
}