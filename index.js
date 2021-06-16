const fs = require('fs');
const http = require('http');
const url = require('url');


// FILES

// Blocking, synchronous way

// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textInput);

// const textOutput = `This is what we know about avocado: ${textInput}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOutput);
// console.log('File written!');

// Non-blocking, asynchronous way

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) {
//         return console.log('ERROR');
//     }
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written!');
//             })
//         });
//     });
// });
// console.log('Will read file!');

// SERVER

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
  }


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((request, response) => {
    console.log(request.url);
    console.log(url.parse(request.url, true));
    const pathName = request.url;

    //Overview page
    if (pathName === '/' || pathName === '/overview'){

    response.writeHead(200, {'Content-type': 'text/html'});

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    // console.log(cardsHtml); // returns array of data strings as html. Needs to be joined into a single string

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
    response.end(output);


    //Product page
    }else if(pathName === '/product'){
    response.end('This is the PRODUCT');


    //API
    }else if(pathName === '/api'){
    response.writeHead(200, {'Content-type': 'application/json'});
    response.end(data);


    // Not found
    }else{
        response.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        response.end('<h1>Page not found!</h1>');
    }
    
});

server.listen(8000, '127.0.0.1', ()=> { // 8000 is a PORT, 127.0.0.1 = standard IP address for localhost
    console.log('Listening to request on port 8000');
}) 
