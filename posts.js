import { ApiHelper } from "./api-helper.js";

export class Posts {
  constructor() {
    this.state = {
      posts: [],
      isLoadingPosts: false,
    };
    this.apiHepler = new ApiHelper();
  }

  seState(newState) {
    this.state = newState;
  }

  async getPosts() {
    this.seState({ ...this.state, isLoadingPosts: true });
    const posts = await this.apiHepler.fetchFromPortal("/posts", 'GET');
    this.seState({ ...this.state, isLoadingPosts: false, posts });
    this.render();
  }

  async getPostComments(id) {
    const { posts } = this.state
    const postComments = await this.apiHepler.fetchFromPortal(`/posts/${id}/comments`, 'GET')
    const index = posts.findIndex(x => x.id === Number(id))
    // console.log({ index })
    if (index > -1) {
      const postsState = [...posts]
      postsState[index].comments = postComments
      this.seState({ ...this.state, posts: postsState })
      this.render()
    }
  }
  //   Update    ///////////////////////////////
  // ===========================================
  handleForm(id) {
    const { posts } = this.state
    const index = posts.findIndex(x => x.id === Number(id))
    if (index > -1) {
      document.querySelector('#title-input').value = posts[index].title
      document.querySelector('#body-input').value = posts[index].body
    }
    f
  }
  //   View    /////////////////////////////////
  // ===========================================
  async viewFun(id) {
    const { posts } = this.state
    const filterId = posts.filter((item) => item.id == id)
    const show = document.querySelector(".root")
    show.innerHTML = filterId.map((items) => {
      return `
      <div class="show_items">
          <div>${items.id}</div>
          <h4>${items.title}</h4>
          <p>${items.body}</p>
      </div>
      `
    }).join("")
  }
  //   Delete    ///////////////////////////////
  // ===========================================
  async deltFun(id) {
    const deletePosts = await this.apiHepler.fetchFromPortal(`/posts/${id}`, 'DELETE')
    console.log(deletePosts)
  }


  render() {
    const { posts, isLoadingPosts } = this.state;
    const postsList = document.querySelector("#posts-list");
    postsList.innerHTML = isLoadingPosts
      ? "<div>Loading...</div>"
      : posts
        .map((post) => {

          return `
                <div class="post-card">
                    <div>${post.id}</div>
                    <h4>${post.title}</h4>
                    <p>${post.body}</p>
                    ${post.comments ? `<div class="post-comments">
                      <p>Comments</p>
                    ${post.comments.map((comment, index) => {
            return `<div class="comment-card">${index + 1}: ${comment.name}</div>`
          }).join("")
              }</div>` : `<div class="link" data-tag-id="${post.id}">View comments</div>`}
                    <div class="post-buttons">
                        <button class="btn" data-tag-id="${post.id}-view">view</button>
                        <button class="btn" data-tag-id="${post.id}-update">Update</button>
                        <button class="btn" data-tag-id="${post.id}-delete">Delete</button>
                    </div>
                </div>
            `;
        })
        .join("");

    postsList.addEventListener('click', (e) => {
      const target = e.target.dataset.tagId

      if (!isNaN(target)) {
        this.getPostComments(target)
      }
      if (target.split("-")[1] === 'update') {
        const id = target.split("-")[0]
        if (id) {
          this.handleForm(id)
        }
      }
      if (target.split("-")[1] === 'view') {
        const id = target.split("-")[0]
        if (id) {
          this.viewFun(id)
        }
      }
      if (target.split("-")[1] === 'delete') {
        const id = target.split("-")[0]
        if (id) {
          this.deltFun(id)
        }
      }
    })
  }
  init() {
    this.getPosts();
    this.render();
  }
}