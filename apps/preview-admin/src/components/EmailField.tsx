import { Email, domains } from "@smastrom/react-email-autocomplete";
import FormHelperText from "@mui/material/FormHelperText";
import { styled } from "@mui/material/styles";

const baseList = [
    "gmail.com",
    "yandex.ru",
    "mail.ru",
    "ya.ru",
    "inbox.ru",
    "bk.ru",
    "outlook.com",
];

const Root = styled("div")(({ theme }) => ({
    "& .email-wrap": {
        position: "relative",
    },
    "& .email-input": {
        width: "100%",
        boxSizing: "border-box",
        font: "inherit",
        fontSize: "1rem",
        lineHeight: 1.4375,
        padding: "16.5px 14px",
        color: theme.palette.text.primary,
        background: "transparent",
        border: `1px solid ${theme.palette.mode === "light" ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.23)"}`,
        borderRadius: theme.shape.borderRadius,
        outline: "none",
        "&:hover": {
            borderColor: theme.palette.text.primary,
        },
        "&:focus": {
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
            padding: "15.5px 13px",
        },
        "&[aria-invalid='true']": {
            borderColor: theme.palette.error.main,
        },
        "&[aria-invalid='true']:focus": {
            borderColor: theme.palette.error.main,
        },
    },
    "& .email-dropdown": {
        position: "absolute",
        zIndex: theme.zIndex.modal,
        left: 0,
        right: 0,
        margin: "4px 0 0",
        padding: `${theme.spacing(1)} 0`,
        listStyle: "none",
        background: theme.palette.background.paper,
        boxShadow: theme.shadows[8],
        borderRadius: theme.shape.borderRadius,
        overflow: "hidden",
    },
    "& .email-suggestion": {
        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
        cursor: "pointer",
        userSelect: "none",
        "&[data-active-email='true']": {
            background: theme.palette.action.hover,
        },
    },
    "& .email-domain": {
        color: theme.palette.primary.main,
        fontWeight: 500,
    },
}));

export function EmailField({
    id,
    value,
    onChange,
    error,
    helperText,
}: {
    id: string;
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
    helperText?: string;
}) {
    return (
        <Root>
            <Email
                id={id}
                name="email"
                required
                placeholder="your@email.com"
                spellCheck={false}
                aria-invalid={error || undefined}
                value={value}
                onChange={onChange}
                baseList={baseList}
                refineList={domains}
                classNames={{
                    wrapper: "email-wrap",
                    input: "email-input",
                    dropdown: "email-dropdown",
                    suggestion: "email-suggestion",
                    domain: "email-domain",
                }}
            />
            {helperText ? (
                <FormHelperText error={error}>{helperText}</FormHelperText>
            ) : null}
        </Root>
    );
}
