const hbs = require('hbs');
const dayjs = require('dayjs');
require('dayjs/locale/id'); // Impor locale Bahasa Indonesia

hbs.registerHelper('linkAnchor', function (cont, url, title) {
   if (title == undefined) {
      title = url;
   }
   return new hbs.SafeString('<a class="link__title ellipsis-2-lines fw-bold" href=" ' + cont + '/' + url + '">' + title + '</a>');
});


hbs.registerHelper('linkAnchorsmall', function (cont, url, title) {
   if (title == undefined) {
      title = url;
   }
   return new hbs.SafeString('<a class="link__title ellipsis-2-lines small fw-bold" href=" ' + cont + '/' + url + '">' + title + '</a>');
});

hbs.registerHelper('times', function (n, block) {
   let accum = '';
   let i = 0;
   for (i = 0; i < n; ++i)
      accum += block.fn(i);
   return accum;
});

hbs.registerHelper('for', function (from, to, incr, block) {
   let accum = '';
   let i = 0;
   for (i = from; i < to; i += incr)
      accum += block.fn(i);
   return accum;
});

hbs.registerHelper('forback', function (from, to, incr, block) {
   let accum = '';
   for (let i = from; i > to; i -= incr)
      accum += block.fn(i);
   return accum;
});

hbs.registerHelper('limit', function (arr, limit, options) {
   if (!Array.isArray(arr)) return '';
   return arr.slice(0, limit).map(item => options.fn(item)).join('');
});

hbs.registerHelper('isActive', function (navPath, currentPath, options) {
   return navPath === currentPath ? 'active' : '';
});

hbs.registerHelper('isNotRoot', function (currentPath, options) {
   return currentPath !== '/' ? 'whitebg' : '';
});

hbs.registerHelper('formatTanggalID', function (tanggal) {
   return dayjs(tanggal).tz('Asia/Jakarta').format('dddd, D MMMM YYYY [pukul] HH:mm');
});
hbs.registerHelper('incr', function (value) {
   return parseInt(value) + 1;
});

// Example helper registration in Express
hbs.registerHelper('linkAnchorAlt', function (base, slug, title) {
   return new Handlebars.SafeString(`<a href="/${base}/${slug}">${title}</a>`);
});

hbs.registerHelper('formatDate', function (date) {
   return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric'
   });
});

hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
   return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('len', function (array) {
   if (Array.isArray(array)) {
      return array.length;
   }
   return 0;
});

hbs.registerHelper('gt', function (a, b) {
   return a > b;
});

hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
   if (!options || typeof options.fn !== 'function' || typeof options.inverse !== 'function') {
      return ''; // Prevent "reading 'inverse'" error
   }

   switch (operator) {
      case '==': return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===': return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=': return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==': return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<': return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=': return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>': return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=': return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&': return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||': return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default: return options.inverse(this);
   }
});


hbs.registerHelper("eq", function (a, b) {
  return a === b;
});

hbs.registerHelper('eqcomp', (a, b) => String(a) === String(b));

hbs.registerHelper('money', function (amount, locale = 'id-ID', currency = 'IDR') {
   if (isNaN(amount)) return amount; // kalau bukan angka, return apa adanya
   return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0, // biasanya uang di Indonesia tanpa desimal
      maximumFractionDigits: 0
   }).format(amount);
});