const LOCAL_HOST = "http://localhost:3000/";
let isLoading = true;

const $ = document.querySelector.bind(document);
const listBook = $(".book_list");
const filterBook = $(".filter_book");
const titleBook = $(".title");
const getData = async () => {
  try {
    const data = await axios.get(`${LOCAL_HOST}books`);
    data.bookstore;
    if (data?.data?.bookstore?.book) {
      const html = handleMap(data.data.bookstore.book);
      listBook.innerHTML = html.join("");
    }
  } catch (error) {
    console.log(error);
  }
};

if (isLoading) {
  getData();
  isLoading = false;
}
const handleMap = (data) => {
  const htmls = data.map((item, i) => {
    return `<div class="item">
        <span  class="delete" onclick="handleDelete(this)">x</span>
        <h3 class="title"> 
        ${item.title[0]._}
                </h3>
                <p class=name><strong>Author:</strong> 
                ${item.author.map((data, i) => `${data} `)}
                </p><p class=year><strong>Year:</strong>  
                ${item.year[0]}
                </p><p class=price><strong>Price:</strong> $ 
                ${item.price[0]}
                </p></div>`;
  });

  return htmls;
};

window.onload = function () {
  document.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", handleDelete);
  });
};

const handleDelete = async (event) => {
  const button = event.target;
  const itemDiv = button.closest(".item");
  const title = itemDiv.querySelector(".title").innerText;

  try {
    const response = await axios.post(`${LOCAL_HOST}delete-book`, {
      title,
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

// create book

document
  .getElementById("addBookForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;
    const lang = document.getElementById("lang").value;

    // Gửi yêu cầu POST sử dụng axios
    try {
      if (title && author && year && price && category && lang) {
        const response = await axios.post(`${LOCAL_HOST}add-book`, {
          title: title,
          author: author,
          year: year,
          price: price,
          category: category,
          lang: lang,
        });
        console.log(response.data); // In dữ liệu phản hồi từ máy chủ
        alert("Book added successfully!");
      }
    } catch (error) {
      console.error(error); // In lỗi nếu có
      alert("Failed to add book!");
    }
  });

// update book
document
  .getElementById("updateBookForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("updateTitle").value;
    const author = document.getElementById("updateAuthor").value;
    const year = document.getElementById("updateYear").value;
    const price = document.getElementById("updatePrice").value;
    const category = document.getElementById("updateCategory").value;
    const lang = document.getElementById("updateLang").value;

    // Gửi yêu cầu POST sử dụng axios
    try {
      if (title && author && year && price && category && lang) {
        const response = await axios.post(`${LOCAL_HOST}update-book`, {
          title: title,
          author: author,
          year: year,
          price: price,
          category: category,
          lang: lang,
        });
        console.log(response.data);
        alert("Book added successfully!");
      }
    } catch (error) {
      console.error(error); // In lỗi nếu có
      alert("Failed to add book!");
    }
  });

document
  .getElementById("addBookForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;
    const lang = document.getElementById("lang").value;

    // Gửi yêu cầu POST sử dụng axios
    try {
      if (title && author && year && price && category && lang) {
        const response = await axios.post(`${LOCAL_HOST}add-book`, {
          title: title,
          author: author,
          year: year,
          price: price,
          category: category,
          lang: lang,
        });
        console.log(response.data); // In dữ liệu phản hồi từ máy chủ
        alert("Book added successfully!");
      }
    } catch (error) {
      console.error(error); // In lỗi nếu có
      alert("Failed to add book!");
    }
  });

// filter book
document
  .getElementById("filterBookForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.getElementById("filterTitle").value;
    const author = document.getElementById("filterAuthor").value;
    const year = document.getElementById("filterYear").value;
    const price = document.getElementById("filterPrice").value;

    // Gửi yêu cầu POST sử dụng axios
    try {
      if (title || author || year || price) {
        const response = await axios.post(`${LOCAL_HOST}filter-books`, {
          title: title,
          author: author,
          year: year,
          price: price,
        });

        if (response?.data) {
          const html = handleMap(response?.data);
          filterBook.innerHTML = html.join("");
        }
      }
    } catch (error) {
      console.error(error); // In lỗi nếu có
      alert("Failed to add book!");
    }
  });
