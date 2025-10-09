
const digitsDot = "[0-9]{1,2}\\.";
const uppercaseTextDot = "[A-Z]{1}\\.";

const appendix = "Appendix ";

const spaces = "[ ]{1,}";

/**
 * @note Reminder to myself, YAGNI: ONLY EXPAND IF YOU SEE ONE AND THINK "YES LET'S ADD IT"
 */
const matchers = [
    digitsDot+spaces, // e.g. "1."
    digitsDot+digitsDot+spaces, // e.g. "1.1."
    digitsDot+digitsDot+digitsDot+spaces, // e.g. "1.1.1."

    appendix+uppercaseTextDot+spaces, // e.g. "Appendix A."
    uppercaseTextDot+digitsDot+spaces, // e.g. "A.1."
];

const numberingExpression = new RegExp("("+matchers.join('|')+")");

export function parseNumbering(data: string): string | undefined {
    const match = numberingExpression.exec(data);

    if (null !== match) {
        const numbering = match[1];

        if (numbering.trim().length > 0) {
            return numbering;
        }
    }

    return undefined;
}