"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const core_1 = require("@material-ui/core");
const MailboxList = ({ state }) => (react_1.default.createElement(core_1.List, null, state.mailboxes.map((value) => {
    return (react_1.default.createElement(core_1.Chip, { label: `${value.name}`, onClick: () => state.setCurrentMailbox(value.path), style: { width: 128, marginBottom: 10 }, color: state.currentMailbox === value.path ? "secondary" : "primary" }));
})));
exports.default = MailboxList;
//# sourceMappingURL=MailboxList.js.map