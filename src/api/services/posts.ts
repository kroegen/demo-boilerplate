import Base from "../base";

export default class PostsService extends Base {
  public async fetchPosts() {
    return this.api.get("posts");
  }

  public async fetchPostById(postId: string) {
    return this.api.get(`posts/${postId}`);
  }
}
