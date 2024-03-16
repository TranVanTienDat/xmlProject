const express = require("express");
const fs = require("fs");
const cors = require("cors");
const xml2js = require("xml2js");
const http = require("http");

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("success");
});

app.post("/add-book", (req, res) => {
  // Nhận dữ liệu sách từ yêu cầu POST
  const { title, author, year, price, category, lang } = req.body;
  console.log(title, author, year, price, category, lang);
  // Đọc tệp books.xml
  fs.readFile("books.xml", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Chuyển đổi XML thành đối tượng JSON
    xml2js.parseString(data, (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Thêm quyển sách mới vào đối tượng JSON
      result.bookstore.book.push({
        $: { category: category },
        title: [{ _: title, $: { lang: lang } }],
        author: [author],
        year: year,
        price: price,
      });

      // Chuyển đối tượng JSON thành XML
      const builder = new xml2js.Builder();
      const xml = builder.buildObject(result);

      // Ghi dữ liệu mới vào tệp books.xml
      fs.writeFile("books.xml", xml, "utf8", (err) => {
        if (err) {
          console.error("Error writing file:", err);
          res.status(500).send("Internal Server Error");
          return;
        }
        console.log("Book added successfully.");
        res.status(200).send("Book added successfully.");
      });
    });
  });
});

// delete book
app.post("/delete-book", (req, res) => {
  // Nhận tiêu đề sách từ yêu cầu POST
  const { title } = req.body;
  console.log("Deleting book with title:", title);

  // Đọc tệp books.xml
  fs.readFile("books.xml", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Chuyển đổi XML thành đối tượng JSON
    xml2js.parseString(data, (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Tìm và xóa quyển sách có tiêu đề cần xóa
      const index = result.bookstore.book.findIndex(
        (book) => book.title[0]._ === title
      );
      if (index !== -1) {
        result.bookstore.book.splice(index, 1);

        // Chuyển đối tượng JSON thành XML
        const builder = new xml2js.Builder();
        const xml = builder.buildObject(result);

        // Ghi dữ liệu mới vào tệp books.xml
        fs.writeFile("books.xml", xml, "utf8", (err) => {
          if (err) {
            console.error("Error writing file:", err);
            res.status(500).send("Internal Server Error");
            return;
          }
          console.log("Book deleted successfully.");
          res.status(200).send("Book deleted successfully.");
        });
      } else {
        console.log("Book not found.");
        res.status(404).send("Book not found.");
      }
    });
  });
});

// update book
app.post("/update-book", (req, res) => {
  // Nhận dữ liệu sách từ yêu cầu POST
  const { title, author, year, price, category, lang = "en" } = req.body;

  // Đọc tệp books.xml
  fs.readFile("books.xml", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Chuyển đổi XML thành đối tượng JSON
    xml2js.parseString(data, (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Tìm và cập nhật thông tin của quyển sách
      const index = result.bookstore.book.findIndex(
        (book) => book.title[0]._ === title
      );
      if (index !== -1) {
        result.bookstore.book[index] = {
          $: { category: category },
          title: [{ _: title, $: { lang: lang } }],
          author: [author],
          year: [year],
          price: [price],
        };

        // Chuyển đối tượng JSON thành XML
        const builder = new xml2js.Builder();
        const xml = builder.buildObject(result);

        // Ghi dữ liệu mới vào tệp books.xml
        fs.writeFile("books.xml", xml, "utf8", (err) => {
          if (err) {
            console.error("Error writing file:", err);
            res.status(500).send("Internal Server Error");
            return;
          }
          console.log("Book updated successfully.");
          res.status(200).send("Book updated successfully.");
        });
      } else {
        console.log("Book not found.");
        res.status(404).send("Book not found.");
      }
    });
  });
});

app.get("/books", (req, res) => {
  // Đọc tệp books.xml
  fs.readFile("books.xml", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Chuyển đổi XML thành đối tượng JSON
    xml2js.parseString(data, (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Trả về dữ liệu JSON cho máy khách
      res.status(200).json(result);
    });
  });
});

// filter
// app.post("/filter-books", (req, res) => {
//   // Nhận dữ liệu từ yêu cầu POST
//   const { title, author, price, year } = req.body;

//   // Tạo một đối tượng để chứa các điều kiện lọc
//   const filterConditions = {};

//   // Thêm các điều kiện không rỗng vào đối tượng lọc
//   if (title) filterConditions.title = title;
//   if (author) filterConditions.author = author;
//   if (price) filterConditions.price = price;
//   if (year) filterConditions.year = year;

//   // Đọc tệp books.xml
//   fs.readFile("books.xml", "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading file:", err);
//       res.status(500).send("Internal Server Error");
//       return;
//     }

//     // Chuyển đổi XML thành đối tượng JSON
//     xml2js.parseString(data, (err, result) => {
//       if (err) {
//         console.error("Error parsing XML:", err);
//         res.status(500).send("Internal Server Error");
//         return;
//       }

//       // Lọc sách dựa trên các điều kiện
//       const filteredBooks = result.bookstore.book.filter((book) => {
//         let match = true;
//         for (const [key, value] of Object.entries(filterConditions)) {
//           if (!book[key] || book[key][0]._ !== value) {
//             match = false;
//             break;
//           }
//         }
//         return match;
//       });

//       // Trả về kết quả cho máy khách
//       res.status(200).json(filteredBooks);
//     });
//   });
// });
app.post("/filter-books", (req, res) => {
  // Nhận dữ liệu từ yêu cầu POST
  const { title, author, price, year } = req.body;

  // Đọc tệp books.xml
  fs.readFile("books.xml", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Chuyển đổi XML thành đối tượng JSON
    xml2js.parseString(data, (err, result) => {
      if (err) {
        console.error("Error parsing XML:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Lọc sách dựa trên các điều kiện
      const filteredBooks = result.bookstore.book.filter((book) => {
        // Xác định các điều kiện lọc
        const titleMatch = !title || (book.title && book.title[0]._ === title);
        const authorMatch =
          !author || (book.author && book.author.includes(author));
        const priceMatch =
          !price ||
          (book.price && parseFloat(book.price[0]) === parseFloat(price));
        const yearMatch =
          !year || (book.year && parseInt(book.year[0]) === parseInt(year));

        // Trả về true nếu tất cả các điều kiện lọc đều khớp
        return titleMatch && authorMatch && priceMatch && yearMatch;
      });

      // Trả về kết quả cho máy khách
      res.status(200).json(filteredBooks);
    });
  });
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
