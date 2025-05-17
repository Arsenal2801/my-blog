import { Client } from '@notionhq/client';

const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });

export async function getContentByPage(pagina) {
  const response = await notion.databases.query({
    database_id: import.meta.env.NOTION_DATABASE_ID,
    filter: {
      property: 'page',
      select: { equals: pagina }
    },
    sorts: [{ property: 'published_at', direction: 'descending' }]
  });

  return response.results;
}

export async function getAllDatabaseItems() {
  const databaseId = import.meta.env.NOTION_DATABASE_ID;
  let allResults = [];
  let cursor = undefined;

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100, // máximo permitido por Notion
    });

    allResults = allResults.concat(response.results);
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);

  return allResults;
}

export async function getPageContent(pageId) {
  const blocks = [];
  let cursor;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });

    blocks.push(...response.results);
    cursor = response.has_more ? response.next_cursor : null;
  } while (cursor);

  return blocks;
}