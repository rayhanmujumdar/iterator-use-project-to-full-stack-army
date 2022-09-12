const url = "https://jsonplaceholder.typicode.com/users";
async function getData() {
  const { data: posts } = await axios.get(url);
  return posts.map((post) =>
    axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${post.id}`)
  );
}

async function* generateData() {
  const data = await getData();
  for await (const v of data) {
    yield await v.data;
  }
}

async function* prevGenerateData() {
  const data = await getData();
  let i = data.length;
  while (i-- > 0) {
    yield await data[i];
  }
}
const prevData = prevGenerateData();
(async () => {
    const findData = await prevData.next()
    console.log(findData.value.data)
})();

const nextBtn = document.getElementById("next_btn");
const prevBtn = document.getElementById("prev_btn");
const findData = generateData();
const dataContainer = document.getElementById("dataContainer");
(async () => {
  const { value: posts } = await findData.next();
  content(posts);
})();
// Next btn click event
nextBtn.addEventListener("click", async function () {
  dataContainer.innerHTML = "";
  const { value: posts, done } = await findData.next();
  if (done) {
    console.log(true);
    const getPosts = await getData();
    const { data: posts } = await getPosts[getPosts.length - 1];
    content(posts);
  } else {
    content(posts);
  }
});
// prev btn click event
prevBtn.addEventListener("click", () => {});

function content(posts) {
  posts?.forEach((post, index) => {
    const div = document.createElement("div");
    div.innerHTML = `
                  <p class="post_title"><span>${index + 1}</span>. ${
      post.title
    }</p>
              `;
    dataContainer.appendChild(div);
  });
}
