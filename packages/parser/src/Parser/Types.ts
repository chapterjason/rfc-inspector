export interface Author {
    name: string;
    affiliation: string;
}

export interface TitlePageHeader {
    source: string;
    requestForComments: number;

    /**
     * @example: fyi, bcp and issn
     */
    subseries: Record<string, number>;

    /**
     * @example: obsoletes and updates
     */
    relations: Record<string, number>

    category: string;
    authors: Author[];

    month: string;
    year: number;
}

export interface Title {
    text: string;
}

export interface SectionTitle {
    text: string;
}
export interface Paragraph {
    text: string;
}

export interface TableOfContentsEntry {
    level: number;
    text: string;
}

export interface TableOfContents {
    sections: SectionTitle[];
}
