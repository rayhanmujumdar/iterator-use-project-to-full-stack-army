const url = "https://jsonplaceholder.typicode.com/users";
async function getData() {
  const { data: posts } = await axios.get(url);
  return posts.map((post) =>
    axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${post.id}`)
  );
}
let nextCount = 0;
let prevCount = 0;
async function* generateData() {
  const data = await getData();
  let i = -1;
  while (++i < data.length) {
    const allData = await data[i];
    yield allData.data;
    if (i === data.length - 1) {
      i = -1;
    }
  }
  //   for await (const v of data) {
  //     yield await v.data;
  //   }
}

async function* prevGenerateData() {
  const data = await getData();
  let i = data.length;
  while (i-- > 0) {
    const allData = await data[i];
    yield allData.data;
    if (i === 0) {
      i = data.length - 1;
    }
  }
}

// getElement to id
const nextBtn = document.getElementById("next_btn");
const prevBtn = document.getElementById("prev_btn");
const prevData = prevGenerateData();
const dataContainer = document.getElementById("dataContainer");
const nextData = generateData(nextCount);
(async () => {
  const { value: posts } = await nextData.next();
  content(posts);
})();

// Next btn click event
nextBtn.addEventListener("click", async function () {
  dataContainer.innerHTML = "";
  const { value: posts, done } = await nextData.next();
  if (done) {
    const getPosts = await getData();
    const { data: posts } = await getPosts[getPosts.length - 1];
    content(posts);
  } else {
    content(posts);
  }
});

// prev btn click event
prevBtn.addEventListener("click", async () => {
  dataContainer.innerHTML = "";
  const { value: prevPost, done } = await prevData.next();
  if (done) {
    const getPosts = await getData();
    const { data: posts } = await getPosts[0];
    content(posts);
  } else {
    content(prevPost);
  }
});

// post title visible to html
function content(posts) {
  posts?.forEach((post, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
             <h1>${post.userId}</h1>       
                  <p class="post_title"><span>${index + 1}</span>. ${
      post.title
    }</p>
              `;
    dataContainer.appendChild(div);
  });
}
