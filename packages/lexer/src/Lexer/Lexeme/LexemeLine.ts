import type {BlankLexeme} from "./BlankLexeme";
import type {PageBreakLexeme} from "./PageBreakLexeme";
import type {ContentLexeme} from "./ContentLexeme";
import type {FrontPageHeaderLexeme} from "./FrontPageHeaderLexeme";
import type {TitleLexeme} from "./TitleLexeme";
import type {PageHeaderLexeme} from "./PageHeaderLexeme";
import type {PageFooterLexeme} from "./PageFooterLexeme";
import type {HeadingLexeme} from "./HeadingLexeme";
import type {TOCLexeme} from "./TOCLexeme";
import type {TextLexeme} from "./TextLexeme";
import type {ListLexeme} from "./ListLexeme";
import type {BlockquoteLexeme} from "./BlockquoteLexeme";
import type {CodeLexeme} from "./CodeLexeme";
import type {CaptionLexeme} from "./CaptionLexeme";
import type {NoteLexeme} from "./NoteLexeme";
import type {FigureLexeme} from "./FigureLexeme";
import type {TableLexeme} from "./TableLexeme";

export type LexemeLine = BlankLexeme
    | PageBreakLexeme
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
    | TableLexeme