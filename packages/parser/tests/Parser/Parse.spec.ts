import {describe, expect, it} from "vitest";
import {tokenize} from "@rfc-inspector/tokenizer";
import {Lexer} from "@rfc-inspector/lexer";
import {parse} from "../../src";
import {TreeWalker} from "../../src/index.js";
import {NodeType} from "../../src/index.js";
import {Node} from "../../src/index.js";

const lexer = new Lexer();
const walker = new TreeWalker();

function getTypeSequence(node: Node){
    const types: NodeType[] = [];

    walker.walk(node, (node: Node) => {
        types.push(node.type);
    })

    return types;
}

describe('Parse', () => {
    it('should parse the front page header', () => {
        const input = [
            '',
            '',
            '',
            '',
            'Internet Engineering Task Force (IETF)                       K. Moriarty',
            'Request for Comments: 8996                                           CIS',
            'BCP: 195                                                      S. Farrell',
            'Obsoletes: 5469, 7507                             Trinity College Dublin',
            'Updates: 3261, 3329, 3436, 3470, 3501, 3552,                     A. Name',
            '         3568, 3656, 3749, 3767, 3856, 3871,',         // no affiliation
            '         3887, 3903, 3943, 3983, 4097, 4111,                  March 2021',
            '         4162, 4168, 4217, 4235, 4261, 4279,',
            '         4497, 4513, 4531, 4540, 4582, 4616,',
            '         4642, 4680, 4681, 4712, 4732, 4743,',
            '         7465, 7525, 7562, 7568, 8261, 8422',
            'Category: Best Current Practice',
            'ISSN: 2070-1721',
            '',
        ];

        const document = parse(lexer.lex(
            Array.from(tokenize(input.join('\n')))
        ));

        expect(getTypeSequence(document)).toEqual([
            NodeType.DOCUMENT,
            NodeType.BLANK,
            NodeType.BLANK,
            NodeType.BLANK,
            NodeType.BLANK,
            NodeType.FRONT_PAGE_HEADER,
            NodeType.FRONT_PAGE_HEADER_SOURCE,
            NodeType.TEXT,
            NodeType.FRONT_PAGE_HEADER_REQUEST_FOR_COMMENTS,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.FRONT_PAGE_HEADER_LISTING,
            NodeType.TEXT,
            NodeType.TEXT,
            NodeType.FRONT_PAGE_HEADER_REFERENCE_LISTING,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.FRONT_PAGE_HEADER_REFERENCE_LISTING,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.DOCUMENT_REFERENCE,
            NodeType.TEXT,
            NodeType.FRONT_PAGE_HEADER_LISTING,
            NodeType.TEXT,
            NodeType.TEXT,
            NodeType.FRONT_PAGE_HEADER_LISTING,
            NodeType.TEXT,
            NodeType.TEXT,
            NodeType.FRONT_PAGE_HEADER_AUTHOR,
            NodeType.TEXT,
            NodeType.TEXT,
            NodeType.FRONT_PAGE_HEADER_AUTHOR,
            NodeType.TEXT,
            NodeType.TEXT,
            NodeType.FRONT_PAGE_HEADER_AUTHOR,
            NodeType.TEXT,
            NodeType.TEXT,
        ])
    });
});