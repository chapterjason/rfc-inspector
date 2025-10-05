import type {BlankLexeme} from "./BlankLexeme.js";
import type {PageBreakLexeme} from "./PageBreakLexeme.js";
import type {EOFLexeme} from "./EOFLexeme.js";
import type {ContentLexeme} from "./ContentLexeme.js";
import type {FrontPageHeaderLexeme} from "./FrontPageHeaderLexeme.js";
import type {TitleLexeme} from "./TitleLexeme.js";
import type {PageHeaderLexeme} from "./PageHeaderLexeme.js";
import type {PageFooterLexeme} from "./PageFooterLexeme.js";
import type {HeadingLexeme} from "./HeadingLexeme.js";
import type {TOCLexeme} from "./TOCLexeme.js";
import type {TextLexeme} from "./TextLexeme.js";
import type {ListLexeme} from "./ListLexeme.js";
import type {BlockquoteLexeme} from "./BlockquoteLexeme.js";
import type {CodeLexeme} from "./CodeLexeme.js";
import type {CaptionLexeme} from "./CaptionLexeme.js";
import type {NoteLexeme} from "./NoteLexeme.js";
import type {FigureLexeme} from "./FigureLexeme.js";
import type {TableLexeme} from "./TableLexeme.js";

export type Lexeme =
    BlankLexeme
    | PageBreakLexeme
    | EOFLexeme
    | ContentLexeme
    | FrontPageHeaderLexeme
    | TitleLexeme
    | PageHeaderLexeme
    | PageFooterLexeme
    | HeadingLexeme
    | TOCLexeme
    | TextLexeme
    | ListLexeme
    | BlockquoteLexeme
    | CodeLexeme
    | CaptionLexeme
    | NoteLexeme
    | FigureLexeme
    | TableLexeme;