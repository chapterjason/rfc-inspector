export enum NodeType {
    // Semantic generic types
    DOCUMENT = 0,
    BLANK = 1,
    TEXT = 2,
    PARAGRAPH = 3,

    // Reference types
    DOCUMENT_REFERENCE = 4,

    // Front page header types
    FRONT_PAGE_HEADER = 5,
    FRONT_PAGE_HEADER_SOURCE = 6,
    FRONT_PAGE_HEADER_REQUEST_FOR_COMMENTS = 7,
    FRONT_PAGE_HEADER_REFERENCE_LISTING = 8,
    FRONT_PAGE_HEADER_LISTING = 9,
    FRONT_PAGE_HEADER_AUTHOR = 10,

    // unpinned
    TITLE,
    TABLE_OF_CONTENTS,
    TABLE_OF_CONTENTS_ENTRY,
    SECTION_TITLE,
}