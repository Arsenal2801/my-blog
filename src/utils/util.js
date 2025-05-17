export function formatNotionPage(page) {
  return {
    id: page[0].id,
    title: page[0].properties.title?.title?.[0]?.plain_text || 'Sin título',
    slug: page[0].properties.slug?.rich_text?.[0]?.plain_text || '',
    description: page[0].properties.description?.rich_text?.[0]?.plain_text || '',
    tags: page[0].properties.tags?.multi_select?.map(tag => tag.name) || [],
    page: page[0].properties.page?.select?.name || '',
    published: page[0].properties.published?.checkbox || false,
    published_at: page[0].properties.published_at?.date?.start || null,
    url: page[0].url,
    backgroundImage: page[0].cover?.external?.url || page[0].cover?.file?.url || null,
  };
}

export function formatBlock(block) {
  const { id, type } = block;
  const value = block[type];

  const getText = (richText) =>
    richText?.map(t => t.plain_text).join('') || '';

  switch (type) {
    case 'heading_1':
    case 'heading_2':
    case 'heading_3':
    case 'paragraph':
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return {
        id,
        type,
        text: getText(value.rich_text),
      };
    case 'image':
      return {
        id,
        type,
        url: value.type === 'external' ? value.external.url : value.file.url,
        caption: getText(value.caption),
      };
    default:
      return {
        id,
        type: 'unsupported',
        raw: block,
      };
  }
}


