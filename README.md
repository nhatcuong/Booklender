This project is about creating a web based application to manage the books you lended to people.
It will support basic functionnalities like :
- Add new book
- Add new borrower
- Lend a book to a borrower
- Check to whom you have lended a book
- Take back book you lended
And more...

I write it in Python and AngularJS, since I learned them recently and feel like practicing. The coming css thing will likely be SASS, so that I can compare it to LESS that I used for 2 years now.

# README #

This will describe how to get the program running in a mac. I will try to find out how to do it on windows and linux if there are needs.

Install pip

```
#!bash

sudo easy_install pip
```

Install all requirements

```
#!bash

pip install -r requirements.txt
```

Start the server

```
#!bash

python startlending.py
```

Go to http://127.0.0.1:5000/