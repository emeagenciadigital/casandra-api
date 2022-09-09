// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const { getItems, replaceItems } = require("feathers-hooks-common");
const { NotFound, NotAcceptable } = require("@feathersjs/errors");
const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");
const fs = require("fs");
const S3 = require("../../../utils/s3");
const s3 = new S3();

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { user } = context.params;

    const records = getItems(context);

    const [categories, products] = await Promise.all([
      context.app
        .service("categories")
        .getModel()
        .query()
        .select("slug")
        .where({ deletedAt: null }),
      context.app
        .service("products")
        .getModel()
        .query()
        .select("slug")
        .where({ deletedAt: null, status: "active" }),
    ]);

    const data = [];

    for (let index = 0; index < categories.length; index++) {
      const category = categories[index];
      data.push({ url: category.slug, changefreq: "daily", priority: 0.3 });
    }

    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      data.push({ url: product.slug, changefreq: "daily", priority: 0.3 });
    }

    // Create a stream to write to
    const stream = new SitemapStream({
      hostname: "https://estrategias-ltda.com/",
    });

    // Return a promise that resolves with your XML string
    streamToPromise(Readable.from(data).pipe(stream)).then(async (data) => {
      const content = data.toString();

      await fs.writeFile("./public/sitemap.xml", content, (err) => {
        if (err) {
          return;
        }
        // s3.uploadFile(`./public/sitemap.xml`, "sitemap/sitemap.xml");
      });
    });

    // context.params.query = query
    replaceItems(context, records);

    return context;
  };
};
