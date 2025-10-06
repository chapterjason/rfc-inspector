import type {EOFToken} from "./EOFToken.js";
import {LineToken} from "./LineToken";

export type Token = LineToken | EOFToken;
