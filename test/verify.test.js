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

describe('the task-menu-items class', () => {
  it('should be hidden by default', async () => {
    const display = await page.$eval('.task-menu-items', (taskMenuItems) => {
      let style = window.getComputedStyle(taskMenuItems);
      return style.getPropertyValue('display');
    });
      
    expect(display).toBe('none');
  });
});

describe('the task-menu class', () => {
  it('should display the task-menu-items class when hovered over', async () => {
    const matches = await page.$eval('style', (style) => {
      return style.innerHTML.match(/\.task-menu:hover.*\.task-menu-items.*{[\s\S][^}]*display.*:.*block.*;/g).length
    });
      
    expect(matches).toBe(1);
  });
});

describe('the anchors', () => {
  it('should not be underlined', async () => {
    const textDecoration = await page.$eval('.task-menu-items a', (anchors) => {
      let style = window.getComputedStyle(anchors);
      return style.getPropertyValue('text-decoration');
    });
      
    expect(textDecoration).toContain('none');
  });
});

describe('the anchor text', () => {
  it('should be black', async () => {
    const color = await page.$eval('.task-menu-items a', (anchors) => {
      let style = window.getComputedStyle(anchors);
      return style.getPropertyValue('color');
    });
    
    expect(color).toBe('rgb(0, 0, 0)');
  });
});

describe('the task-menu-items', () => {
  it('should not have bullet points', async () => {
    const listStyle = await page.$eval('.task-menu-items', (items) => {
      let style = window.getComputedStyle(items);
      return style.getPropertyValue('list-style');
    });
    
    expect(listStyle).toBe('outside none none');
  });
  
  it('should have padding of 10px', async () => {
    const padding = await page.$eval('.task-menu-items', (items) => {
      let style = window.getComputedStyle(items);
      return style.getPropertyValue('padding');
    });
    
    expect(padding).toBe('10px');
  });
});
