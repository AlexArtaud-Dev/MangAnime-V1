# THIS APPLICATION IS DEPRECATED AND WILL RECEIVE A NEW VERSION DURING SUMMER 2023

# Need Optimization due to new cloudflare bypass  



# MangAnime
MangAnime is a website to stream and download various animes videos.  
It's based on GogoAnime API and it's not an hosting solution for anime files.  
Online version : https://www.manganimes.me/   
(Updated each time there is a new release)  
To get an invitation key, send me a private message on discord : |Alex|#3227


# Preview (more will be added)
## Home Page
![image](https://user-images.githubusercontent.com/64975829/123013734-0d4b7880-d3c5-11eb-8676-5144abf6da0d.png)

## Login Page
![image](https://user-images.githubusercontent.com/64975829/123013899-61eef380-d3c5-11eb-886a-e053fbd8bd18.png)

## Register Page
![image](https://user-images.githubusercontent.com/64975829/123014094-c5792100-d3c5-11eb-9a72-6e6a0b4c1616.png)

## Trending Anime Page
![image](https://user-images.githubusercontent.com/64975829/123675939-92121880-d843-11eb-8453-7b7219655599.png)

## Search Anime Page
![image](https://user-images.githubusercontent.com/64975829/123676584-6ba0ad00-d844-11eb-928e-83bb9eff8dab.png)

## Watched Anime Page
![image](https://user-images.githubusercontent.com/64975829/123676665-870bb800-d844-11eb-88d5-be383aed7dc8.png)

## User Information Page
![image](https://user-images.githubusercontent.com/64975829/123676729-9d197880-d844-11eb-9de2-83d85122adac.png)

## QR Code Login (Working but will only be available when mobile app will be live)
![image](https://user-images.githubusercontent.com/64975829/123676875-bfab9180-d844-11eb-9a3a-b56c6fa6c56b.png)

## Admin User Management Page
![image](https://user-images.githubusercontent.com/64975829/123677048-f1245d00-d844-11eb-9bc4-09fe34df51db.png)

## Admin Key Generation Page
![image](https://user-images.githubusercontent.com/64975829/123677159-144f0c80-d845-11eb-98a6-9803be543305.png)

## Admin Key Management Page
![image](https://user-images.githubusercontent.com/64975829/123677278-33e63500-d845-11eb-88a4-9cba3f17e3d1.png)

## Back-end server informations page
![image](https://user-images.githubusercontent.com/64975829/123677332-45c7d800-d845-11eb-84be-3167f75fff2f.png)


# Back-end

Using Node JS to make an express REST API.  
The API is documented using Open API Swagger 3.  
MongoDB is the database we are using to store data of our application.

## Setup

At the root of the server folder, you need to do :

```bash
npm i
```

Then to configure the server you need to create a file at the root of the server folder, called ".env",
and put the following code inside, with your custom configuration :

```js
DB_CONNECTION = Replace by your mongoose cluster connection link
TOKEN_SECRET = Any token that you want (more than 16 random characters if possible)
ADMIN_TOKEN = Any token that you want (more than 16 random characters if possible)
ADMIN_TOKEN_SCIPHERED = The same token as ADMIN_TOKEN but sciphered to secure it
OWNER_SECRET_PASS = Any pass that you want (more than 16 random characters if possible)
```

Then start the server with 
```bash
npm start
```
OR
```bash
node app.js
```
OR
```bash
nodemon app.js
```

# Front-end

Using Javascript and React JS.  
We are currently using the style framework Ant Design.

## Setup

At the root of the client folder, you need to do :

```bash
npm i
```

Then to configure the client you need to create a file inside the "src" folder, called "config.js",
and put the following code inside, with your custom configuration :

```js
const IP = "Your client IP here with port 3000 (e.q: https://11.11.111.11:3000/)"
const ApiIP = "Your server IP here with port 5000  (e.q: https://11.11.111.11:5000/api)"
const DNS = "Your client DNS if hosted with on a server with a DNS"
module.exports = {
    IP,
    ApiIP,
    DNS
}
```
You need to change in the code wherever the variable DNS is, by the variable ApiIP, if you are not using a DNS service.


Inside the "src/Functions"", you need to create a file called "config.js" and put the following code inside, using a custom salt key :

```js
const SALT_HASH = "Your salt Key";

module.exports = {
    SALT_HASH
}
```


Then start the server with :
```bash
npm start
```
Or build the server using (then serve it with the command inside the CLI) :
```bash
npm run build
```

# Licence

MangAnime is distributed under the MIT License.
