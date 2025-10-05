import type {FormFeedLineToken} from "./FormFeedLineToken.js";
import type {BlankLineToken} from "./BlankLineToken.js";
import type {DataLineToken} from "./DataLineToken.js";
import type {EOFToken} from "./EOFToken.js";

export type Token = BlankLineToken | DataLineToken | FormFeedLineToken | EOFToken;