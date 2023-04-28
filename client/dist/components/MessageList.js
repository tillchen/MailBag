"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const core_1 = require("@material-ui/core");
const MessageList = ({ state }) => (react_1.default.createElement(core_1.Table, { stickyHeader: true, padding: "none" },
    react_1.default.createElement(core_1.TableHead, null,
        react_1.default.createElement(core_1.TableRow, null,
            react_1.default.createElement(core_1.TableCell, { style: { width: 120 } }, "Date"),
            react_1.default.createElement(core_1.TableCell, { style: { width: 300 } }, "From"),
            react_1.default.createElement(core_1.TableCell, null, "Subject"))),
    react_1.default.createElement(core_1.TableBody, null, state.messages.map((message) => (react_1.default.createElement(core_1.TableRow, { key: message.id, onClick: () => state.showMessage(message) },
        react_1.default.createElement(core_1.TableCell, null, new Date(message.date).toLocaleDateString()),
        react_1.default.createElement(core_1.TableCell, null, message.from),
        react_1.default.createElement(core_1.TableCell, null, message.subject)))))));
exports.default = MessageList;
//# sourceMappingURL=MessageList.js.map