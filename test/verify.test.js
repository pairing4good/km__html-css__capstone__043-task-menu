const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the font on the body of the page', () => {
  it('should be Georgia', async () => {
    const fontFamily = await page.$eval('body', (body) => {
      let style = window.getComputedStyle(body);
      return style.getPropertyValue('font-family');
    });
      
    expect(fontFamily).toMatch(/Georgia/g);
  });
});

describe('the fallback font on the body of the page', () => {
  it(`should be 'Times New Roman'`, async () => {
    const fontFamily = await page.$eval('body', (body) => {
      let style = window.getComputedStyle(body);
      return style.getPropertyValue('font-family');
    });
      
    expect(fontFamily).toMatch(/Georgia.*,.*["']Times New Roman["']/g);
  });
});

describe('the next fallback font on the body of the page', () => {
  it('should be Times', async () => {
    const fontFamily = await page.$eval('body', (body) => {
      let style = window.getComputedStyle(body);
      return style.getPropertyValue('font-family');
    });
      
    expect(fontFamily).toMatch(/Georgia.*,.*["']Times New Roman["'].*,.*Times/g);
  });
});

describe('the last fallback font on the body of the page', () => {
  it('should be serif', async () => {
    const fontFamily = await page.$eval('body', (body) => {
      let style = window.getComputedStyle(body);
      return style.getPropertyValue('font-family');
    });
      
    expect(fontFamily).toMatch(/Georgia.*,.*["']Times New Roman["'].*,.*Times.*,.*serif/g);
  });
});

describe('the kanban column headings', () => {
  it('should be bolder', async () => {
    const fontWeight = await page.$eval('.task-status', (taskStatus) => {
      let style = window.getComputedStyle(taskStatus);
      return style.getPropertyValue('font-weight');
    });
      
    expect(fontWeight).toBe('700');
  });

  it('should have the first letter of each word capatilized through CSS styling', async () => {
    const textTransform = await page.$eval('.task-status', (taskStatus) => {
      let style = window.getComputedStyle(taskStatus);
      return style.getPropertyValue('text-transform');
    });
    
    expect(textTransform).toBe('capitalize');
  });
});