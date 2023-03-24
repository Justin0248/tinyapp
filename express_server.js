const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

function generateRandomString() {
  let output = ''
for (let i = 0; i < 6; i++) {
output += characters.charAt(Math.floor(Math.random() * characters.length))
}
return output;
}

app.use(express.urlencoded({ extended: true }));

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
 let username = req.body.username
 console.log(username);
  res.cookie('_header', username);
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL; 
  res.redirect(`/urls/${shortURL}`);
});

app.post("/urls/:id/edit", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  if (longURL){
  urlDatabase[id] = longURL;
  }
  res.redirect(`/urls/${id}`);
});

app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
delete urlDatabase[id];
res.redirect("/urls");
});

app.get("/u/:id", (req, res) => {
  const url = req.params.id
   const longURL = urlDatabase[url];
  res.redirect(longURL);
});


app.get('/urls', (req, res) => {
    const templateVars = { urls: urlDatabase };
    res.render('urls_index', templateVars)
})

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });



  app.get("/urls/:id", (req, res) => {
    const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
    res.render("urls_show", templateVars);
  });
  
  app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});