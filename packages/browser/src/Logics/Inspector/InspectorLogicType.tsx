import type {MakeLogicType} from "kea";
import type {InspectorLogicValues} from "./InspectorLogicValues.js";
import type {InspectorLogicActions} from "./InspectorLogicActions.js";
import type {InspectorLogicProps} from "./InspectorLogicProps.js";

export type InspectorLogicType = MakeLogicType<InspectorLogicValues, InspectorLogicActions, InspectorLogicProps>