import type {BlankLineToken} from "./BlankLineToken";
import type {DataLineToken} from "./DataLineToken";
import type {FormFeedLineToken} from "./FormFeedLineToken";

export type LineToken = BlankLineToken | DataLineToken | FormFeedLineToken;