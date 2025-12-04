import { Tiktoken } from 'js-tiktoken/lite';
import o200k_base from 'js-tiktoken/ranks/o200k_base';

const tokenizer = new Tiktoken(
  // NOTE: o200k_base is the tokenizer for GPT-4o
  o200k_base,
);

const tokenize = (text: string) => {
  return tokenizer.encode(text);
};

const DATA = [
  {
    url: 'https://aihero.dev',
    title: 'AI Hero',
    courses: [
      'ai sdk course',
      'AI agent course',
    ]
  },
  {
    url: 'https://totaltypescript.com',
    title: 'Total TypeScript',
    courses: [
      'Pro workshops',
      'Free TS course',
    ]
  },
  {
    url: 'https://mattpocock.com',
    title: 'Matt Pocock',
    courses: []
  },
  {
    url: 'https://twitter.com/mattpocockuk',
    title: 'Twitter',
    courses: []
  },
];

const asXML = DATA.map((item) =>
  `<item url="${item.url}" title="${item.title}">\n${item.courses.map(c => '\t<subitem>' + c + '</subitem>').join('\n')}</item>`).join('\n');

const asJSON = JSON.stringify(DATA, null, 1);

const asMarkdown = DATA.map(
  (item) => `# ${item.title}\n- [${item.title}](${item.url})\n\n## Courses\n${item.courses.map(c => `- ${c}`).join('\n')}`
).join('\n\n');

console.log('Markdown tokens:', tokenize(asMarkdown).length);
console.log(asMarkdown);
console.log('--------------------------------');
console.log('XML tokens:', tokenize(asXML).length);
console.log(asXML);
console.log('--------------------------------');
console.log('JSON tokens:', tokenize(asJSON).length);
console.log(asJSON);
